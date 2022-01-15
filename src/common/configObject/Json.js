// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

const fs = require('fs')

/**
 * Class representing a JSON configuration object (cvbump.json/package.json) on
 * disk.
 */
class JsonCfgObject {
  /** @constructs  */
  constructor(cfName) {
    this.fname = cfName
    if (! fs.existsSync(cfName)) {
      fs.writeFileSync(cfName, '{}')
    }
    this.data = JSON.parse(fs.readFileSync(this.fname))
  }


  /** the project's current version (get/set) */
  get version() {
    return this.data.version
  }
  set version(v) {
    this.data.version = v
  }


  /**
   * the project's most recent release version (get/set)
   * this is used internally, and only updates when entering `pre` stage
   */
  get previousRelease() {
    return this.data['cvbump:previousRelease']
  }
  set previousRelease(v) {
    this.data['cvbump:previousRelease'] = v
  }


  /** the cvbump configuration section (get/set) */
  get cvbump() {
    return this.data.cvbump
  }
  set cvbump(v) {
    this.data.cvbump = v
  }

  /** write updates to the file on disk */
  update() {
    fs.writeFileSync(this.fname, JSON.stringify(this.data, null, 2))
  }
}

exports.get = (cfName) => new JsonCfgObject(cfName)
