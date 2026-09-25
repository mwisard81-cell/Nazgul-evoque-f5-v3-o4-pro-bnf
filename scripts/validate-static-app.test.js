const test = require("node:test");
const assert = require("node:assert/strict");

const { isExpectedRelativeAsset, validateHtmlReferences } = require("./validate-static-app");

test("accepts expected asset names with optional dot-slash prefix and cache suffixes", () => {
  assert.equal(isExpectedRelativeAsset("styles.css", "styles.css"), true);
  assert.equal(isExpectedRelativeAsset("./styles.css?v=1#top", "styles.css"), true);
  assert.equal(isExpectedRelativeAsset("app.js", "app.js"), true);
  assert.equal(isExpectedRelativeAsset("./app.js#bundle", "app.js"), true);
});

test("rejects unexpected, absolute, parent, or nested asset paths", () => {
  assert.equal(isExpectedRelativeAsset("../styles.css", "styles.css"), false);
  assert.equal(isExpectedRelativeAsset("assets/styles.css", "styles.css"), false);
  assert.equal(isExpectedRelativeAsset("assets/not-styles.css", "styles.css"), false);
  assert.equal(isExpectedRelativeAsset("/styles.css", "styles.css"), false);
  assert.equal(isExpectedRelativeAsset("https://example.com/styles.css", "styles.css"), false);
});

test("accepts quoted and unquoted root asset references in HTML", () => {
  assert.doesNotThrow(() =>
    validateHtmlReferences(`
      <link rel="stylesheet" href="styles.css?v=1">
      <script defer src='app.js?x=>1'></script >
    `),
  );

  assert.doesNotThrow(() =>
    validateHtmlReferences(`
      <link rel=stylesheet href=styles.css>
      <script defer src="./app.js?v=2"></script >
    `),
  );
});

test("ignores longer tag names and fails when expected assets are missing", () => {
  assert.throws(
    () =>
      validateHtmlReferences(`
        <linked-item href="styles.css"></linked-item>
        <scripture src="app.js"></scripture>
      `),
    /Missing styles\.css link/,
  );
});
