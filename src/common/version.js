// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

/**
 * Include functions for manipulating version strings
 *
 * @module Version
 */


exports.join = ({major, minor, patch, stage, rev}) => {
  if (stage) {
    return `${major}.${minor}.${patch}-${stage}.${rev}`
  }
  return `${major}.${minor}.${patch}`
}


exports.calcBumped = (parts, args) => {
  const bumped = {...parts}
  if (args.release) {
    bumped.stage = undefined
    if (parts.stage) {
      if (args.major && (parts.minor > 0 || parts.patch > 0)) {
        bumped.major += 1; bumped.minor = 0; bumped.patch = 0
      } else if (args.minor && parts.patch > 0) {
        bumped.minor += 1; bumped.patch = 0
      }
    } else {
      if (args.major) {
        bumped.major += 1; bumped.minor = 0; bumped.patch = 0
      } else if (args.minor) {
        bumped.minor += 1; bumped.patch = 0
      } else {
        bumped.patch += 1
      }
    }
  } else {
    if (args.major) {
      bumped.major += 1; bumped.minor = 0; bumped.patch = 0
    } else if (args.minor) {
      bumped.minor += 1; bumped.patch = 0
    } else if (! parts.stage) {
      bumped.patch += 1
    }
    bumped.stage = args.rc ? 'rc' : (args.beta ? 'beta' : (args.alpha ? 'alpha' : bumped.stage))
    if (bumped.stage) {
      if (bumped.stage === parts.stage) {
        bumped.rev += 1
      } else {
        bumped.rev = 0
      }
    }
  }

  return exports.join(bumped)
}


exports.calcLevel = calcLevel
/**
 * calcLevel - determine the bump level from the change tree
 *
 * @param  {Object} config fully-resolved (defaults-applied) configuration
 * @param  {Object} tree   changetree from this verion's commit logs
 * @return {Object}        flags for which level to bump
 */
function calcLevel(config, tree) {
  const level = {
    patch: false,
    minor: false,
    major: false,
    // This is ONLY called in the release workflow, so indicate we're releasing
    release: true,
  }
  for (const [key, sect] of Object.entries(config.sections)) {
    if (tree[key].length && sect.bump) {
      level[sect.bump] = true
    }
  }
  if (level.major) {
    level.minor = false
  } else if (! level.minor) {
    level.patch = true
  }
  return level
}


exports.split = (current) => {
  const validVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([alpha|beta|rc]+)\.(0|[1-9]\d*))?$/
  if (!validVersion.test(current)) {
    throw `The version "${current}" isn't in a form I know how to handle.`
  }
  const parts = current.match(validVersion)
  return {
    major: parseInt(parts[1], 10),
    minor: parseInt(parts[2], 10),
    patch: parseInt(parts[3], 10),
    stage: parts[4],
    rev: parseInt(parts[5], 10),
  }
}


exports.validBump = (parts, args) => {
  return ! ((parts.stage === 'rc' && (args.alpha || args.beta)) ||
            (parts.stage === 'beta' && args.alpha))
}
