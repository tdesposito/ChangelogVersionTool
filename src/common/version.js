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
  const newstage = args.rc ? 'rc' : (args.beta ? 'beta' : (args.alpha ? 'alpha' : parts.stage))
  return exports.join({
    major: parts.major + (args.major ?  1 : 0),
    minor: args.minor ? parts.minor + 1 : (args.major ? 0 : parts.minor),
    // patch is bumped if we are on release, but not --major/minor
    // patch is set to 0 if --major/minor
    // patch is not bumped if stage is changed
    patch: (parts.stage === undefined && (!(args.major || args.minor))) ? parts.patch + 1 :
           ((args.major || args.minor) ? 0 : parts.patch),
    stage: newstage,
    rev: (newstage === parts.stage) ? parts.rev + 1 : 0
  })
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
