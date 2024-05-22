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
                        acc[prop.key.value] = prop.value.value;
                    }
                    return acc;
                }, {});
                Object.entries(dependencies).forEach(([name, version]) => {
                    const githubRepoPattern = /^github:.*#\w+$/;
                    if (version.startsWith('github:') && !githubRepoPattern.test(version)) {
                        context.report({
                            loc: { line: 1, column: 0 }, // Adjust this location as needed
                            message: `Dependency "${name}" must contain a commit hash in its version "${version}"`,
                        });
                    }
                });
            },
        };
    },
};
module.exports = rule;
