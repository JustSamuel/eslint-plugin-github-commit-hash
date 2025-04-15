import { Rule } from 'eslint';
import { AST as JsonAST, RuleListener } from "jsonc-eslint-parser";

const isPackageJson = (filePath: string): boolean => /(?:^|[/\\])package.json$/.test(filePath);

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure GitHub dependencies in package.json contain a commit hash',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [],
  },
  create(context: Rule.RuleContext): RuleListener {
    if (!isPackageJson(context.filename)) {
      return {};
    }

    return {
      "Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty > JSONObjectExpression"(node: JsonAST.JSONObjectExpression & { properties: JsonAST.JSONProperty[] }) {
        const dependencies: { [key: string]: { value: string, loc: any } } = node.properties.reduce((acc: any, prop: any) => {
          if (prop.key.type === 'JSONLiteral' && prop.value.type === 'JSONLiteral') {
            acc[prop.key.value as string] = { value: prop.value.value as string, loc: prop.value.loc };
          }
          return acc;
        }, {} as { [key: string]: { value: string, loc: any } });

        Object.entries(dependencies).forEach(([name, { value: version, loc }]) => {
          const githubRepoPattern = /^github:.*#[0-9a-fA-F]{40}$/;
          if (version.startsWith('github:') && !githubRepoPattern.test(version)) {
            context.report({
              loc,
              message: `Dependency "${name}" must contain a commit hash in its version "${version}"`,
            });
          }
        });
      },
    };
  },
};

export = rule;
