// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

module.exports = release

/**
* Puts the project into a release state, or, if already there, bumps the
* version. Version bumps are inferred from recent change history.
*
* @param  {Object} argv configuration options
 */
function release() {
    const fs = require('fs')
    const split = require('split2')
    const changelog = require('../common/changelog')
    const configuration = require('../common/config')
    const git = require('../common/git')
    const updater = require('../common/updater')
    const version = require('../common/version')

    const config = configuration.get()
    const resolvedConfig = configuration.getResolved()

    let current = config.version
    let [bumped, prerel] = current.split('-')
    let gitlog, tree

    if (prerel) {
        gitlog = git.log(config.previousRelease)
    } else {
        gitlog = git.log(current)
    }
    if (gitlog.length) {
        tree = changelog.buildChangeTree(resolvedConfig, gitlog)
        bumped = version.calcBumped(version.split(current), version.calcLevel(resolvedConfig, tree))

        if (!fs.existsSync(resolvedConfig.changelog)) {
            // if the file doesn't exist, we need to generate first
            require('./generate').handler({ commit: false })
        }

        // Insert the new section into the existing changelog:
        const sect = changelog.buildLogSection(resolvedConfig, tree, {
            current,
            bumped,
            date: new Date().toISOString().slice(0, 10)
        })
        fs.createReadStream(resolvedConfig.changelog)
            .pipe(split())
            .pipe(insertSection(sect))
            .pipe(fs.createWriteStream(`.tmp_${resolvedConfig.changelog}`))
            .on('finish', () => {
                fs.unlinkSync(resolvedConfig.changelog)
                fs.renameSync(`.tmp_${resolvedConfig.changelog}`, resolvedConfig.changelog)

                config.version = bumped
                config.update()
                let updated = [config.fname, resolvedConfig.changelog]
                if (config.update) {
                    updated.push(...updater.updateAll(resolvedConfig, current, bumped))
                }

                git.commit(updated, `Bumped version ${current} → ${bumped}`)
                git.tag(bumped)

                console.log(`cvbump: Bumped version ${current} → ${bumped}`)
            })
    } else {
        console.log('cvbump: no recent commit history; cannot release')
    }
}


/**
 * A pipeline function which insert the new changelog section into the existing
 * file.
 *
 * @private
 * @param  {type} section description
 * @return {type}         description
 */
function insertSection(section) {
    const { Transform } = require('stream')
    let placed = false
    return new Transform({
        transform(chunk, enc, callback) {
            const line = chunk.toString()
            if ((!placed) && line.startsWith('## ')) {
                callback(null, `${section}\n${line}\n`)
                placed = true
            } else {
                callback(null, `${line}\n`)
            }
        }
    })
}
