// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

const fs = require('fs')
const TOML = require('@iarna/toml')

/**
 * Class representing a TOML configuration object (pyproject.toml) on
 * disk.
 */
class TomlCfgObject {
  /** @constructs  */
  constructor(cfName) {
    this.fname = cfName
    this.data = TOML.parse(fs.readFileSync(this.fname))
  }

  /** the project's current version (get/set) */
  get version() {
    return this.data.project?.version
  }
  set version(v) {
    this.data.project.version = v
  }


  /**
   * the project's most recent release version (get/set)
   * this is used internally, and only updates when entering `pre` stage
   */
  get previousRelease() {
    return this.data.tool['cvbump-previousRelease']
  }
  set previousRelease(v) {
    this.data.tool['cvbump-previousRelease'] = v
  }

  /** the cvbump configuration section (get/set) */
  get cvbump() {
    return this.data.tool.cvbump || {}
  }
  set cvbump(v) {
    if (! this.data.tool) {
      this.data.tool = {}
    }
    this.data.tool.cvbump = v
  }

  /** write updates to the file on disk */
  update() {
    fs.writeFileSync(this.fname, TOML.stringify(this.data))
  }
}

exports.get = (cfName) => new TomlCfgObject(cfName)
