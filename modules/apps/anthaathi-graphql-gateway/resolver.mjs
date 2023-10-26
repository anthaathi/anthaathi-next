import fs from 'fs';
import path from 'path';

export function resolve(specifier, context, nextResolve) {
	if (specifier.startsWith('.') && !specifier.endsWith('.js')) {
		const basepath = path.dirname(new URL(context.parentURL).pathname);
		const filePath = path.resolve(basepath, specifier);

		try {
			const returnValue = fs.lstatSync(filePath + '.js');
			if (returnValue.isFile()) {
				return nextResolve(filePath + '.js', context);
			}

			return nextResolve(filePath + '/index.js', context);
		} catch (e) {
			return nextResolve(filePath + '/index.js', context);
		}
	}
	return nextResolve(specifier, context);
}
