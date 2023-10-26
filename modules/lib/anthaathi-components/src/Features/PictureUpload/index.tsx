import { useStyletron } from 'baseui';
import React, { ChangeEventHandler, useId, useState } from 'react';
import { CloudUpload } from '@carbon/icons-react';
import { Badge } from 'baseui/badge';
import { Spinner } from 'baseui/spinner';
import { Button, KIND } from 'baseui/button';
import { DeleteAlt } from 'baseui/icon';

export interface PictureItem {
	pictureUrl: string;
	isLoading?: boolean;
	key: React.Key;
}

export interface PictureUploadProps {
	items: PictureItem[];
	onFileChange?: ChangeEventHandler<HTMLInputElement>;
	onItemRemove?: (index: number) => void;
}

export default function PictureUpload(props: PictureUploadProps) {
	const [css, $theme] = useStyletron();

	const id = useId();

	const firstGrid = '1 / 1 / 3 / 3';

	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	return (
		<div
			className={css({
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				gridTemplateRows: 'repeat(3, 1fr)',
				gap: '12px',
				maxWidth: '1200px',
			})}
		>
			{props.items.map((res, index) => {
				return (
					<div
						key={res.key}
						className={css({
							display: 'flex',
							alignItems: 'center',
							placeContent: 'center',
							height: 'auto',
							aspectRatio: '1/1',
							gridArea: index === 0 ? firstGrid : undefined,
							paddingLeft: $theme.sizing.scale400,
							paddingRight: $theme.sizing.scale400,
							paddingTop: $theme.sizing.scale400,
							paddingBottom: $theme.sizing.scale400,
							borderRadius: $theme.borders.radius400,
							border: `2px solid ${$theme.colors.contentInverseSecondary}`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
							width: 'calc(100% - 24px)',
							position: 'relative',
							cursor: 'pointer',
						})}
						onMouseOver={() => {
							setActiveIndex(index);
						}}
						onMouseOut={() => {
							setActiveIndex(null);
						}}
						style={{
							backgroundImage: `url(${res.pictureUrl})`,
						}}
					>
						{props.onItemRemove && (
							<div
								className={css({
									display: 'flex',
									position: 'absolute',
									top: 0,
									right: 0,
									left: 0,
									opacity: activeIndex === index ? 1 : 0,
									transitionDuration: '100ms',
									transitionProperty: 'opacity',
									transitionTimingFunction: 'ease',
								})}
							>
								<span className={css({ flexGrow: 1 })} />

								<Button kind={KIND.tertiary}>
									<DeleteAlt size={28} />
								</Button>
							</div>
						)}
						{res.isLoading && (
							<>
								<div
									className={css({
										position: 'absolute',
										top: 0,
										bottom: 0,
										right: 0,
										left: 0,
										backgroundColor: $theme.colors.backgroundTertiary,
										borderRadius: $theme.borders.radius400,
										opacity: '.3',
									})}
								/>
								<Spinner />
							</>
						)}
					</div>
				);
			})}
			{props.onFileChange && (
				<label
					htmlFor={id}
					className={css({
						gridArea: props.items.length === 0 ? firstGrid : undefined,
						display: 'flex',
						alignItems: 'center',
						placeContent: 'center',
						border: `2px dotted ${$theme.colors.contentInverseSecondary}`,
						textAlign: 'center',
						borderRadius: $theme.borders.radius400,
						cursor: 'pointer',
						flexDirection: 'column',
					})}
				>
					<CloudUpload size={32} />

					<div className={css({ height: '6px' })} />

					<Badge content="Add" />

					<input
						type="file"
						onChange={props.onFileChange}
						id={id}
						className={css({ visibility: 'hidden', display: 'none' })}
					/>
				</label>
			)}
		</div>
	);
}
