"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPOSITORY = "https://github.com/microsoft/ai-agent-runbooks";
const MAX_INDEX_BYTES = 8 * 1024 * 1024;
const SITE_PAGES = [
  "index.html",
  "overview.html",
  "scenarios.html",
  "patterns.html",
  "references.html",
  "contribute.html"
];
const SOURCE_GROUPS = [
  { folder: "00-overview", category: "references" },
  { folder: "01-scenarios", category: "scenarios" },
  { folder: "02-patterns", category: "patterns" },
  { folder: "03-references", category: "references" }
];

class BuildError extends Error {}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\r/g, "\n").replace(/\s+/g, " ").trim();
}

function ensureExists(targetPath, message) {
  if (!fs.existsSync(targetPath)) {
    throw new BuildError(message || ("Missing required path: " + targetPath));
  }
}

function encodeRepoPath(relativePath) {
  return relativePath.split(/[\\/]+/).map(encodeURIComponent).join("/");
}

function humanize(value) {
  return String(value || "")
    .replace(/^[0-9]+\./, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\bmd\b/i, "")
    .trim();
}

function titleCaseLabel(value) {
  const text = humanize(value);
  return text ? text.replace(/\b\w/g, function (match) { return match.toUpperCase(); }) : "";
}

function readCatalogue(docsDir) {
  const filePath = path.join(docsDir, "assets", "data.js");
  ensureExists(filePath, "Missing required catalogue file: docs\\assets\\data.js");
  const source = fs.readFileSync(filePath, "utf8");
  const context = vm.createContext({});
  const script = new vm.Script(source + "\n;globalThis.__catalogue = { REPO, TREE, BLOB, SCENARIOS, PATTERNS, REFERENCES };", {
    filename: filePath
  });
  script.runInContext(context, { timeout: 1000 });
  const catalogue = context.__catalogue;
  if (!catalogue || !Array.isArray(catalogue.SCENARIOS) || !Array.isArray(catalogue.PATTERNS) || !Array.isArray(catalogue.REFERENCES)) {
    throw new BuildError("docs\\assets\\data.js did not define the expected catalogue arrays.");
  }
  return {
    scenarios: catalogue.SCENARIOS,
    patterns: catalogue.PATTERNS,
    references: catalogue.REFERENCES
  };
}

function catalogueText(value) {
  return markdownText(String(value || "").replace(/<[^>]+>/g, " "))
    .replace(/\*\*|__/g, "")
    .trim();
}

function readSourceTable(directory, category) {
  const source = fs.readFileSync(path.join(directory, "README.md"), "utf8");
  const rows = new Map();
  source.split(/\r?\n/).forEach(function (line) {
    if (!line.trim().startsWith("|")) return;
    const cells = line.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/)
      .map(function (cell) { return cell.trim().replace(/\\\|/g, "|"); });
    const link = cells[0].match(/^\[([^\]]+)\]\(\.\/([^)]+)\)$/);
    if (!link) return;
    const expected = category === "scenarios" ? 5 : 4;
    if (cells.length !== expected) {
      throw new BuildError("Invalid catalogue table row in " + directory + ": " + line);
    }
    const relativePath = decodeURIComponent(link[2]).replace(/\/$/, "");
    const id = relativePath.split("/")[0];
    if (rows.has(id)) throw new BuildError("Duplicate catalogue table entry: " + id);
    rows.set(id, {
      title: catalogueText(link[1]),
      source: relativePath,
      type: category === "scenarios" ? catalogueText(cells[1]) : "",
      desc: catalogueText(cells[category === "scenarios" ? 2 : 1].split(/<br\s*\/?>/i)[0]),
      tech: cells[category === "scenarios" ? 3 : 2],
      status: catalogueText(cells[expected - 1]).replace(/^[^\p{L}\p{N}]+/u, "")
    });
  });
  return rows;
}

