"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleTester = void 0;
const eslint_1 = require("eslint");
const check_git_commit_hash_1 = __importDefault(require("../lib/rules/check-git-commit-hash"));
// tslint:disable-next-line
const jsonParser = require('jsonc-eslint-parser');
exports.ruleTester = new eslint_1.RuleTester({
    languageOptions: {
        parser: jsonParser,
    }
});
exports.ruleTester.run('check-git-commit-hash', check_git_commit_hash_1.default, {
    valid: [
        {
            code: `{
        "dependencies": {
          "@package/test": "github:package/test#123456"
        }
      }`,
            filename: 'package.json',
        },
        {
            code: `{
        "dependencies": {
          "@package/test": "github:package/test#abcd1234"
        }
      }`,
            filename: 'package.json',
        },
        {
            code: `{
        "devDependencies": {
          "@package/test": "github:package/test#123456"
        }
      }`,
            filename: 'package.json',
        },
        {
            code: `{
        "dependencies": {
          "@package/test": "github:package/test#abcd1234"
        },
        "devDependencies": {
          "@package/test": "github:package/test#123456"
        }
      }`,
            filename: 'package.json',
        },
        {
            code: `{
        "devDependencies": {
          "@package/test": "github:package/test#abcd1234"
        }
      }`,
            filename: 'package.json',
        }
    ],
    invalid: [
        {
            code: `{
        "dependencies": {
          "@package/test": "github:package/test",
          "@package/good": "github:package/good#abcd1234"
        }
      }`,
            filename: 'package.json',
            errors: [
                {
                    message: 'Dependency "@package/test" must contain a commit hash in its version "github:package/test"',
                    line: 3,
                    column: 28
                },
            ]
        },
        {
            code: `{
        "devDependencies": {
          "@package/test": "github:package/test",
          "@package/good": "github:package/good#abcd1234"
        }
      }`,
            filename: 'package.json',
            errors: [
                {
                    message: 'Dependency "@package/test" must contain a commit hash in its version "github:package/test"',
                    line: 3,
                    column: 28
                }
            ]
        },
        {
            code: `{
        "dependencies": {
          "@package/test": "github:package/test"
        },
        "devDependencies": {
          "@package/test": "github:package/test#abcd1234"
        }
      }`,
            filename: 'package.json',
            errors: [
                {
                    message: 'Dependency "@package/test" must contain a commit hash in its version "github:package/test"',
                    line: 3,
                    column: 28
                }
            ]
        },
        {
            code: `{
        "dependencies": {
          "@package/test": "github:package/test#abcd1234"
        },
        "devDependencies": {
          "@package/test": "github:package/test"
        }
      }`,
            filename: 'package.json',
            errors: [
                {
                    message: 'Dependency "@package/test" must contain a commit hash in its version "github:package/test"',
                    line: 6,
                    column: 28
                }
            ]
        }
    ]
});
