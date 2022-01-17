// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

module.exports = generate

/**
 * Generate a changelog from the total commit history.
 *
 * This subcommand reads the project's entire commit history, and builds a
 * changelog based on existing tags.
 *
 * @param  {Object} argv configuration options, usually from the cli
 */
function generate(argv = {}) {
  const fs = require('fs')

  const changelog = require('../common/changelog')
  const config = require('../common/config').getResolved()
  const git = require('../common/git')

  process.stdout.write("cvbump: Building change log...")
  const tagGroups = changelog.buildTagGroups(git.log())

  const outfile = fs.createWriteStream(config.changelog).on('finish', () => {
      if (argv.commit) {
        git.commit([config.changelog], "cvbump - (re-)generate changelog")
        console.log(`cvbump: generated and committed ${config.changelog}`)
      }
  })
  process.stdout.write(".")
  outfile.write(config.preamble)

  if (tagGroups.length > 1) {
    // we have at least one version tag; We always have the '' (unreleased) tag
    for (const group of tagGroups.slice(1)) {
      process.stdout.write(".")
      const subtree = changelog.buildChangeTree(config, group.commits)
      outfile.write(changelog.buildLogSection(config, subtree, group))
      outfile.write('\n')
    }
  }
  outfile.end(config.postamble)
  process.stdout.write("done.\n")
}
