# eslint-plugin-github-commit-hash

An ESLint plugin to ensure GitHub dependencies in `package.json` contain a commit hash. 

## Installation

To use this ESLint plugin, install it as a development dependency:

```sh
npm install eslint-plugin-github-commit-hash --save-dev
```

## Usage

Add `github-commit-hash` to the plugins section of your ESLint configuration file (e.g., `.eslintrc.js`):

```javascript
module.exports = {
  plugins: [
    'github-commit-hash',
  ],
  overrides: [
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'github-commit-hash/check-git-commit-hash': 'error',
      },
    },
  ],
};
```

This configuration will enable the rule that checks for commit hashes in GitHub dependencies within your `package.json` file.

## Rule Details

### check-git-commit-hash

This rule checks that all GitHub dependencies in your `package.json` file include a commit hash.

### Examples

#### Valid

```json
{
  "dependencies": {
    "@example/test": "github:example/test#123456"
  }
}
```

```json
{
  "devDependencies": {
    "@example/test": "github:example/test#abcd1234"
  }
}
```

#### Invalid

```json
{
  "dependencies": {
    "@example/test": "github:example/test"
  }
}
```

```json
{
  "devDependencies": {
    "@example/test": "github:example/test"
  }
}
```

## Development

### Setup

Clone the repository and install the dependencies:

```sh
git clone https://github.com/JustSamuel/eslint-plugin-github-commit-hash.git
cd eslint-plugin-github-commit-hash
npm install
```

### Building

Compile the TypeScript code:

```sh
npm run build
```

### Running Tests

Run the tests to ensure your code works as expected:

```sh
npm run test
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have any suggestions or improvements.

## Acknowledgements

This plugin was developed using the excellent [jsonc-eslint-parser](https://github.com/ota-meshi/jsonc-eslint-parser) package and with great inspiration from [eslint-plugin-package-json](https://www.npmjs.com/package/eslint-plugin-package-json).
I would be delighted if this would one day find its way into eslint-plugin-package-json itself.
