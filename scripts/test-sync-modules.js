const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const {
  extractYamlContent,
  discussionToModule,
  discussionSources,
  hasUnsafeContent,
  writeModules,
} = require("./sync-modules");

const oldCwd = process.cwd();
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "html-card-pro-sync-"));
process.chdir(tmpDir);

const discussion = (overrides) => ({
  number: 1,
  title: "[Style] Example",
  body: "",
  author: { login: "tester" },
  url: "https://github.com/ha-china/html-card-pro/discussions/1",
  ...overrides,
});

const yaml = `type: custom:html-pro-card
do_not_parse: true
content: |
  <style>.card { color: var(--primary-text-color); }</style>
  <div class="card">OK</div>`;

const run = async () => {
  assert.strictEqual(hasUnsafeContent("const onlineData = {};"), false);
  assert.strictEqual(hasUnsafeContent("root._onHassUpdate = () => {};"), false);
  assert.strictEqual(hasUnsafeContent("<button onclick=\"run()\">"), true);

  assert.strictEqual(
    (
      await discussionToModule(
        discussion({
          body: `**Author**: knoop7 | **Version**: 1.0

\`\`\`yaml
${yaml}
\`\`\``,
        }),
        { downloadImages: false },
      )
    ).module.creator,
    "knoop7",
  );

  assert.strictEqual(
    extractYamlContent(`## YAML\n\`\`\`yml\n${yaml}\n\`\`\``),
    yaml,
  );

  assert.strictEqual(
    extractYamlContent(`## YAML\n\`\`\`\n${yaml}\n\`\`\``),
    yaml,
  );

  assert.match(
    extractYamlContent(
      "## HTML\n```html\n<style>.x{}</style>\n<!-- keep -->\n<div>OK</div>\n```",
    ),
    /^type: custom:html-pro-card\n[\s\S]*<!-- keep -->/,
  );
  assert.match(
    extractYamlContent("```\n<style>.x{}</style>\n<div>OK</div>\n```"),
    /^type: custom:html-pro-card\n/,
  );
  assert.match(
    extractYamlContent(
      "```\n<div>short</div>\n```\n\n```\n<style>.x{}</style>\n<div>long</div>\n<script>root.x = true;</script>\n```",
    ),
    /<div>short<\/div>[\s\S]*<script>root\.x = true;<\/script>/,
  );
  assert.match(
    extractYamlContent(
      "```html\n<style>.x{}</style>\n```\n\n```html\n<div>body</div>\n```\n\n```html\n<script>root.x = true;</script>\n```",
    ),
    /<script>root\.x = true;<\/script>/,
  );
  assert.match(
    extractYamlContent("    <style>.x{}</style>\n    <div>OK</div>"),
    /^type: custom:html-pro-card\n/,
  );

  const minecraft = await discussionToModule(
    discussion({
      number: 12,
      title: "[Style] 我们评论区Minecraft 风格的 Home Assistant 平板中控仪表盘",
      body: `## Module Info

**Author**: JochenZhou
**Version**: 1.0

## Description

方块风格平板中控。

## YAML Code

\`\`\`
${yaml}
\`\`\`
`,
    }),
    { downloadImages: false },
  );
  assert.strictEqual(minecraft.skipped, false);
  assert.strictEqual(
    minecraft.module.name,
    "我们评论区Minecraft 风格的 Home Assistant 平板中控仪表盘",
  );
  assert.strictEqual(minecraft.module.creator, "JochenZhou");
  assert.match(minecraft.filename, /^mods\/12-minecraft-home-assistant\.yaml$/);

  const synology = await discussionToModule(
    discussion({
      number: 10,
      title: "[Style] 群晖 NAS 状态监控面板 / Synology NAS Status Panel",
      body: `**作者**: fenglibo51
**版本**: 1.0

\`\`\`yaml
${yaml}
\`\`\``,
    }),
    { downloadImages: false },
  );
  assert.strictEqual(synology.skipped, false);
  assert.strictEqual(synology.module.creator, "fenglibo51");
  assert.strictEqual(
    synology.filename,
    "mods/10-nas-synology-nas-status-panel.yaml",
  );

  const nest = await discussionToModule(
    discussion({
      number: 11,
      title:
        "[Style] 极简 Nest 风格的空调控制面板/minimalist Nest-inspired climate control dashboard",
      body: `**Author**: fenglibo51

\`\`\`lovelace
${yaml}
\`\`\``,
    }),
    { downloadImages: false },
  );
  assert.strictEqual(nest.skipped, false);
  assert.strictEqual(
    nest.filename,
    "mods/11-nest-minimalist-nest-inspired-climate-control-dashboard.yaml",
  );

  fs.mkdirSync("mods");
  fs.writeFileSync(
    "mods/10-old-title.yaml",
    "# Generated from GitHub Discussions by sync-modules.\n# stale\n",
  );
  await writeModules(
    [
      discussion({
        number: 10,
        title: "[Style] 群晖 NAS 状态监控面板 / Synology NAS Status Panel",
        body: `\`\`\`yaml\n${yaml}\n\`\`\``,
      }),
    ],
    { downloadImages: false },
  );
  assert.deepStrictEqual(fs.readdirSync("mods"), [
    "10-nas-synology-nas-status-panel.yaml",
  ]);

  const sourceDiscussion = discussion({
    number: 13,
    title: "[Style] Main discussion",
    body: `\`\`\`yaml\n${yaml}\n\`\`\``,
    comments: {
      nodes: [
        {
          body: `# [Style] Comment Minecraft

\`\`\`
${yaml}
\`\`\``,
          author: { login: "JochenZhou" },
          url: "https://github.com/ha-china/html-card-pro/discussions/13#discussioncomment-1",
        },
        {
          body: `# [Style] Comment Nest

\`\`\`lovelace
${yaml}
\`\`\``,
          author: { login: "fenglibo51" },
          url: "https://github.com/ha-china/html-card-pro/discussions/13#discussioncomment-2",
        },
      ],
    },
  });
  assert.deepStrictEqual(
    discussionSources(sourceDiscussion).map((source) => source.id),
    [13, "13-comment-1", "13-comment-2"],
  );

  await writeModules([sourceDiscussion], { downloadImages: false });
  assert.deepStrictEqual(fs.readdirSync("mods").sort(), [
    "10-nas-synology-nas-status-panel.yaml",
    "13-comment-1-comment-minecraft.yaml",
    "13-comment-2-comment-nest.yaml",
    "13-main-discussion.yaml",
  ]);

  await writeModules(
    [
      discussion({
        number: 10,
        title: "[Style] Unsafe replacement",
        body: "```yaml\ntype: custom:html-pro-card\ncontent: |\n  <script>document.cookie</script>\n```",
      }),
    ],
    { downloadImages: false },
  );
  assert.deepStrictEqual(fs.readdirSync("mods").sort(), [
    "10-unsafe-replacement.yaml",
    "13-comment-1-comment-minecraft.yaml",
    "13-comment-2-comment-nest.yaml",
    "13-main-discussion.yaml",
  ]);
};

run()
  .then(() => {
    process.chdir(oldCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log("sync-modules tests passed");
  })
  .catch((error) => {
    process.chdir(oldCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.error(error);
    process.exitCode = 1;
  });
