# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.1.0 - 2025-04-15
### Added
- Require git commit hash to be the full 40 characters.

## 1.0.3 - 2024-05-22
### Added
- `loc` is now correctly reported in the error message

## 1.0.2 - 2024-05-22
### Added
- GitHub workflow to release the package. No feature changes.

## 1.0.1 - 2024-05-18
### Changed
- Downgraded `eslint` peer dependency from version 9 to version 8.

## 1.0.0 - 2024-05-18
### Added
- Initial release of `eslint-plugin-github-commit-hash`.
- Added rule to ensure GitHub dependencies in `package.json` contain a commit hash.