function catalogueTechnologies(value) {
  const aliases = {
    "Copilot Studio": "Microsoft Copilot Studio",
    "Microsoft Copilot Studios": "Microsoft Copilot Studio",
    "Azure AI Foundry": "Microsoft Foundry",
    "Copilot Cowork": "Microsoft 365 Copilot Cowork",
    "Cowork": "Microsoft 365 Copilot Cowork",
    "Teams": "Microsoft Teams",
    "MCP": "MCP Server",
    "MCP server": "MCP Server",
    "Model Context Protocol": "MCP Server",
    "Dynamics 365 ERP MCP Server": "MCP Server",
    "Copilot connectors": "Copilot Connectors",
    "Microsoft 365 Copilot connectors": "Copilot Connectors",
    "GitHub Copilot Harness": "GitHub Copilot harness",
    "Microsoft 365 Agents Toolkit": "Agents Toolkit",
    "Microsoft Graph semantic index": "Microsoft Graph",
    "SharePoint Organization Asset Library": "Organization Asset Library",
    "Azure subscription": "Azure",
    "Azure AD": "Microsoft Entra ID",
    "Entra SSO": "Microsoft Entra",
    "ServiceNow knowledge": "ServiceNow",
    "skills": "Skills",
    "plugins": "Plugins",
    "workflows": "Workflows",
    "controlled workflows": "Workflows"
  };
  const technologies = catalogueText(value)
    .replace(/\(([^)]*)\)/g, function (_, detail) { return detail.includes("/") ? ", " + detail : ""; })
    .split(/,|\s+\/\s+|\s+or\s+/)
    .flatMap(function (technology) {
      const label = technology.trim();
      if (/^ServiceNow.*Copilot Connector/i.test(label)) return ["ServiceNow", "Copilot Connectors"];
      if (label === "Power Automate approvals") return ["Power Automate", "Approvals"];
      return label ? [aliases[label] || label] : [];
    });
  return Array.from(new Set(technologies));
}

function overviewProperty(markdown, names) {
  for (const name of names) {
    const table = markdown.split(/\r?\n/).find(function (line) {
      return line.startsWith("|") && catalogueText(line.split("|")[1]) === name;
    });
    if (table) return catalogueText(table.split("|")[2]);
    const field = markdown.match(new RegExp("^\\*\\*" + name + ":\\*\\*\\s*(.+)$", "m"));
    if (field) return catalogueText(field[1]);
  }
  return "";
}

