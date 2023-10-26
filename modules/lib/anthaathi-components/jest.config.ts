import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'[/\\\\]node_modules[/\\\\](?!(react-markdown|remark-gfm|vfile|vfile-message|markdown-table|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|escape-string-regexp|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|ccount)).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
	],
	moduleNameMapper: {
		'react-markdown': '<rootDir>/tools/jest/react-markdown-stub.js',
		'remark-gfm': '<rootDir>/tools/jest/react-markdown-stub.js',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
