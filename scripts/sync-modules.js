const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const ALLOWED_DOMAINS = [
  "cdn.jsdelivr.net",
  "cdnjs.cloudflare.com",
  "unpkg.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "raw.githubusercontent.com",
  "github.com",
  "githubusercontent.com",
  "user-images.githubusercontent.com",
  "private-user-images.githubusercontent.com",
  "objects.githubusercontent.com",
  "repository-images.githubusercontent.com",
  "opengraph.githubassets.com",
  "via.placeholder.com",
  "i.postimg.cc",
  "postimg.cc",
];

const GENERATED_HEADER = "# Generated from GitHub Discussions by sync-modules.";

const GRAPHQL_QUERY = `
  query($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      discussions(first: 100, after: $after, orderBy: {field: UPDATED_AT, direction: DESC}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          number
          title
          body
          author { login }
          createdAt
          updatedAt
          url
          comments(first: 100) {
            nodes {
              body
              author { login }
              createdAt
              updatedAt
              url
            }
          }
        }
      }
    }
  }
`;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const isUrlSafe = (url) => {
  if (!url) return true;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
};

const hasUnsafeContent = (yaml) => {
  const dangerous = [
    /eval\s*\(/i,
    /\bFunction\s*\(/i,
    /document\.cookie/i,
    /\blocalStorage\b/i,
    /\bsessionStorage\b/i,
    /\bXMLHttpRequest\b/i,
    /fetch\s*\((?!\s*["'`]\/api\/)/i,
    /<iframe\b/i,
    /javascript:/i,
    /data:text\/html/i,
    /<[^>]+\son\w+\s*=/i,
  ];
  return dangerous.some((pattern) => pattern.test(yaml));
};

const extractUrls = (text) => {
  const urls = [];
  const patterns = [
    /https?:\/\/[^\s"'<>),]+/g,
    /\b(?:src|href)=["']([^"']+)["']/gi,
    /url\(["']?([^"')]+)["']?\)/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const url = match[1] || match[0];
      if (url.startsWith("http")) {
        urls.push(url.replace(/[.,;]+$/, ""));
      }
    }
  }

  return [...new Set(urls)];
};

const stripBom = (text) => text.replace(/^\uFEFF/, "");

const stripHtmlComments = (text) =>
  text.replace(/<!--[\s\S]*?-->/g, "").trim();

const unquoteCodeFence = (text) =>
  stripBom(text)
    .replace(/\r\n/g, "\n")
    .replace(/^\s*\n+/, "")
    .replace(/\n+\s*$/, "");

const extractCodeBlocks = (body) => {
  const blocks = [];
  const fencePattern = /(^|\n)( {0,3})(`{3,}|~{3,})[ \t]*([^\n`]*)\n([\s\S]*?)(?:\n\2\3[ \t]*(?=\n|$)|$)/g;

  for (const match of body.matchAll(fencePattern)) {
    const language = match[4].trim().toLowerCase();
    const content = unquoteCodeFence(match[5]);
    if (content) {
      blocks.push({ language, content });
    }
  }

  return blocks;
};

const looksLikeHtml = (content) =>
  /<(?:style|script|div|section|article|ha-card|ha-icon|template|canvas|svg)\b/i.test(
    content,
  );

const looksLikeYamlCard = (content) =>
  /(^|\n)\s*type\s*:\s*custom:html-pro-card\b/i.test(content) ||
  /custom:html-pro-card\b/i.test(content);

const wrapHtmlAsYaml = (html) =>
  [
    "type: custom:html-pro-card",
    "do_not_parse: true",
    "content: |",
    ...html.split("\n").map((line) => `  ${line}`),
  ].join("\n");

const extractYamlContent = (body) => {
  const normalizedBody = body || "";
  const blocks = extractCodeBlocks(normalizedBody);

  const yamlCandidates = blocks.filter((block) => {
    const language = block.language.split(/\s+/)[0];
    return (
      ["yaml", "yml", "lovelace", "home-assistant", "ha", ""].includes(
        language,
      ) && looksLikeYamlCard(block.content)
    );
  });

  if (yamlCandidates.length > 0) {
    return yamlCandidates[0].content.trim();
  }

  const htmlCandidates = blocks.filter((block) => {
    const language = block.language.split(/\s+/)[0];
    return (
      ["html", "htm", "xml", "markup", ""].includes(language) &&
      looksLikeHtml(block.content)
    );
  });

  if (htmlCandidates.length > 0) {
    return wrapHtmlAsYaml(htmlCandidates[0].content.trim());
  }

  const cleanedBody = stripHtmlComments(normalizedBody);
  if (looksLikeYamlCard(cleanedBody)) {
    const lines = cleanedBody.split("\n");
    const start = lines.findIndex((line) =>
      /^\s*type\s*:\s*custom:html-pro-card\b/i.test(line),
    );
    if (start !== -1) {
      return lines.slice(start).join("\n").trim();
    }
  }

  return "";
};

const extractDescription = (body) => {
  const normalized = (body || "").replace(/\r\n/g, "\n");
  const explicitMatch = normalized.match(
    /(?:^|\n)\s*(?:\*\*)?(?:Description|描述|简介)(?:\*\*)?\s*[:：]?\s*\n+([\s\S]*?)(?=\n\s*#{1,6}\s|\n\s*(?:\*\*)?(?:Screenshot|截图|YAML|代码|Checklist)(?:\*\*)?\s*[:：]|\n```|$)/i,
  );
  if (explicitMatch) {
    return explicitMatch[1]
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\*\*/g, "")
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ")
      .slice(0, 240);
  }

  const englishMatch = normalized.match(/^This module provides[^\n]+/im);
  return englishMatch ? englishMatch[0].replace(/\*\*/g, "").trim() : "";
};

const extractField = (body, names) => {
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(
    `(?:^|\\n|\\|)\\s*(?:\\*\\*)?(?:${escaped.join("|")})(?:\\*\\*)?\\s*[:：]\\s*([^\\n|]+)`,
    "i",
  );
  const match = (body || "").match(pattern);
  return match ? match[1].replace(/\*\*/g, "").trim() : "";
};

const parseTitle = (title) => {
  const tagMatch = title.match(/^\[([^\]]+)\]\s*/);
  const tags = tagMatch
    ? tagMatch[1]
        .split(/[,，/|]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
  const name = title.replace(/^\[[^\]]+\]\s*/, "").trim();
  return { name, tags };
};

const titleFromBody = (body) => {
  const lines = (body || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const taggedLine = lines.find((line) => /^\[[^\]]+\]\s*\S/.test(line));
  if (taggedLine) return taggedLine.replace(/^#+\s*/, "");

  const heading = lines.find((line) => /^#{1,3}\s+\S/.test(line));
  if (heading) return heading.replace(/^#{1,3}\s+/, "");

  return "";
};

const slugify = (value, fallback) => {
  const ascii = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii || fallback;
};

const extractImageUrl = (body) => {
  const markdownMatch = (body || "").match(/!\[[^\]]*]\((https?:\/\/[^\s)]+)\)/);
  if (markdownMatch) return markdownMatch[1];

  const htmlMatch = (body || "").match(
    /<img[^>]+src=["'](https?:\/\/[^"']+)["']/i,
  );
  if (htmlMatch) return htmlMatch[1];

  const githubUploadMatch = (body || "").match(
    /https?:\/\/(?:user-images|private-user-images)\.githubusercontent\.com\/[^\s"'<>)]*/i,
  );
  return githubUploadMatch ? githubUploadMatch[0] : "";
};

const extensionFromUrl = (url) => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.match(/\.(png|jpg|jpeg|gif|webp)(?:$|[?#])/i)?.[1] || "png";
  } catch {
    return "png";
  }
};

const downloadImage = (url, dest, redirectCount = 0) =>
  new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error("too many redirects"));
      return;
    }

    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(
      url,
      { headers: { "User-Agent": "html-card-pro-sync" } },
      (response) => {
        if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
          const location = response.headers.location;
          response.resume();
          if (!location) {
            reject(new Error(`redirect without location: ${response.statusCode}`));
            return;
          }
          const nextUrl = new URL(location, url).toString();
          downloadImage(nextUrl, dest, redirectCount + 1).then(resolve, reject);
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          response.resume();
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
        file.on("error", reject);
      },
    );
    request.on("error", reject);
  });

const cleanupModuleFiles = (discussionNumber, keepFiles) => {
  ensureDir("mods");
  const prefix = `${discussionNumber}-`;
  const keep = new Set(keepFiles);
  for (const entry of fs.readdirSync("mods")) {
    if (!entry.startsWith(prefix) || !entry.endsWith(".yaml")) continue;
    const file = path.join("mods", entry);
    const content = fs.readFileSync(file, "utf8");
    if (!keep.has(file) && content.startsWith(GENERATED_HEADER)) {
      fs.unlinkSync(file);
    }
  }
};

const cleanupDeletedDiscussionFiles = (discussionNumbers) => {
  ensureDir("mods");
  for (const entry of fs.readdirSync("mods")) {
    if (!entry.endsWith(".yaml")) continue;
    const id = entry.match(/^(\d+)-/)?.[1];
    if (!id || discussionNumbers.has(Number(id))) continue;

    const file = path.join("mods", entry);
    const content = fs.readFileSync(file, "utf8");
    if (content.startsWith(GENERATED_HEADER)) {
      fs.unlinkSync(file);
    }
  }
};

const discussionToModule = async (source, options = {}) => {
  if (!source.body) {
    return { skipped: true, reason: "empty body", discussion: source };
  }

  const yamlContent = extractYamlContent(source.body);
  if (!yamlContent) {
    return {
      skipped: true,
      reason: "no html-pro-card code block",
      discussion: source,
    };
  }

  if (hasUnsafeContent(yamlContent)) {
    options.log?.(`Warning ${source.id}: content matched safety patterns`);
  }

  const urls = extractUrls(yamlContent);
  const unsafeUrls = urls.filter((url) => !isUrlSafe(url));
  if (unsafeUrls.length > 0) {
    options.log?.(`Warning ${source.id}: external URLs: ${unsafeUrls.join(", ")}`);
  }

  const { name, tags } = parseTitle(source.title);
  const author =
    extractField(source.body, ["Author", "作者"]) || source.author?.login || "";
  const version = extractField(source.body, ["Version", "版本"]) || "1.0";
  const description = extractDescription(source.body);
  const safeName = slugify(name, `module-${source.number}`);
  const filenamePrefix =
    source.kind === "comment"
      ? `${source.number}-comment-${source.commentIndex}`
      : `${source.number}`;
  const filename = `mods/${filenamePrefix}-${safeName}.yaml`;

  const imgUrl = extractImageUrl(source.body);
  let image = "";
  if (imgUrl) {
    if (!isUrlSafe(imgUrl)) {
      options.log?.(`  Ignored unsafe image URL for #${source.number}: ${imgUrl}`);
    } else {
      const ext = extensionFromUrl(imgUrl);
      const imgFilename =
        source.kind === "comment"
          ? `images/${source.number}-comment-${source.commentIndex}.${ext}`
          : `images/${source.number}.${ext}`;
      if (options.downloadImages !== false) {
        ensureDir("images");
        try {
          await downloadImage(imgUrl, imgFilename);
          image = `https://cdn.jsdelivr.net/gh/ha-china/html-card-pro@main/${imgFilename}`;
          options.log?.(`  Downloaded image: ${imgFilename}`);
        } catch (error) {
          image = imgUrl;
          options.log?.(
            `  Failed to download image for #${source.number}: ${error.message}`,
          );
        }
      } else {
        image = imgUrl;
      }
    }
  }

  const header = [
    GENERATED_HEADER,
    `# ${name}`,
    `# Author: ${author}`,
    `# Version: ${version}`,
    `# Description: ${description}`,
    `# Tags: ${tags.join(", ")}`,
    `# Image: ${image}`,
    `# Link: ${source.url}`,
    `# ID: ${source.id}`,
    "",
    yamlContent.trim(),
    "",
  ].join("\n");

  return {
    skipped: false,
    filename,
    content: header,
    module: {
      id: source.id,
      name,
      version,
      creator: author,
      description,
      tags,
      image,
      link: source.url,
      file: filename,
    },
  };
};

const discussionSources = (disc) => {
  const sources = [
    {
      ...disc,
      id: disc.number,
      kind: "discussion",
      title: disc.title,
      number: disc.number,
    },
  ];

  for (const [index, comment] of (disc.comments?.nodes || []).entries()) {
    const commentIndex = index + 1;
    sources.push({
      ...comment,
      id: `${disc.number}-comment-${commentIndex}`,
      kind: "comment",
      commentIndex,
      title: titleFromBody(comment.body) || disc.title,
      number: disc.number,
    });
  }

  return sources;
};

const fetchDiscussions = async ({ github, context }) => {
  const discussions = [];
  let after = null;

  do {
    const result = await github.graphql(GRAPHQL_QUERY, {
      owner: context.repo.owner,
      name: context.repo.repo,
      after,
    });
    const connection = result.repository.discussions;
    discussions.push(...connection.nodes);
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);

  return discussions;
};

const writeModules = async (discussions, options = {}) => {
  ensureDir("mods");
  ensureDir("images");
  if (options.fullSync) {
    cleanupDeletedDiscussionFiles(
      new Set(discussions.map((discussion) => discussion.number)),
    );
  }

  const modules = [];
  const skipped = [];
  for (const disc of discussions) {
    const results = [];
    for (const source of discussionSources(disc)) {
      const result = await discussionToModule(source, options);
      if (result.skipped) {
        skipped.push(result);
        options.log?.(`Skipped ${source.id} ${source.title}: ${result.reason}`);
        continue;
      }

      results.push(result);
    }

    if (results.length > 0) {
      cleanupModuleFiles(
        disc.number,
        results.map((result) => result.filename),
      );
    }

    for (const result of results) {
      fs.writeFileSync(result.filename, result.content);
      modules.push(result.module);
      options.log?.(
        `Synced ${result.module.id} ${result.module.name} -> ${result.filename}`,
      );
    }
  }

  modules.sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, {
    numeric: true,
  }));
  fs.writeFileSync("store.json", `${JSON.stringify(modules, null, 2)}\n`);
  fs.writeFileSync(
    "sync-report.json",
    `${JSON.stringify(
      {
        generated: modules.map((module) => ({
          id: module.id,
          name: module.name,
          file: module.file,
        })),
        skipped: skipped.map((result) => ({
          id: result.discussion.id,
          title: result.discussion.title,
          reason: result.reason,
          url: result.discussion.url,
        })),
      },
      null,
      2,
    )}\n`,
  );
  options.log?.(`Generated ${modules.length} modules (${skipped.length} skipped)`);

  return { modules, skipped };
};

const syncDiscussions = async ({ github, context, log = console.log }) => {
  const discussions = await fetchDiscussions({ github, context });
  return writeModules(discussions, { fullSync: true, log });
};

module.exports = {
  ALLOWED_DOMAINS,
  extractCodeBlocks,
  extractYamlContent,
  discussionSources,
  discussionToModule,
  fetchDiscussions,
  hasUnsafeContent,
  isUrlSafe,
  syncDiscussions,
  writeModules,
};
