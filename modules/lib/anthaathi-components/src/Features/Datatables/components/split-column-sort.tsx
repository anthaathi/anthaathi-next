import { useStyletron } from 'baseui';

export function SplitColumnSort() {
	const [css] = useStyletron();

	return (
		<div
			className={css({
				display: 'flex',
			})}
		>
			<div
				className={css({
					width: '50%',
				})}
			>
				Hello world
			</div>

			<div></div>
		</div>
	);
}
