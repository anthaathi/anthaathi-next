const {
    dirname,
    join
} = require("path");

/**
 * @type {import('@storybook/react').StorybookConfig}
 */
module.exports = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		getAbsolutePath("@storybook/addon-links"),
		getAbsolutePath("@storybook/addon-essentials"),
		getAbsolutePath("@storybook/addon-interactions"),
	],
	framework: {
		name: getAbsolutePath("@storybook/react-vite"),
		options: {
			strictMode: false,
		},
	},
	core: {
		disableTelemetry: true,
	},
	features: {
		storyStoreV7: true,
	},
	async viteFinal(config, { configType }) {
		config.plugins = [
			...config.plugins.filter((plugin) => {
				return !(
					Array.isArray(plugin) && plugin[0].name === 'vite:react-babel'
				);
			}),
			require('@vitejs/plugin-react')({
				exclude: [/\.stories\.(t|j)sx?$/, /node_modules/],
				babel: {
					plugins: ['formatjs'],
				},
			}),
		];
		return config;
	},
	docs: {
		autodocs: true,
	},
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}
