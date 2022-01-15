// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).


const changelog = require('../src/common/changelog')
const { config, log, logEntry } = require('./testing_common')


describe('categorizeLogEntry correctly categorizes entries', () => {
  // Added:
  test('categorizes an "Add" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'Add a new feature')).toBe('Added')
  })
  test('categorizes an "added" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'added a new feature')).toBe('Added')
  })
  test('categorizes an "adding" entry as "Misc"', () => {
    expect(changelog.categorizeLogEntry(config, 'adding two numbers together')).toBe('Misc')
  })
  // Breaking:
  test('categorizes a "BREAKS" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'BREAKS a feature')).toBe('Breaking')
  })
  test('categorizes a "BREAKS" entry in the center of the string', () => {
    expect(changelog.categorizeLogEntry(config, 'This commit BREAKS a feature')).toBe('Breaking')
  })
  test('categorizes a "BREAKING CHANGE" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'BREAKING CHANGE: a feature')).toBe('Breaking')
  })
  // Changed:
  test('categorizes a "change" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'change a feature')).toBe('Changed')
  })
  test('categorizes a "Changed" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'Changed a feature')).toBe('Changed')
  })
  // Deprecated:
  test('categorizes a "Deprecate" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'Deprecate a feature')).toBe('Deprecated')
  })
  test('categorizes a "deprecated" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'deprecated a feature')).toBe('Deprecated')
  })
  // Fixed:
  test('categorizes a "fix" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'fix a feature')).toBe('Fixed')
  })
  test('categorizes a "Fixed" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'Fixed a feature')).toBe('Fixed')
  })
  // Removed:
  test('categorizes a "Remove" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'Remove a feature')).toBe('Removed')
  })
  test('categorizes a "removed" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'removed a feature')).toBe('Removed')
  })
  // Security:
  test('categorizes an entry mentioning "Security"', () => {
    expect(changelog.categorizeLogEntry(config, 'Changed a feature to fix a security issue')).toBe('Security')
  })
  // Ignored:
  test('categorizes an "ignorable" entry', () => {
    expect(changelog.categorizeLogEntry(config, 'Bumped version from 1 to 2')).toBe('Ignored')
  })
})

test('buildChangeTree correctly collects entries', () => {
  // need to fixup the regexs in config.sections
  const tree = changelog.buildChangeTree(config, log)
  expect(tree.Added.length).toBe(3)
  expect(tree.Breaking.length).toBe(1)
  expect(tree.Fixed.length).toBe(1)
  expect(tree.Removed.length).toBe(0)
  expect(tree.Security.length).toBe(1)
  expect(tree.Misc.length).toBe(2)
  expect(tree.Ignored.length).toBe(1)
  expect(tree.Updated.length).toBe(1)
  expect(tree.Deprecated.length).toBe(1)
})

test('buildLogSection correctly creates the section', () => {
  const tree = changelog.buildChangeTree(config, log.slice(0, 5))
  const sect = changelog.buildLogSection(config, tree, {bumped: '2.0.0', date: '2021-11-01'})
  expect(sect).toMatch(logEntry)
})

test('buildTagGroups correctly organizes the tag groups', () => {
  const groups = changelog.buildTagGroups(log)
  expect(groups.length).toBe(4)
  expect(groups[1].tag).toBe('v2.0.0')
  expect(groups[1].commits.length).toBe(5)
})
