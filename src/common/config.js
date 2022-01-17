// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

/**
 * The Config module handles system and project configuration data.
 *
 * @module Config
 */

const fs = require('fs')

exports.defaultConfig = {
  "changelog": "CHANGELOG.md",
  "preamble": "# Changelog\n\n" +
    "All notable changes to this project will be documented in this file.\n\n" +
    "* The format is based on [Keep a Changelog](https://keepachangelog.com/)\n" +
    "* This project adheres to [Semantic Versioning](https://semver.org/)\n" +
    "* This project uses [cvbump]" +
    "(https://github.com/tdesposito/cvbump) to maintain this " +
    "changelog.\n\n",
  "postamble": "## Notes\n\nNone at this time.\n",
  "showMessageBody": true,
  "sections": {
    "Security": {
      "pattern": "/security/i",
      "order": 2,
      "heading": "Security Related Changes",
      "bump": "minor"
    },
    "Breaking": {
      "pattern": "/BREAK[S|ING]/",
      "order": 1,
      "heading": "BREAKING CHANGES: Be aware these changes may break older code.",
      "bump": "major"
    },
    "Added": {
      "pattern": "/^add(ed)? /i",
      "order": 4,
      "heading": "Added",
      "bump": "minor"
    },
    "Changed": {
      "pattern": "/^changed? /i",
      "order": 5,
      "heading": "Changed"
    },
    "Deprecated": {
      "pattern": "/^deprecated? /i",
      "order": 3,
      "heading": "Deprecated: These features/functions will be removed in a future release."
    },
    "Fixed": {
      "pattern": "/^fix(ed)? /i",
      "order": 7,
      "heading": "Fixed"
    },
    "Updated": {
      "pattern": "/^updated? /i",
      "order": 8,
      "heading": "Other Updates",
    },
    "Ignored": {
      "pattern": "/^(bump|cvbump)/i",
      "order": -1,
      "heading": ""
    },
    "Removed": {
      "pattern": "/^removed? /i",
      "order": 6,
      "heading": "Removed",
      "bump": "minor"
    },
    "Misc": {
      "pattern": "/.*/",
      "order": -1,
      "heading": ""
    }
  },
  "templates": {
    "version": "## ${versinfo.bumped} - ${versinfo.date}\n",
    "section": "### ${sectinfo.heading}\n",
    "commit": "* ${commit.message} (${commit.short} by ${commit.author})",
    "commitBodyLine": "  <br>_${line}_",
  },
  "linkedTemplates": {
    "version": "## [${versinfo.bumped}](${repo}/releases/tag/${versinfo.bumped}) - ${versinfo.date}\n",
    "section": "### ${sectinfo.heading}\n",
    "commit": "* ${commit.message} ([${commit.short}](${repo}/commit/${commit.long}) by ${commit.author})",
    "commitBodyLine": "  <br>_${line}_",
  },
  "update": [],
}


exports.determineCfgFile = determineCfgFile
/**
 * determineCfgFile - returns the name of the current project's config file
 *
 * @return {string}  config file name
 */
function determineCfgFile() {
  for (let fname of ['cvbump.json', 'package.json', 'pyproject.toml']) {
    if (fs.existsSync(fname)) {
      return fname
    }
  }
  return ""
}


exports.getConfigObject = getConfigObject
/**
 * getConfigObject - get an Object representing the config file
 *
 * @param  {string} cfName name of the underlying file
 * @return {Object}        Configuration object
 */
function getConfigObject(cfName) {
  if (cfName.endsWith('.json')) {
    return require('./configObject/Json').get(cfName)
  } else if (cfName.endsWith('.toml')) {
    return require('./configObject/Toml').get(cfName)
  }
  throw new Error(`error: no handler for configuration file ${cfName}`)
}


exports.get = get
/**
 * get - get the project's Configuration object
 *
 * @return {Object} Configuration object
 */
function get() {
  return getConfigObject(determineCfgFile())
}


exports.getResolved = getResolved
/**
 * getResolved - get the project configuration, merged with defaults
 *
 * @return {Object} project configuration data merged with system defaults
 */
function getResolved() {
  const clone = require('rfdc')({ proto:true })
  const r = {...clone(exports.defaultConfig), ...clone(get().cvbump || {})}
  for (const entry of Object.values(r.sections)) {
    const p = entry.pattern.split('/')
    entry.regex = new RegExp(p[1], p[2])
  }
  return r
}
