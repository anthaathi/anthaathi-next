import { FormData } from '../../FormBuilder/types';

/** @internal */
export function hasChanged(
	currentState: FormData,
	previousState: FormData,
	dependencies: string[]
) {
	return dependencies.some((key) => currentState[key] !== previousState[key]);
}
