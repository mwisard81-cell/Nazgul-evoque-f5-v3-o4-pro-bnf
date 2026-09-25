const fs = require("node:fs");

const requiredFiles = ["index.html", "styles.css", "app.js"];

for (const file of requiredFiles) {
  const stats = fs.statSync(file, { throwIfNoEntry: false });

  if (!stats?.isFile() || stats.size === 0) {
    throw new Error(`Missing or empty file: ${file}`);
  }
}

const html = fs.readFileSync("index.html", "utf8");

const linkTags = findStartTags(html, "link");
const scriptTags = findStartTags(html, "script");

if (!hasAssetReference(linkTags, "href", "styles.css")) {
  throw new Error("Missing styles.css link");
}

if (!hasAssetReference(scriptTags, "src", "app.js")) {
  throw new Error("Missing app.js script");
}

function findStartTags(source, tagName) {
  const matches = [];
  const lowerSource = source.toLowerCase();
  const token = `<${tagName}`;
  let index = 0;

  while ((index = lowerSource.indexOf(token, index)) !== -1) {
    const nextCharacter = lowerSource[index + token.length];

    if (!isTagBoundary(nextCharacter)) {
      index += token.length;
      continue;
    }

    const end = lowerSource.indexOf(">", index + token.length);

    if (end === -1) {
      break;
    }

    matches.push(source.slice(index, end + 1));
    index = end + 1;
  }

  return matches;
}

function hasAssetReference(tags, attributeName, expectedFileName) {
  for (const tag of tags) {
    const attributes = parseAttributes(tag);
    const value = attributes[attributeName];

    if (value && isExpectedRelativeAsset(value, expectedFileName)) {
      return true;
    }
  }

  return false;
}

function parseAttributes(tag) {
  const attributes = {};
  let index = tag.indexOf(" ");

  while (index !== -1 && index < tag.length) {
    index = skipWhitespace(tag, index);
    if (index >= tag.length || tag[index] === ">" || tag[index] === "/") {
      index += 1;
      continue;
    }

    const nameStart = index;
    while (index < tag.length && !isWhitespace(tag[index]) && tag[index] !== "=" && tag[index] !== ">") {
      index += 1;
    }

    const name = tag.slice(nameStart, index).toLowerCase();
    index = skipWhitespace(tag, index);

    if (tag[index] !== "=") {
      attributes[name] = "";
      continue;
    }

    index += 1;
    index = skipWhitespace(tag, index);

    if (index >= tag.length) {
      attributes[name] = "";
      break;
    }

    const quote = tag[index];
    if (quote === '"' || quote === "'") {
      index += 1;
      const valueEnd = tag.indexOf(quote, index);
      const end = valueEnd === -1 ? tag.length : valueEnd;
      attributes[name] = tag.slice(index, end);
      index = valueEnd === -1 ? tag.length : end + 1;
      continue;
    }

    const valueStart = index;
    while (index < tag.length && !isWhitespace(tag[index]) && tag[index] !== ">") {
      index += 1;
    }

    attributes[name] = tag.slice(valueStart, index);
  }

  return attributes;
}

function isExpectedRelativeAsset(value, expectedFileName) {
  const cleanValue = stripQueryAndHash(value);

  if (
    cleanValue.length === 0 ||
    cleanValue.startsWith("/") ||
    cleanValue.startsWith("//") ||
    hasUriScheme(cleanValue)
  ) {
    return false;
  }

  const normalizedValue = cleanValue.startsWith("./") ? cleanValue.slice(2) : cleanValue;
  const segments = normalizedValue.split("/");

  if (segments.includes("..")) {
    return false;
  }

  return segments[segments.length - 1] === expectedFileName;
}

function stripQueryAndHash(value) {
  let end = value.length;
  const queryIndex = value.indexOf("?");
  const hashIndex = value.indexOf("#");

  if (queryIndex !== -1 && queryIndex < end) {
    end = queryIndex;
  }

  if (hashIndex !== -1 && hashIndex < end) {
    end = hashIndex;
  }

  return value.slice(0, end);
}

function hasUriScheme(value) {
  const colonIndex = value.indexOf(":");

  if (colonIndex === -1) {
    return false;
  }

  const slashIndex = value.indexOf("/");
  return slashIndex === -1 || colonIndex < slashIndex;
}

function skipWhitespace(value, index) {
  while (index < value.length && isWhitespace(value[index])) {
    index += 1;
  }

  return index;
}

function isWhitespace(character) {
  return character === " " || character === "\n" || character === "\r" || character === "\t" || character === "\f";
}

function isTagBoundary(character) {
  return character === undefined || character === ">" || character === "/" || isWhitespace(character);
}
