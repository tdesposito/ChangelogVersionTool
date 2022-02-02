# cvbump - Changelog and Version Bumping Tool (version 1.2.4)

This tool combines the process of updating a project's version identifier(s) and
the corresponding Changelog. It works with either `package.json` or
`pyproject.toml` files, and automatically determines the type of version bump
needed based on [Keep A Changelog](https://keepachangelog.com/) and [Semantic
Versioning](https://semver.org/) recommendations.

It will update the version string in any set of files you specify, beyond the
project's configuration file. See [Updating non-configuration
files](#updating-non-configuration-files), below, for further details.

[![GitHub package.json version (main)](https://img.shields.io/github/package-json/v/tdesposito/ChangelogVersionTool/main?label=Version)](https://github.com/tdesposito/ChangelogVersionTool)
[![npm](https://img.shields.io/npm/v/cvbump)](https://npmjs.org/package/cvbump)
![License](https://img.shields.io/github/license/tdesposito/ChangelogVersionTool)
![npm](https://img.shields.io/npm/dm/cvbump)

## Installation

`cvbump` can be installed globally, so you can used it from anywhere.

```console
$ npm install -g cvbump
... (lots of npm stuff) ...
```

If you only need it for one project, you can install it locally to that project.

```console
$ npm install --save-dev cvbump
... (lots of npm stuff) ...
```

You can also use it without installation:

```console
$ npx cvbump
... (cvbump feedback) ...
```

## Usage

You can use cvbump either from the command line (CLI) or as a library
(programmatically).

### CLI Usage (short version)

The general workflow is:

* bump the version to pre-release (defaults to alpha):

    ```console
    $ cvbump pre
    cvbump: updated version to 1.0.1-alpha.0
    ```

* write, test, repeat as needed to implement a feature/fix/etc
* commit the feature/fix/etc, starting the commit message with a keyword as
  described on [Keep A Changelog](https://keepachangelog.com/):

    ```console
    $ git commit -a -m 'Fixed the frappis to verplonk correctly; closes #42'
    ... (git response) ...
    ```

* bump the pre-release version in preparation for the **next** feature/fix/etc:

    ```console
    $ cvbump
    cvbump: updated version to 1.0.1-alpha.1
    ```

* repeat until all the changes for the next release are committed and ready
  for production; then:

    ```console
    $ cvbump release
    cvbump: updated version to 1.0.1; updated "./CHANGELOG.md"; tagged as "v1.0.1"
    ```

### CLI Usage (long version)

`cvbump` has several commands: `init`, `pre`, `release` and `generate`.

If used without any command, and the version is pre-release, its bumps the
pre-release version component. Otherwise, runs the `release` workflow (see
below).

#### `init`

You can use `cvbump` without any extra configuration, but if you want to
customize the way it works, make sure your local project's package configuration
file, either `package.json` or `pyproject.toml`, is in place. (If your project
contains **_both_** `package.json` and `pyproject.toml`, `cvbump` will prefer
`package.json`.) Then:

```console
$ cvbump init
cvbump: initialized configuration in "./package.json"; version is 1.0.0
```

In response, `cvbump` will add a minimal configuration to your local config file
(see [Configuration](#configuration), below, for more details). It takes the
current version from your project's configuration file. If not set, it defaults
to `1.0.0`.

If you want to keep `cvbump` **out** of your project configuration file, use:

```console
$ cvbump init --cfgfile
cvbump: initialized configuration in "./cvbump.json"; version is 1.0.0
```

#### `pre`

The `pre` command sets the project up for a pre-release version. By default, we
increment the _patch_ level, and append `-alpha.0`.

_**PLEASE NOTE: The eventual release version may not be a patch-level bump,
depending on the types of commits which are eventually added. This behavior sets
the MINIMUM eventual version.**_

You can override the version part to be bumped, via `--major` or `--minor`
flags, and the pre-release stage via `--beta` or `--rc` flags.

You can also bump from _alpha_ to _beta_ or _rc_, or from _beta_ to _rc_, by
re-issuing the `pre` command with the corresponding flag. The pre-release
component will always start at _0_. You cannot, however, go downward, from _rc_
to _beta_, or from _beta_ to _alpha_, nor can you change the version part to be
bumped.

Use of `pre` is entirely optional, though quite useful. It's purpose is to batch
a number of changes into a single release and list all of those changes under
that release's header in the changelog.

#### `release`

Use the `release` command to move from a pre-release version onto the
corresponding release version, or from one release to another. We determine
which version component (_major_, _minor_ or _patch_) to update based on your
recent commit history.

`release` updates the changelog from your commit history, commits updated
files and tags the commit with the version.

If you have un-staged changes in your working set, `cvbump` warns you, and
optionally aborts.

#### `generate`

Normally `cvbump` will collect changes since the previous release, and
insert them into the changelog just above the first _##_ line.

However, if your changelog is in some way out of sync with the project, or for
adding a changelog to an existing project, you can use `generate` to completely
rebuild your changelog file from your git commit and tag history.

### Programmatic usage

The `cvbump` module exposes four functions, which exactly mirror the commands listed above. You pass CLI-like arguments to each function.

```javascript
const cvbump = require('cvbump')
cvbump.init()
cvbump.pre({alpha: true, minor: true})
cvbump.release()
cvbump.generate()
```

If you want the default auto-bump behavior, use:

```javascript
cvbump.auto()
```

## Configuration

`cvbump` looks for it's configuration in these files, in this order:

  1. `cvbump.json`
  1. `package.json`, under the `cvbump` key
  1. `pyproject.toml`, in the `[tool.cvbump]` table

### Updating non-configuration files

In addition to managing the version key in the canonical project configuration
file[^1], `cvbump` can sync the current project version in multiple other files,
i.e. in an HTML template, the README file, or one or more sub-components. This
feature is controlled via the project's configuration file (see above).

[^1]: We assume a PEP621-compliant `pyproject.toml`. YMMV.

If using a `json` configuration file:

```json
{
  "cvbump": {
    "update": [
      {
        "comment": "target a (possibly nested) key in a JSON file. This comment is instructive, not functional",
        "file": "some-file.json",
        "key": "software.version.key"
      },
      {
        "comment": "target a string in file. This comment is instructive, not functional",
        "file": "README.md",
        "search": "cvbump Version {{version}}"
      }
    ]
  }
}
```

Or, if using a `toml` configuration file:

```toml
[tool.cvbump]
  [[update]]
    # target a (possibly nested) key in a JSON file.
    file = "some-file.json"
    key = "software.version.key"
  [[update]]
    # target a string in file.
    file = "README.md"
    search = "cvbump Version {{version}}"
```

Each file is searched for the corresponding `search` phrase with the current
version, **OR** for config-type files the indicated `key`. When found the search text
or key is replaced with the NEW version. If the search fails, you get a warning.

### Configuring Changelog generation

By default, `cvbump` builds a changelog in the style of [Keep A
Changelog](https://keepachangelog.com/). However, you can customize this process
by specifying various parameters in the active configuration file.

If you use `cvbump init --all`, your configuration file will have ALL of the config parameters `cvbump` uses

```json
{
  "cvbump": {
    "changelog": "CHANGELOG.md",
    "showMessageBody": true,
    "preamble": "... the Markdown which start your changelog file",
    "postamble": "... The Markdown which ends your changelog file",
    "sections": { "... many lines ..." },
    "templates": { "... many lines ..." },
    "linkedTemplates": { "... many lines ..." },
    "update": [],
  }
}
```

#### `changelog`

The filename in which to keep the changelog.

#### `showMessageBody`

If `true`, the body of commit messages, if any, is included in the changelog.

#### `preamble`

The Markdown text to place at the top of the changelog.

#### `postamble`

The Markdown text to place at the bottom of the changelog.

#### `update`

The list of files to update when the version changes (see above).

#### `sections`

The list of categories to find in your commit history, and how to process
them. Each category looks like:

```json
  {
    "...{rule name}...": {
      "pattern": "...{regex to find this type of commit in the log}...",
      "order": 1,
      "heading": "...{the heading for the section}...",
      "bump": "...{the component to bump when this rule matches (major/minor/patch)}..."
    },
  }
```

The `order` component indicates the order of matches to this rule in the
changelog section. use -1 to suppress output of matches from this rule.

`bump` may be omitted if the rule should not trigger a version bump.

#### `templates`

Template strings used to build the changelog.

#### `linkedTemplates`

Template strings used to build the changelog, including links to GitHub.
