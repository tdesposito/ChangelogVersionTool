// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

const TOML = require('@iarna/toml')

const updater = require('../src/common/updater')

const current = "1.2.3"
const bumped = "1.3.0"
const textfile = {
  "one": {
    "search": "<p>Version {{version}}</p>",
    "before": [
      "<div>",
      "<p>This will be left alone.</p>",
      "<p>Version 1.2.3</p>",
      "</div>",
    ].join("\n"),
    "after": [
      "<div>",
      "<p>This will be left alone.</p>",
      "<p>Version 1.3.0</p>",
      "</div>",
    ].join("\n")
  },
  "multiple": {
    "search": "### Version {{version}}",
    "before": [
      "# Heading 1",
      "## Heading 2: This will be left alone.",
      "### Version 1.2.3",
      "## Heading 3: also left alone.",
      "### Version 1.2.3",
    ].join("\n"),
    "after": [
      "# Heading 1",
      "## Heading 2: This will be left alone.",
      "### Version 1.3.0",
      "## Heading 3: also left alone.",
      "### Version 1.3.0",
    ].join("\n")
  }
}
const jsonfile = {
  "top": {
    "key": "version",
    "before": JSON.stringify({
      "version": current,
      "project": "test project",
      "otherstuff": "more things here"
    }, null, 2),
    "after": JSON.stringify({
      "version": bumped,
      "project": "test project",
      "otherstuff": "more things here"
    }, null, 2),
  },
  "nested": {
    "key": "nested.version",
    "before": JSON.stringify({
      "version": current,
      "nested": {
        "version": current,
        "project": "test project",
        "otherstuff": "more things here"
      }
    }, null, 2),
    "after": JSON.stringify({
      "version": current,
      "nested": {
        "version": bumped,
        "project": "test project",
        "otherstuff": "more things here"
      }
    }, null, 2),
  }
}

const tomlfile = {
  "top": {
    "key": "version",
    "before": TOML.stringify({
      "version": current,
      "project": "test project",
      "otherstuff": "more things here"
    }),
    "after": TOML.stringify({
      "version": bumped,
      "project": "test project",
      "otherstuff": "more things here"
    }),
  },
  "nested": {
    "key": "nested.version",
    "before": TOML.stringify({
      "version": current,
      "nested": {
        "version": current,
        "project": "test project",
        "otherstuff": "more things here"
      }
    }),
    "after": TOML.stringify({
      "version": current,
      "nested": {
        "version": bumped,
        "project": "test project",
        "otherstuff": "more things here"
      }
    }),
  }
}

describe('updateText correctly updates a text stream', () => {
  test('with one version string', () => {
    const p = textfile.one
    expect(updater.updateText(p.search, current, bumped, p.before)).toBe(p.after)
  })
  test('with multiple version strings', () => {
    const p = textfile.multiple
    expect(updater.updateText(p.search, current, bumped, p.before)).toBe(p.after)
  })
})

describe('updateJson correctly updates a JSON stream', () => {
  test('with a key at the root', () => {
    const p = jsonfile.top
    expect(updater.updateJson(p.key, current, bumped, p.before)).toBe(p.after)
  })
  test('with a key below the root', () => {
    const p = jsonfile.nested
    expect(updater.updateJson(p.key, current, bumped, p.before)).toBe(p.after)
  })
})

describe('updateToml correctly updates a TOML stream', () => {
  test('with a key at the root', () => {
    const p = tomlfile.top
    expect(updater.updateToml(p.key, current, bumped, p.before)).toBe(p.after)
  })
  test('with a key below the root', () => {
    const p = tomlfile.nested
    expect(updater.updateToml(p.key, current, bumped, p.before)).toBe(p.after)
  })
})
