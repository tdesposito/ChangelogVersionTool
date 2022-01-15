// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

module.exports = pre

/**
 * Puts the project into a pre-release state, or, if already there, bumps the revision
 *
 * @param  {Object} argv configuration options, usually from the cli
 */
function pre(args = {}) {
  const git = require('../common/git')
  const version = require('../common/version')
  const updater = require('../common/updater')

  const configuration = require('../common/config')
  const config = configuration.get()
  const resolvedConfig = configuration.getResolved()
  const current = config.version
  const parts = version.split(current)

  if (parts.stage === undefined) {
    args.alpha = true
  }

  if (version.validBump(parts, args)) {
    if (! parts.stage) {
      // We are bumping from our previous release version
      config.previousRelease = current
    }
    const bumped = version.calcBumped(parts, args)
    config.version = bumped
    config.update()
    let updated = [config.fname]
    if (config.update) {
      updated.push(...updater.updateAll(resolvedConfig, current, bumped))
    }

    git.commit(updated, `Bumped version ${current} → ${bumped}`)
    git.tag(bumped)

    console.log(`cvbump: Bumped version ${current} → ${bumped}`)
  } else {
    console.error(`cvbump: invalid operation for stage ${parts.stage}`)
    return false
  }
}
