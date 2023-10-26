// @ts-ignore
import { defineConfig } from 'vite';
// @ts-ignore
import react from '@vitejs/plugin-react';
// @ts-ignore
import json from './package.json';
// @ts-ignore
import vitePluginImp from 'vite-plugin-imp';

export default defineConfig({
	build: {
		lib: {
			entry: './src/public.ts',
			name: 'anthaathi-common',
		},
		sourcemap: true,
		rollupOptions: {
			external: (id) => {
				const peerDeps = Object.keys(json.peerDependencies);
				const deps = [
					'lodash',
					'property-expr',
					'react',
					'base',
					'recoil',
					...peerDeps,
				];
				return deps.some((i) => id.includes(i));
			},
			output: {
				globals: (id) => id.split('/').join('_'),
			},
		},
	},
	plugins: [
		react({
			babel: {
				babelrc: true,
			},
		}),
		vitePluginImp({
			libList: [
				{
					libName: '@carbon/icons-react',
					camel2DashComponentName: false,
					replaceOldImport: true,
					libDirectory: 'lib',
					style() {
						return false;
					},
				},
			],
		}),
	],
	server: {
		port: 3007,
		proxy: {
			'/graphql': {
				target: 'http://localhost:5083',
				rewrite: () => '/graphql',
			},
		},
	},
});
