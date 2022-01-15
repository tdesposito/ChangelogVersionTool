// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

module.exports = init

/**
* Initialize cvbump's configuration
*
* @param  {Object} argv configuration options, usually from the cli
*/
function init(args = {}) {
  const fs = require('fs')
  const { defaultConfig, determineCfgFile, getConfigObject } = require('../common/config')
  const git = require('../common/git')

  var cfName

  if (args.cfgfile === undefined) {
    // we need to find the config file
    if ((cfName = determineCfgFile()) === "") {
      console.log("error: could not locate a local configuration file. Please build your project's configuration file before running cvbump init.")
    }
  } else if (args.cfgfile === true) {
    cfName = 'cvbump.json'
  } else {
    if (fs.existsSync(args.cfgfile)) {
      cfName = args.cfgfile
    } else {
      console.log(`error: could not locate '${args.cfgfile}'. Please check your spelling, or create the file before running cvbump init.`)
    }
  }
  if (cfName) {
    const cfg = getConfigObject(cfName)
    if (cfg.version === undefined) {
      cfg.version = "1.0.0"
    }
    if (cfg.cvbump) {
      console.log(`warning: init won't overwrite the current contents of your cvbump configuration. Aborting.`)
    } else {
      cfg.cvbump = defaultConfig
      cfg.update()
      git.commit([cfName], 'cvbump - initialize configuration')
      console.log(`cvbump: initialized configuration in '${cfName}'; version is ${cfg.version}`)
    }
  }
}
