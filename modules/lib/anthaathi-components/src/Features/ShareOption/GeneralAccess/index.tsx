import { CaretDown } from '@carbon/icons-react';
import { styled, useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import React from 'react';

export default function GeneralAccess({ menuItems, subTitle }) {
	const [css, $theme] = useStyletron();
	const [selectedItem, setSelectedItem] = React.useState(menuItems[0]);
	const [showComponent, setShowComponent] = React.useState(false);
	const [showPopup, setShowPopup] = React.useState(false);

	const handleItemClick = (index) => {
		setShowComponent(index === 1);
		setShowPopup(!showPopup);
		setTimeout(() => {
			setShowPopup(false);
		}, 1200);
	};

	return (
		<div>
			<div
				className={css({
					...$theme.typography.LabelMedium,
					paddingTop: $theme.sizing.scale600,
					paddingBottom: $theme.sizing.scale600,
				})}
			>
				{subTitle}
			</div>
			<div
				className={css({
					display: 'flex',
					justifyContent: 'space-between',
					marginTop: $theme.sizing.scale500,
				})}
			>
				<div
					className={css({
						display: 'flex',
					})}
				>
					<Button kind="secondary" shape="circle" size="compact">
						{selectedItem && selectedItem.icon}
					</Button>

					<div
						className={css({
							display: 'flex',
							flexDirection: 'column',
							marginLeft: $theme.sizing.scale300,
						})}
					>
						<StatefulPopover
							popoverMargin={0}
							placement="bottomLeft"
							content={({ close }) =>
								menuItems.map((item, index) => (
									<List
										key={index}
										onClick={() => {
											handleItemClick(index);
											setSelectedItem(item);
											close();
										}}
									>
										{item.label}
									</List>
								))
							}
							accessibilityType={'menu'}
						>
							<div>
								<Button
									endEnhancer={<CaretDown />}
									size="mini"
									kind="secondary"
								>
									{selectedItem && selectedItem.label}
								</Button>
							</div>
						</StatefulPopover>
						<p
							className={css({
								marginTop: 0,
								marginBottom: 0,
							})}
						>
							{selectedItem && selectedItem.content}
						</p>
					</div>
				</div>
				{showComponent && (
					<AnotherPopOver
						popoverItems={[
							{
								id: 1,
								title: 'Viewer',
							},
							{
								id: 2,
								title: 'Commenter',
							},
							{
								id: 3,
								title: 'Editer',
							},
						]}
					/>
				)}
			</div>
			{showPopup && (
				<Toast>
					<p>Access Updated</p>
				</Toast>
			)}
		</div>
	);
}

const AnotherPopOver = ({ popoverItems }) => {
	const [css, $theme] = useStyletron();
	const [isPopoverOpen, setIsPopoverOpen] = React.useState(popoverItems[0]);
	return (
		<div
			className={css({
				display: 'flex',
				alignItems: 'center',
				marginLeft: $theme.sizing.scale300,
			})}
		>
			<StatefulPopover
				popoverMargin={0}
				placement="bottomLeft"
				content={({ close }) =>
					popoverItems.map((item, index) => (
						<List
							onClick={() => {
								setIsPopoverOpen(item);
								close();
							}}
							key={index}
						>
							{item.title}
						</List>
					))
				}
				accessibilityType={'menu'}
			>
				<div>
					<Button
						onClick={() => {}}
						endEnhancer={<CaretDown />}
						size="mini"
						kind="tertiary"
					>
						{isPopoverOpen && isPopoverOpen.title}
					</Button>
				</div>
			</StatefulPopover>
		</div>
	);
};

const List = styled('div', ({ $theme }) => ({
	...$theme.typography.LabelSmall,
	width: '200px',
	paddingLeft: $theme.sizing.scale600,
	paddingRight: $theme.sizing.scale200,
	paddingTop: $theme.sizing.scale500,
	paddingBottom: $theme.sizing.scale600,
	backgroundColor: '#fff',
}));

const Toast = styled('div', ({ $theme }) => ({
	...$theme.typography.LabelMedium,
	width: '180px',
	position: 'absolute',
	bottom: '5%',
	left: '30%',
	backgroundColor: $theme.colors.contentSecondary,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '45px',
	color: '#fff',
}));
