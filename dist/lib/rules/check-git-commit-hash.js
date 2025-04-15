"use strict";
const isPackageJson = (filePath) => /(?:^|[/\\])package.json$/.test(filePath);
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
    create(context) {
        if (!isPackageJson(context.filename)) {
            return {};
        }
        return {
            "Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty > JSONObjectExpression"(node) {
                const dependencies = node.properties.reduce((acc, prop) => {
                    if (prop.key.type === 'JSONLiteral' && prop.value.type === 'JSONLiteral') {
                        acc[prop.key.value] = { value: prop.value.value, loc: prop.value.loc };
                    }
                    return acc;
                }, {});
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
module.exports = rule;