function overviewDescription(markdown) {
  const paragraph = markdown.split(/\r?\n\s*\r?\n/).find(function (part) {
    return part.trim() && !/^\s*(?:#|\||```|---|!\[|>\s|\*\*[^*]+:\*\*)/.test(part);
  });
  return catalogueText(paragraph);
}

function buildCatalogue(projectDir) {
  const rootDir = projectDir || path.resolve(__dirname, "..");
  const config = JSON.parse(fs.readFileSync(path.join(rootDir, "scripts", "catalogue-config.json"), "utf8"));
  const groups = [
    { folder: "01-scenarios", category: "scenarios" },
    { folder: "02-patterns", category: "patterns" }
  ];
  const catalogue = {};
  groups.forEach(function (group) {
    const directory = path.join(rootDir, group.folder);
    const table = readSourceTable(directory, group.category);
    const display = config[group.category];
    const folders = fs.readdirSync(directory, { withFileTypes: true })
      .filter(function (entry) { return entry.isDirectory(); }).map(function (entry) { return entry.name; }).sort();
    table.forEach(function (_, id) {
      if (!folders.includes(id)) throw new BuildError("Catalogue table points to a missing folder: " + group.folder + "/" + id);
    });
    const ordered = Object.keys(display).filter(function (id) { return folders.includes(id); })
      .concat(folders.filter(function (id) { return !Object.hasOwn(display, id); }));
    catalogue[group.category] = ordered.map(function (id) {
      const row = table.get(id);
      const presentation = display[id] || {};
      const itemDir = path.join(directory, id);
      const files = fs.readdirSync(itemDir).filter(function (file) { return /\.md$/i.test(file); }).sort();
      let file;
      if (group.category === "scenarios") {
        file = ["1.Overview.md", "README.md"].find(function (name) { return files.includes(name); })
          || files.find(function (name) { return /Overview\.md$/i.test(name); }) || files[0];
      } else if (row && /\.md$/i.test(row.source)) {
        file = row.source.slice(id.length + 1);
      } else {
        file = [id + ".md", "README.md"].find(function (name) { return files.includes(name); });
        if (!file) {
          const candidates = files.filter(function (name) { return !/-Runbook\.md$/i.test(name); });
          if (candidates.length === 1) file = candidates[0];
        }
      }
      if (!file) throw new BuildError("Cannot identify overview document for " + group.folder + "/" + id);
      const overviewPath = path.resolve(itemDir, file);
      if (!overviewPath.startsWith(itemDir + path.sep)) throw new BuildError("Overview path escapes its folder: " + file);
      ensureExists(overviewPath, "Missing overview document: " + overviewPath);
      const markdown = fs.readFileSync(overviewPath, "utf8");
      const title = presentation.title || (row && row.title !== id ? row.title : "")
        || catalogueText(findHeading(markdown)).replace(/\s+[-\u2013\u2014]\s+Overview$/i, "") || humanize(id);
      const desc = row ? row.desc : overviewDescription(markdown);
      if (!desc) throw new BuildError("Missing catalogue description for " + id);
      const item = {
        id: id,
        title: title,
        icon: presentation.icon || (group.category === "scenarios" ? "\uD83E\uDD16" : "\uD83E\uDDE9"),
        desc: desc,
        tech: catalogueTechnologies(row ? row.tech : overviewProperty(markdown, ["Primary Tools", "Platform", "Key Technologies"])),
        status: row ? row.status : (overviewProperty(markdown, ["Status"]) || "Documentation Available")
      };
      if (!item.status) throw new BuildError("Missing catalogue status for " + id);
      if (group.category === "scenarios") {
        item.type = row ? row.type : (overviewProperty(markdown, ["Scenario Type"]) || "Agent Scenario");
      } else {
        item.file = id + "/" + file.split(path.sep).join("/");
        item.theme = presentation.theme || "Architecture & Design";
      }
      return item;
    });
  });
  catalogue.references = config.references;
  const output = "/* Generated by scripts/build-search-index.js. Do not edit; source folders and README tables define coverage. */\n\n"
    + "const REPO = " + JSON.stringify(REPOSITORY) + ";\n"
    + 'const TREE = REPO + "/tree/main";\n'
    + 'const BLOB = REPO + "/blob/main";\n\n'
    + "const SCENARIOS = " + JSON.stringify(catalogue.scenarios, null, 2) + ";\n\n"
    + "const PATTERNS = " + JSON.stringify(catalogue.patterns, null, 2) + ";\n\n"
    + "const REFERENCES = " + JSON.stringify(config.references, null, 2) + ";\n\n"
    + "const RUNBOOK_ANATOMY = " + JSON.stringify(config.anatomy, null, 2) + ";\n";
  validateRequiredSource(rootDir, catalogue);
  fs.writeFileSync(path.join(rootDir, "docs", "assets", "data.js"), output, "utf8");
  const homePath = path.join(rootDir, "docs", "index.html");
  const home = fs.readFileSync(homePath, "utf8");
  const updated = home.replace(/(id="stat-scenarios">)\d+(<\/div>)/, "$1" + catalogue.scenarios.length + "$2")
    .replace(/(id="stat-patterns">)\d+(<\/div>)/, "$1" + catalogue.patterns.length + "$2");
  if (home !== updated) fs.writeFileSync(homePath, updated, "utf8");
  return catalogue;
}

function stripBlock(html, tagName) {
  return html.replace(new RegExp("<" + tagName + "\\b[^>]*>[\\s\\S]*?<\\/" + tagName + ">", "gi"), " ");
}

function htmlText(html) {
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  let value = mainMatch ? mainMatch[1] : html;
  value = value.replace(/<section\b[^>]*class="[^"]*\bdisclaimer-section\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi, " ");
  ["script", "style", "nav", "footer", "template", "noscript", "svg"].forEach(function (tagName) {
    value = stripBlock(value, tagName);
  });
  value = value
    .replace(/<[^>]+\s(?:hidden|aria-hidden="true")[^>]*>[\s\S]*?<\/[^>]+>/gi, " ")
    .replace(/<[^>]+style="[^"]*(?:display\s*:\s*none|visibility\s*:\s*hidden)[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|summary)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'");
  return normalizeWhitespace(value);
}

