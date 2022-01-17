// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

/**
 * The ChangeLog module deals with manipulating change data.
 *
 * @module ChangeLog
 */

exports.buildChangeTree = buildChangeTree
/**
 * buildChangeTree - group commit log entries by type
 *
 * @param  {Object} config    fully-resolved (defaults-applied) configuration
 * @param  {Array}  changelog commit log entries to classify
 * @return {Object}           commit entries organized by type
 */
function buildChangeTree(config, changelog) {
  const git = require('./git')

  let changetree = {}
  for (const key of Object.keys(config.sections)) {
    changetree[key] = []
  }
  changelog.forEach(log => {
    let parts = parseLogEntry(log)
    if (config.showMessageBody) {
      parts.body = git.logFor(parts.long)
    }
    changetree[categorizeLogEntry(config, parts.message)].push(parts)
  })
  return changetree
}


exports.buildLogSection = buildLogSection
/**
 * buildLogSection - construct a single changelog section from a changetree
 *
 * @param  {Object} config     fully-resolved (defaults-applied) configuration
 * @param  {Object} changetree the section's commit log entries, by type
 * @param  {Object} versinfo   the section's metadata
 * @return {string}            markdown-formatted changelog for this section
 */
function buildLogSection(config, changetree, versinfo) {
  const repo = require('./git').remote()
  var templates = config.templates
  if (repo.startsWith('https://github.com')) {
    templates = config.linkedTemplates
  }

  const renderVersion = (versinfo) => eval('`' + templates.version + '`') // eslint-disable-line no-unused-vars
  const renderSection = (sectinfo) => eval('`' + templates.section + '`') // eslint-disable-line no-unused-vars
  const renderCommit = (commit) =>  eval('`' + templates.commit + '`') // eslint-disable-line no-unused-vars
  const renderBodyLine = (line) => eval('`' + templates.commitBodyLine + '`') // eslint-disable-line no-unused-vars

  const sectionOrder =
    Object.entries(config.sections)
      .filter(e => e[1].order > 0)
      .sort((a, b) => a[1].order > b[1].order && 1 || -1)
      .map(e => e[0])

  let s = [renderVersion(versinfo)]

  for (const key of sectionOrder) {
    if (changetree[key].length) {
      s.push(renderSection(config.sections[key]))
      for (const commit of changetree[key]) {
        s.push(renderCommit(commit))
        if (commit.body) {
          for (const line of commit.body) {
            if (line.length) {
              s.push(renderBodyLine(line))
            }
          }
        }
      }
      s.push('')
    }
  }
  return s.join('\n')
}


exports.buildTagGroups = buildTagGroups
/**
 * buildTagGroups - group commit logs by tag
 *
 * @param  {Array}  changelog commit logs, as formatted
 * @return {Object}           parsed commit logs grouped by tag
 */
function buildTagGroups(changelog) {
  const groups = [{ tag: '', commits: [] }]
  const log = changelog.slice(0)
  log.reverse()
  for (const entry of log) {
    const parts = parseLogEntry(entry)
    groups[0].commits.unshift(entry)
    // only break on proper version tags
    if (parts.tag.match(/v\d+\.\d+\.\d+$/) && parts.tag !== groups[0].tag) {
      groups[0].tag = parts.tag
      groups[0].date = parts.date
      groups[0].bumped = parts.tag.substring(1)
      groups.unshift({ tag: '', commits: []})
    }
  }
  return groups
}


exports.categorizeLogEntry = categorizeLogEntry
/**
 * categorizeLogEntry - discern the "type" of a commit log
 *
 * @param  {Object} config  fully-resolved (defaults-applied) configuration
 * @param  {string} message commit log message
 * @return {string}         category for the message
 */
function categorizeLogEntry(config, message) {
  for (const [key, entry] of Object.entries(config.sections)) {
    if (message.match(entry.regex)) {
      return key
    }
  }
  return 'Ignored'
}


exports.parseLogEntry = parseLogEntry
/**
 * parseLogEntry - parse a single git commit log
 *
 * @param  {string} log the delimited commit log, as formatted
 * @return {Object}     log, as parsed
 */
function parseLogEntry(log) {
  let _ = log.split('##')
  let tag = ''
  let m = _[3].match(/tag: (v.*)\)/)
  if (m) { tag = m[1] }
  return {long: _[0], short: _[1], author:_[2], tag, date: _[4], message: _.splice(5).join("##")}
}
