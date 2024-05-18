import { RuleTester } from 'eslint';
import rule from '../lib/rules/check-git-commit-hash';

import type * as ESTree from "estree";
import { AST, Rule, SourceCode } from "eslint";
import { AST as JsonAST, RuleListener } from "jsonc-eslint-parser";
// tslint:disable-next-line
const jsonParser = require('jsonc-eslint-parser');


export type JsonAstBodyProperty = JsonAST.JSONProperty & {
  value: string;
};

export type JsonAstBodyExpression = ESTree.Expression & {
  properties: JsonAstBodyProperty[];
};

export interface JsonAstBodyStatement extends ESTree.ExpressionStatement {
  expression: JsonAstBodyExpression;
}

export interface PackageJsonAst extends AST.Program {
  body: [JsonAstBodyStatement];
}

export interface PackageJsonSourceCode extends SourceCode {
  ast: PackageJsonAst;
}

export interface PackageJsonRuleContext<Options extends unknown[] = unknown[]>
  extends Rule.RuleContext {
  options: Options;
  sourceCode: PackageJsonSourceCode;
}

export interface PackageJsonRuleModule<Options extends unknown[] = unknown[]> {
  create(context: PackageJsonRuleContext<Options>): RuleListener;
  meta: Rule.RuleMetaData;
}
export interface PackageJsonRuleModule<Options extends unknown[] = unknown[]> {
  create(context: PackageJsonRuleContext<Options>): RuleListener;
  meta: Rule.RuleMetaData;
}

export type JsonRuleTesterRun = (
  name: string,
  rule: PackageJsonRuleModule,
  tests: {
    invalid?: RuleTester.InvalidTestCase[] | undefined;
    valid?: (RuleTester.ValidTestCase | string)[] | undefined;
  },
) => void;

export type JsonRuleTester = RuleTester & {
  run: JsonRuleTesterRun;
};

export const ruleTester = new RuleTester({
  languageOptions: {
    parser: jsonParser,
  }
}) as JsonRuleTester;

ruleTester.run('check-git-commit-hash', rule as PackageJsonRuleModule, {
  valid: [
    {
      code: `{
        "dependencies": {
          "@gewis/test": "github:GEWIS/test#123456"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "dependencies": {
          "@gewis/test": "github:GEWIS/test#abcd1234"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "devDependencies": {
          "@gewis/test": "github:GEWIS/test#123456"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "dependencies": {
          "@gewis/test": "github:GEWIS/test#abcd1234"
        },
        "devDependencies": {
          "@gewis/test": "github:GEWIS/test#123456"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "devDependencies": {
          "@gewis/test": "github:GEWIS/test#abcd1234"
        }
      }`,
      filename: 'package.json',
    }
  ],
  invalid: [
    {
      code: `{
        "dependencies": {
          "@gewis/test": "github:GEWIS/test",
          "@gewis/good": "github:GEWIS/good#abcd1234"
        }
      }`,
      filename: 'package.json',
      errors: [{ message: 'Dependency "@gewis/test" must contain a commit hash in its version "github:GEWIS/test"' }]
    },
    {
      code: `{
        "devDependencies": {
          "@gewis/test": "github:GEWIS/test",
          "@gewis/good": "github:GEWIS/good#abcd1234"
        }
      }`,
      filename: 'package.json',
      errors: [{ message: 'Dependency "@gewis/test" must contain a commit hash in its version "github:GEWIS/test"' }]
    },
    {
      code: `{
        "dependencies": {
          "@gewis/test": "github:GEWIS/test"
        },
        "devDependencies": {
          "@gewis/test": "github:GEWIS/test#abcd1234"
        }
      }`,
      filename: 'package.json',
      errors: [{ message: 'Dependency "@gewis/test" must contain a commit hash in its version "github:GEWIS/test"' }]
    },
    {
      code: `{
        "dependencies": {
          "@gewis/test": "github:GEWIS/test#abcd1234"
        },
        "devDependencies": {
          "@gewis/test": "github:GEWIS/test"
        }
      }`,
      filename: 'package.json',
      errors: [{ message: 'Dependency "@gewis/test" must contain a commit hash in its version "github:GEWIS/test"' }]
    }
  ]
});

