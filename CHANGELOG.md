# Changelog

All notable changes to this project will be documented in this file.

* The format is based on [Keep a Changelog](https://keepachangelog.com/)
* This project adheres to [Semantic Versioning](https://semver.org/)
* This project uses [cvbump](https://github.com/tdesposito/cvbump) to maintain this changelog.

## [1.2.3](https://github.com/tdesposito/ChangelogVersionTool/releases/tag/v1.2.3) - 2022-01-27

### Fixed

* Fixed bug where release didn't drop the stage ([407afa5](https://github.com/tdesposito/ChangelogVersionTool/commit/407afa53763b2445bbde7aa02515a51aa888e059) by Todd Esposito)
* Fixed RegExp for when search contains metachars ([878be0c](https://github.com/tdesposito/ChangelogVersionTool/commit/878be0c5776a9122331ef48d122546cff127846f) by Todd Esposito)
* Fixed replaceAll usage for NodeJS < 16 ([97b48c5](https://github.com/tdesposito/ChangelogVersionTool/commit/97b48c5a510e56302bf50826158b005ad3eb8e76) by Todd Esposito)

## [1.2.2](https://github.com/tdesposito/ChangelogVersionTool/releases/tag/v1.2.2) - 2022-01-20

### Changed

* Changed init to a minimal configuration ([c189cef](https://github.com/tdesposito/ChangelogVersionTool/commit/c189cef8955708dc24bd0910518640113536f005) by Todd Esposito)
  <br>_The original verbose init is now behind the --all switch_

### Fixed

* Fix auto() module refs ([51663b7](https://github.com/tdesposito/ChangelogVersionTool/commit/51663b771f5f08cd28c1e66eefdd5ebba6791e96) by Todd Esposito)

## [1.2.1](https://github.com/tdesposito/ChangelogVersionTool/releases/tag/1.2.1) - 2022-01-17

### Fixed

* Fixed bug in github links (forgot to remove .git) ([c40d0fb](https://github.com/tdesposito/ChangelogVersionTool/commit/c40d0fb7eb7a4df14061ab34949948c32628b5bc) by Todd Esposito)

## [1.2.0](https://github.com/tdesposito/ChangelogVersionTool.git/releases/tag/1.2.0) - 2022-01-17

### Added

* Added stdout feedback to generate command ([db28cd5](https://github.com/tdesposito/ChangelogVersionTool.git/commit/db28cd5a0eed6883553d9d131229ce6f14d9b0fd) by Todd Esposito)
* Added --(no-)commit option to generate command ([df4e55a](https://github.com/tdesposito/ChangelogVersionTool.git/commit/df4e55a1966e62ddcfc726fee1a2f34153a222f2) by Todd Esposito)
* Added github repo links when available ([aac1bdf](https://github.com/tdesposito/ChangelogVersionTool.git/commit/aac1bdf147d9d946a722abc0c3aef73d29dc7f82) by Todd Esposito)

### Other Updates

* Updated message regexes ([dc012f4](https://github.com/tdesposito/ChangelogVersionTool.git/commit/dc012f417ced6a5c5edad31c81170c8b3c9e42af) by Todd Esposito)
  <br>_This update partially accomodates conventional-commit standards._

## 1.1.0 - 2022-01-15

### Added

* Added (no)commit/(no)tag options to release.

### Fixed

* Fixed MD formatting between headings

## v1.0.0

Initial public release.

## Notes

None at this time.
