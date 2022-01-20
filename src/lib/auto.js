// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

module.exports = auto

function auto() {
    const config = require('../common/config').get()
    const parts = require('../common/version').split(config.version)
    if (parts.stage) {
        require('./pre')({})
    } else {
        require('./release')({})
    }
}
