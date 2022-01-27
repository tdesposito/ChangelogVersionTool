// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).


const changelog = require('../src/common/changelog')
const version = require('../src/common/version')
const { log, config } = require('./testing_common')


describe('validBump correctly filters invalid bumps', () => {
  test('beta -> alpha is invalid', () => {
    expect(version.validBump(version.split("1.2.3-beta.4"), {alpha: true})).toBe(false)
  })
  test('rc -> alpha is invalid', () => {
    expect(version.validBump(version.split("1.2.3-rc.4"), {alpha: true})).toBe(false)
  })
  test('rc -> beta is invalid', () => {
    expect(version.validBump(version.split("1.2.3-rc.4"), {beta: true})).toBe(false)
  })
})


describe('calcBumped correctly bumps a release version to alpha version', () => {
  const before = version.split("1.2.3")
  test('bump from release to alpha/patch', () => {
    expect(version.calcBumped(before, {alpha: true})).toBe("1.2.4-alpha.0")
  })
  test('bump from release to alpha/minor', () => {
    expect(version.calcBumped(before, {alpha: true, minor: true})).toBe("1.3.0-alpha.0")
  })
  test('bump from release to alpha/major', () => {
    expect(version.calcBumped(before, {alpha: true, major: true})).toBe("2.0.0-alpha.0")
  })
})


describe('calcBumped correctly bumps an alpha version', () => {
  const before = version.split("1.2.3-alpha.4")
  test('bump alpha', () => {
    expect(version.calcBumped(before, {alpha: true})).toBe("1.2.3-alpha.5")
  })
  test('bump alpha to beta', () => {
    expect(version.calcBumped(before, {beta: true})).toBe("1.2.3-beta.0")
  })
  test('bump alpha to rc', () => {
    expect(version.calcBumped(before, {rc: true})).toBe("1.2.3-rc.0")
  })
})


describe('calcBumped correctly bumps an alpha version to release', () => {
  test('release patch -> patch', () => {
    expect(version.calcBumped(version.split("1.2.3-alpha.4"), { release: true })).toBe("1.2.3")
  })
  test('release patch -> minor', () => {
    expect(version.calcBumped(version.split("1.2.3-alpha.4"), { minor: true, release: true })).toBe("1.3.0")
  })
  test('release patch -> major', () => {
    expect(version.calcBumped(version.split("1.2.3-alpha.4"), { major: true, release: true })).toBe("2.0.0")
  })
  test('release minor -> minor', () => {
    expect(version.calcBumped(version.split("1.2.0-alpha.4"), { patch: true, release: true })).toBe("1.2.0")
  })
  test('release minor -> major', () => {
    expect(version.calcBumped(version.split("1.2.0-alpha.4"), { major: true, release: true })).toBe("2.0.0")
  })
  test('release major -> major', () => {
    expect(version.calcBumped(version.split("2.0.0-alpha.4"), { patch: true, minor: true, release: true })).toBe("2.0.0")
  })
})

describe('calcBumped correctly bumps a beta version', () => {
  const before = version.split("1.2.3-beta.4")
  test('bump beta to rc', () => {
    expect(version.calcBumped(before, {rc: true})).toBe("1.2.3-rc.0")
  })
})


describe('calcLevel correctly calculates levels', () => {
  test('for "major" bumps', () => {
    const tree = changelog.buildChangeTree(config, log)
    const level = version.calcLevel(config, tree)
    expect(level.major).toBe(true)
    expect(level.minor).toBe(false)
    expect(level.patch).toBe(false)
  })
  test('for "minor" bumps', () => {
    const tree = changelog.buildChangeTree(config, log.slice(1))
    const level = version.calcLevel(config, tree)
    expect(level.major).toBe(false)
    expect(level.minor).toBe(true)
    expect(level.patch).toBe(false)
  })
  test('for "minor" bumps', () => {
    const tree = changelog.buildChangeTree(config, log.slice(1, 4))
    const level = version.calcLevel(config, tree)
    expect(level.major).toBe(false)
    expect(level.minor).toBe(false)
    expect(level.patch).toBe(true)
  })
})
