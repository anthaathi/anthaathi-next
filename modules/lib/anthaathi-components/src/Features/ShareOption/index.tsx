import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import { Select, Value } from 'baseui/select';
import { EarthFilled, Locked } from '@carbon/icons-react';
import React from 'react';
import { Avatar } from 'baseui/avatar';
import GeneralAccess from './GeneralAccess';
import OwnerAccess from './OwnerAccess';

export interface ShareOptions<option, button> {
	title?: string;
	subTitle: string;
	name?: string;
	email?: string;
	isOwner?: string;
	options?: option[];
	buttons?: button[];
}

export function ShareOption<
	option extends { id: string },
	button extends { name: string }
>(props: ShareOptions<option, button>) {
	const [css, $theme] = useStyletron();
	const [isOpen, setIsOpen] = React.useState(false);
	const [value, setValue] = React.useState<Value>([]);

	return (
		<div
			className={css({
				width: `calc(100%-${$theme.sizing.scale1000})`,
				position: 'relative',
			})}
		>
			<Button kind="secondary" onClick={() => setIsOpen(() => !isOpen)}>
				Share
			</Button>
			<Modal
				overrides={{
					Close: {
						style: {
							display: 'none',
						},
					},
				}}
				isOpen={isOpen}
			>
				<ModalHeader>Share "{props.title}"</ModalHeader>
				<ModalBody>
					<Select
						options={props.options}
						labelKey="id"
						valueKey="color"
						onChange={(options) => setValue(options.value)}
						value={value}
						getOptionLabel={getLabel}
						getValueLabel={getLabel}
						placeholder="Add people and groups"
					/>
					<OwnerAccess
						subTitle="People with access"
						email="email"
						name="name"
						isOwner="Owner"
					/>

					<GeneralAccess
						subTitle="General access"
						menuItems={[
							{
								id: 1,
								label: 'Restricted',
								content: 'Only people with access can open with the link',
								icon: <Locked />,
							},
							{
								id: 2,
								label: 'Anyone with the link',
								content: 'Anyone on the internet with the link can view',
								icon: <EarthFilled />,
							},
						]}
					/>

					<div
						className={css({
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							paddingTop: $theme.sizing.scale900,
						})}
					>
						{props.buttons?.map((button) => (
							<Button
								onClick={() => {
									setIsOpen(false);
								}}
							>
								{button.name}
							</Button>
						))}
					</div>
				</ModalBody>
			</Modal>
		</div>
	);
}

const getLabel = ({ option }: any) => {
	return (
		<React.Fragment>
			<Avtar />
			{option.id}
		</React.Fragment>
	);
};

const Avtar = () => {
	const [css, $theme] = useStyletron();
	return (
		<div
			className={css({
				marginRight: $theme.sizing.scale200,
				display: 'inline-block',
			})}
		>
			<Avatar
				name={`user`}
				size="scale1000"
				src="https://not-a-real-image.png"
			/>
		</div>
	);
};
