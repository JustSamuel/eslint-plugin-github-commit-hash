import {RuleTester} from 'eslint';
import rule from '../lib/rules/check-git-commit-hash';

import type * as ESTree from "estree";
import {AST, Rule, SourceCode} from "eslint";
import {AST as JsonAST, RuleListener} from "jsonc-eslint-parser";
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
          "@package/test": "github:package/test#783ca8f763a646315bda2d51e60cb8d5419bf807"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "dependencies": {
          "@package/test": "github:package/test#8b611e724343993aa9c2447964920af0499aceda"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "devDependencies": {
          "@package/test": "github:package/test#e087dc8a8759fb3ac7eb2a7890fac6904182cae5"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "dependencies": {
          "@package/test": "github:package/test#cd5c93ef73ca304b992c1a52c3fadd041fcae1da"
        },
        "devDependencies": {
          "@package/test": "github:package/test#cd5c93ef73ca304b992c1a52c3fadd041fcae1da"
        }
      }`,
      filename: 'package.json',
    },
    {
      code: `{
        "devDependencies": {
          "@package/test": "github:package/test#cd5c93ef73ca304b992c1a52c3fadd041fcae1da"
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
          "@package/good": "github:package/good#783ca8f763a646315bda2d51e60cb8d5419bf807"
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
          "@package/good": "github:package/good#783ca8f763a646315bda2d51e60cb8d5419bf807"
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
          "@package/test": "github:package/test#783ca8f763a646315bda2d51e60cb8d5419bf807"
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
          "@package/test": "github:package/test#783ca8f763a646315bda2d51e60cb8d5419bf807"
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

