// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

/**
 * Include functions for manipulating Git
 *
 * @module Git
 */


const {execSync} = require('child_process')

const git = cmd => {
  try {
    execSync(`git ${cmd}`, {stdio: 'inherit'})
    return true
  } catch (error) {
    // we'll rely on the user to figure it out the error on the console.
    return false
  }
}


exports.commit = commit
/**
 * commit - commit the named working set files
 *
 * @param  {Array} files    list of files to commit
 * @param  {string} message commit message to use
 * @return {boolean}        true on success
 */
function commit(files, message) {
  return git(`add ${files.join(' ')}`) &&
    git(`commit -m "${message}"`)
}


exports.log = log
/**
 * log - get commit log data, from the named tag forward
 *
 * @param  {type} fromtag=null commit tag to start with, or every commit if null
 * @return {Array}             list of commit log entries, as formatted
 */
function log(fromtag=null) {
  try {
    let range = ""
    if (fromtag) {
      range = `v${fromtag}..HEAD`
    }
    return execSync(`git log ${range} --pretty="format:%H##%h##%an##%d##%as##%s"`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().split("\n")
  } catch (error) {
    return []
  }
}


exports.logFor = logFor
/**
 * logFor - get the commit message body
 *
 * @param  {string} hash hash of the commit to query
 * @return {Array}       message body, split into lines
 */
function logFor(hash) {
  return execSync(`git log --format=%B -n 1 ${hash}`, { stdio: ['pipe', 'pipe', 'ignore'] })
    .toString()
    .split('\n')
    .slice(2)
}


exports.remote = remote
/**
 * remote - get the url for the Git remote
 *
 * @return {string} url for the remote
 */
function remote() {
  try {
    return execSync('git remote get-url origin', {stdio: ['pipe', 'pipe', 'ignore']}).toString().trim()
  } catch (error) {
    return ''
  }
}


exports.tag = tag
/**
 * tag - tag HEAD with the current version
 *
 * @param  {string} version current version
 * @return {boolean}        true on success
 */
function tag(version) {
  return git(`tag v${version}`)
}
