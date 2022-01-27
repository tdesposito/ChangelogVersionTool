// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

/**
 * Include functions related to updating the version number in target files.
 *
 * @module Updater
 */

const fs = require('fs')

exports.updateAll = updateAll
/**
 * update the version in all named files
 *
 * @param  {Object} config  project configuration
 * @param  {string} current "current" version string
 * @param  {string} bumped  "bumped" (target) version string
 * @return {Array}         List of files updated
 */
function updateAll(config, current, bumped) {

  const files = []
  config.update.forEach(entry => {
    if (!(entry.file && (entry.search || entry.key))) {
      console.log(`cvbump: skipping invalid update target "${entry.file}"`)
    }
    if (!fs.existsSync(entry.file)) {
      console.log(`cvbump: skipping missing update target "${entry.file}"`)
    }
    if (!fs.statSync(entry.file).isFile()) {
      console.log(`cvbump: skipping invalid update target "${entry.file}"`)
    }

    var content = fs.readFileSync(entry.file).toString()
    if (entry.search) {
      content = updateText(entry.search, current, bumped, content)
    } else if (entry.file.endsWith('.toml')) {
      content = updateToml(entry.key, current, bumped, content)
    } else if (entry.file.endsWith('.json')) {
      content = updateJson(entry.key, current, bumped, content)
    } else {
      console.log(`cvbump: unknown update target file type: "${entry.file}"`)
      content = null
    }
    if (content) {
      fs.writeFileSync(entry.file, content)
      files.push(entry.file)
    } else {
      console.error(`cvbump: could not update ${entry.file}`)
    }
  })
  return files
}


exports.updateJson = updateJson
/**
 * updateJson - updates the version key in json content
 *
 * @param  {string} key     keypath to update, in dotted format
 * @param  {string} current "current" version string (must match)
 * @param  {string} bumped  "bumped" (target) version string
 * @param  {string} content content to parse as JSON
 * @return {string}         updated JSON, stringified, or null on failure
 */
function updateJson(key, current, bumped, content) {
  var jsoncontent
  try {
    jsoncontent = JSON.parse(content)
  } catch (error) {
    return null
  }

  var node = jsoncontent
  const keys = key.split('.')
  keys.slice(0, -1).forEach(k => {
    if (node[k] === undefined) {
      return null
    }
    node = node[k]
  })
  if (node[keys.slice(-1)] === current) {
    node[keys.slice(-1)] = bumped
    return JSON.stringify(jsoncontent, null, 2)
  }
  return null
}


exports.updateText = updateText
/**
 * updateText - update version text in file contents
 *
 * @param  {string} search  search term describing the update
 * @param  {string} current "current" version string (must match)
 * @param  {string} bumped  "bumped" (target) version string
 * @param  {string} content content of the file, as plain text
 * @return {string}         updated file content, or null on failure
 */
function updateText(search, current, bumped, content) {
  const from = new RegExp(
    search
      .replace('{{version}}', current)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'g'
    )
  const to = search.replace('{{version}}', bumped)
  const updated = content.replace(from, to)
  if (updated !== content) {
    return updated
  }
  return null
}


exports.updateToml = updateToml
/**
 * updateToml - updates the version key in toml content
 *
 * @param  {string} key     keypath to update, in dotted format
 * @param  {string} current "current" version string (must match)
 * @param  {string} bumped  "bumped" (target) version string
 * @param  {string} content content to parse as TOML
 * @return {string}         updated TOML, stringified, or null on failure
 */
function updateToml(key, current, bumped, content) {
  const TOML = require('@iarna/toml')
  var toml
  try {
    toml = TOML.parse(content)
  } catch (error) {
    return null
  }
  var node = toml
  const keys = key.split('.')
  keys.slice(0, -1).forEach(k => {
    if (node[k] === undefined) {
      return null
    }
    node = node[k]
  })
  if (node[keys.slice(-1)] === current) {
    node[keys.slice(-1)] = bumped
    return TOML.stringify(toml)
  }
  return null
}
