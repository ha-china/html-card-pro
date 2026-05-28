#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let YAML;
try {
  YAML = require("yaml");
} catch (error) {
  console.error("Missing Node package: yaml. Install it or run this tool on the prepared Codex machine.");
  process.exit(1);
}

const rootDir = path.resolve(__dirname, "..");

const defaults = {
  livingLight: "light.living_room_lights",
  bedroomLight: "light.bedroom_lights",
  gardenLight: "light.garden_light_strip",
  kitchenSocket: "switch.kitchen_socket",
  climate: "climate.living_room_ac",
  media: "media_player.living_room_speaker",
  lock: "lock.front_door",
  door: "binary_sensor.front_door_contact",
  livingPresence: "binary_sensor.living_room_presence",
  bedroomPresence: "binary_sensor.bedroom_presence",
  kitchenPresence: "binary_sensor.kitchen_presence",
  livingTemp: "sensor.living_room_temperature",
  livingHum: "sensor.living_room_humidity",
  bedroomTemp: "sensor.bedroom_temperature",
  bedroomHum: "sensor.bedroom_humidity",
  kitchenTemp: "sensor.kitchen_temperature",
  outdoorTemp: "sensor.outdoor_temperature",
  outdoorHum: "sensor.outdoor_humidity",
  pm25: "sensor.pm25",
  power: "sensor.current_power",
  energyToday: "sensor.energy_cost_today",
  energyMonth: "sensor.energy_cost_month",
  weather: "weather.home",
  time: "sensor.time",
  date: "sensor.date",
  sceneHome: "scene.home_mode",
  sceneNight: "scene.good_night",
  sceneWelcome: "scene.welcome_home",
  sceneAway: "scene.away_mode",
};

const sceneKeyToEntityKey = {
  sceneHome: "scene.home_mode",
  sceneNight: "scene.good_night",
  sceneWelcome: "scene.welcome_home",
  sceneAway: "scene.away_mode",
};

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function readYaml(filePath) {
  return YAML.parse(fs.readFileSync(filePath, "utf8")) || {};
}

function unique(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAllLiteral(input, from, to) {
  if (!from || from === to) return input;
  return input.replace(new RegExp(escapeRegExp(from), "g"), to);
}

function entityObjectBlock(entities) {
  const lines = Object.entries(entities).map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`);
  return `  const ENTITY = {\n${lines.join("\n")}\n  };`;
}

function entitiesYamlBlock(entities) {
  return ["entities:", ...unique(Object.values(entities)).map((entityId) => `  - ${entityId}`)].join("\n");
}

function buildStorage(card, dashboard) {
  return {
    version: 1,
    minor_version: 1,
    key: "lovelace.minecraft-html-pro-dashboard",
    data: {
      config: {
        title: dashboard.title || "Minecraft HTML Pro Dashboard",
        views: [
          {
            title: dashboard.view_title || "Minecraft HTML Pro",
            path: dashboard.path || "minecraft-html-pro",
            icon: dashboard.icon || "mdi:minecraft",
            type: "panel",
            cards: [card],
          },
        ],
      },
    },
  };
}

function main() {
  const configPath = path.resolve(rootDir, argValue("--config", "tools/html-pro-dashboard.entities.yaml"));
  const templatePath = path.resolve(rootDir, argValue("--template", "templates/html-pro-dashboard.yaml"));
  const outYamlPath = path.resolve(rootDir, argValue("--out-yaml", "templates/html-pro-dashboard.generated.yaml"));
  const outStoragePath = path.resolve(rootDir, argValue("--out-storage", ".deploy/lovelace.minecraft-html-pro-dashboard"));

  const config = readYaml(configPath);
  const dashboard = config.dashboard || {};
  const configuredEntities = config.entities || {};
  const entities = { ...defaults, ...configuredEntities };

  let source = fs.readFileSync(templatePath, "utf8");

  Object.entries(defaults).forEach(([key, defaultEntityId]) => {
    source = replaceAllLiteral(source, defaultEntityId, entities[key]);
  });
  Object.entries(sceneKeyToEntityKey).forEach(([key, defaultEntityId]) => {
    source = replaceAllLiteral(source, defaultEntityId, entities[key]);
  });

  source = source.replace(/entities:\n(?:  - .+\n)+content: \|/, `${entitiesYamlBlock(entities)}\ncontent: |`);
  source = source.replace(/  const ENTITY = \{[\s\S]*?\n  \};/, entityObjectBlock(entities));

  const card = YAML.parse(source);
  if (card?.type !== "custom:html-pro-card") {
    throw new Error("Generated YAML is not a custom:html-pro-card.");
  }
  if (!card.content || !card.content.includes("const ENTITY =")) {
    throw new Error("Generated YAML is missing the ENTITY config block.");
  }

  const scripts = [...card.content.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  scripts.forEach((script) => new Function("root", "hass", "$", "$$", script));

  fs.mkdirSync(path.dirname(outYamlPath), { recursive: true });
  fs.mkdirSync(path.dirname(outStoragePath), { recursive: true });
  fs.writeFileSync(outYamlPath, source, "utf8");
  fs.writeFileSync(outStoragePath, JSON.stringify(buildStorage(card, dashboard), null, 2), "utf8");

  console.log(`Generated ${path.relative(rootDir, outYamlPath)}`);
  console.log(`Generated ${path.relative(rootDir, outStoragePath)}`);
  console.log(`Entities: ${unique(Object.values(entities)).length}`);
  console.log(`Dashboard path: /${dashboard.path || "minecraft-html-pro"}`);
}

main();
