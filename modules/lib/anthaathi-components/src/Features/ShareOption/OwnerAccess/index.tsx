import { useStyletron } from 'baseui';
import { Avatar } from 'baseui/avatar';

export default function OwnerAccess(props) {
	const [css, $theme] = useStyletron();
	return (
		<div>
			<div
				className={css({
					...$theme.typography.LabelMedium,
					paddingTop: $theme.sizing.scale600,
					paddingBottom: $theme.sizing.scale600,
				})}
			>
				{props.subTitle}
			</div>
			<div
				className={css({
					width: '100%',
					display: 'flex',
					marginBottom: $theme.sizing.scale600,
				})}
			>
				<Avatar
					name={`user`}
					size="scale1000"
					src="https://not-a-real-image.png"
				/>
				<div
					className={css({
						display: 'flex',
						flexDirection: 'column',
						marginLeft: $theme.sizing.scale300,
					})}
				>
					<p
						className={css({
							marginTop: 0,
							marginBottom: 0,
						})}
					>
						{props.name}
					</p>
					<p
						className={css({
							marginTop: 0,
							marginBottom: 0,
						})}
					>
						{props.email}
					</p>
				</div>
				<div
					className={css({
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						width: '100%',
					})}
				>
					{props.isOwner}
				</div>
			</div>
		</div>
	);
}