function markdownText(source) {
  return normalizeWhitespace(
    String(source || "")
      .replace(/\r/g, "\n")
      .replace(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/, " ")
      .replace(/^[ \t]*```[^\n]*$/gm, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^>\s?/gm, "")
      .replace(/^#+\s*/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\|/g, " ")
  );
}

function findHeading(markdown) {
  const match = String(markdown || "").match(/^#\s+(.+)$/m);
  return match ? normalizeWhitespace(match[1]) : "";
}

function findHtmlTitle(html, fallback) {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    return normalizeWhitespace(h1[1].replace(/<[^>]+>/g, " "));
  }
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return title ? normalizeWhitespace(title[1]) : fallback;
}

function walkMarkdown(directoryPath, bucket) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  entries.forEach(function (entry) {
    const absolutePath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      walkMarkdown(absolutePath, bucket);
      return;
    }
    if (entry.isFile() && /\.md$/i.test(entry.name)) {
      bucket.push(absolutePath);
    }
  });
}

function collectMarkdownFiles(sourceDir) {
  const files = [];
  SOURCE_GROUPS.forEach(function (group) {
    const directoryPath = path.join(sourceDir, group.folder);
    ensureExists(directoryPath, "Missing required public source folder: " + group.folder);
    walkMarkdown(directoryPath, files);
  });
  return files.sort();
}

function scenarioMaps(catalogue) {
  const scenarios = new Map(catalogue.scenarios.map(function (item) { return [item.id, item]; }));
  const patterns = new Map(catalogue.patterns.map(function (item) { return [item.id, item]; }));
  return { scenarios: scenarios, patterns: patterns };
}

function validateRequiredSource(sourceDir, catalogue) {
  ensureExists(path.join(sourceDir, "00-overview", "README.md"), "Missing required source file: 00-overview\\README.md");
  catalogue.scenarios.forEach(function (item) {
    ensureExists(
      path.join(sourceDir, "01-scenarios", item.id),
      "Missing required curated scenario source: 01-scenarios\\" + item.id
    );
  });
  catalogue.patterns.forEach(function (item) {
    ensureExists(
      path.join(sourceDir, "02-patterns", item.file),
      "Missing required curated pattern source: 02-patterns\\" + item.file.replace(/\//g, "\\")
    );
  });
  catalogue.references.forEach(function (item) {
    ensureExists(
      path.join(sourceDir, item.file),
      "Missing required curated reference source: " + item.file.replace(/\//g, "\\")
    );
  });
}

function buildMarkdownTitle(relativePath, heading, maps) {
  const parts = relativePath.split(path.sep);
  const top = parts[0];
  if (top === "01-scenarios" && parts.length >= 3) {
    const folderName = parts[1];
    const card = maps.scenarios.get(folderName);
    const base = card ? card.title : humanize(folderName);
    const leaf = titleCaseLabel(path.basename(parts[parts.length - 1], ".md"));
    return leaf ? (base + " — " + leaf) : (heading || base);
  }
  if (top === "02-patterns" && parts.length >= 3) {
    const folderName = parts[1];
    const card = maps.patterns.get(folderName);
    const base = card ? card.title : humanize(folderName);
    const leaf = titleCaseLabel(path.basename(parts[parts.length - 1], ".md"));
    return leaf ? (base + " — " + leaf) : (heading || base);
  }
  if (top === "00-overview") {
    return heading || "Repository overview";
  }
  return heading || titleCaseLabel(path.basename(parts[parts.length - 1], ".md")) || humanize(parts[parts.length - 1]);
}

function collectSiteEntries(docsDir) {
  return SITE_PAGES.map(function (pageName) {
    const absolutePath = path.join(docsDir, pageName);
    ensureExists(absolutePath, "Missing required site page: docs\\" + pageName);
    const html = fs.readFileSync(absolutePath, "utf8");
    return {
      title: findHtmlTitle(html, pageName),
      url: pageName,
      category: "site",
      text: htmlText(html)
    };
  });
}

function collectCatalogueEntries(catalogue) {
  const entries = [];
  catalogue.scenarios.forEach(function (item) {
    entries.push({
      title: item.title,
      url: REPOSITORY + "/tree/main/01-scenarios/" + encodeRepoPath(item.id),
      category: "scenarios",
      text: normalizeWhitespace([item.type, item.desc, (item.tech || []).join(" "), item.status].join(" "))
    });
  });
  catalogue.patterns.forEach(function (item) {
    entries.push({
      title: item.title,
      url: REPOSITORY + "/blob/main/02-patterns/" + encodeRepoPath(item.file),
      category: "patterns",
      text: normalizeWhitespace([item.theme, item.desc, (item.tech || []).join(" "), item.status].join(" "))
    });
  });
  catalogue.references.forEach(function (item) {
    entries.push({
      title: item.title,
      url: REPOSITORY + "/blob/main/" + encodeRepoPath(item.file),
      category: "references",
      text: normalizeWhitespace(item.desc)
    });
  });
  return entries;
}

function collectSourceEntries(sourceDir, catalogue) {
  const maps = scenarioMaps(catalogue);
  return collectMarkdownFiles(sourceDir).map(function (absolutePath) {
    const relativePath = path.relative(sourceDir, absolutePath);
    const markdown = fs.readFileSync(absolutePath, "utf8");
    const heading = findHeading(markdown);
    const top = relativePath.split(path.sep)[0];
    const category = SOURCE_GROUPS.find(function (group) { return group.folder === top; }).category;
    return {
      title: buildMarkdownTitle(relativePath, heading, maps),
      url: REPOSITORY + "/blob/main/" + encodeRepoPath(relativePath.split(path.sep).join("/")),
      category: category,
      text: markdownText(markdown)
    };
  });
}

function buildSearchIndex(projectDir) {
  const rootDir = projectDir || path.resolve(__dirname, "..");
  const docsDir = path.join(rootDir, "docs");
  const sourceDir = rootDir;
  ensureExists(docsDir, "Missing required docs folder.");
  ensureExists(sourceDir, "Missing required public repository source.");
  const catalogue = buildCatalogue(rootDir);
  validateRequiredSource(sourceDir, catalogue);

  const entries = []
    .concat(collectSiteEntries(docsDir))
    .concat(collectCatalogueEntries(catalogue))
    .concat(collectSourceEntries(sourceDir, catalogue))
    .map(function (entry) {
      return {
        title: normalizeWhitespace(entry.title),
        url: normalizeWhitespace(entry.url),
        category: normalizeWhitespace(entry.category),
        text: normalizeWhitespace(entry.text)
      };
    })
    .filter(function (entry) { return entry.title && entry.url && entry.category && entry.text; });

  const output = "window.ARB_SEARCH_INDEX = " + JSON.stringify(entries) + ";\n";
  const size = Buffer.byteLength(output, "utf8");
  if (size > MAX_INDEX_BYTES) {
    throw new BuildError("Generated search index exceeds 8 MB (" + size + " bytes).");
  }
  const outputPath = path.join(docsDir, "assets", "search-index.js");
  fs.writeFileSync(outputPath, output, "utf8");
  return { entries: entries, outputPath: outputPath, size: size };
}

if (require.main === module) {
  try {
    const result = buildSearchIndex();
    process.stdout.write("Built " + result.entries.length + " search entries (" + result.size + " bytes) -> " + result.outputPath + "\n");
  } catch (error) {
    process.stderr.write((error instanceof Error ? error.message : String(error)) + "\n");
    process.exit(1);
  }
}

module.exports = {
  BuildError,
  MAX_INDEX_BYTES,
  REPOSITORY,
  SITE_PAGES,
  buildCatalogue,
  buildSearchIndex,
  catalogueTechnologies,
  collectMarkdownFiles,
  htmlText,
  markdownText,
  readCatalogue
};
