import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader,} from 'baseui/modal';
import {useIntl} from 'react-intl';
import {useStyletron} from 'baseui';

export function DataTableColumnConfig() {
	const intl = useIntl();
	const [, $theme] = useStyletron();

	return (
		<Modal isOpen={true} size="auto">
			<ModalHeader $style={{ ...$theme.typography.LabelMedium }}>
				{intl.formatMessage({ defaultMessage: 'Columns' })}
			</ModalHeader>
			<ModalBody
				$style={{
					borderTopStyle: $theme.borders.border100.borderStyle,
					borderTopWidth: $theme.borders.border100.borderWidth,
					borderTopColor: $theme.borders.border100.borderColor,
					marginLeft: 0,
					marginRight: 0,
				}}
			>
			</ModalBody>
			<ModalFooter>
				<ModalButton size="compact">
					{intl.formatMessage({ defaultMessage: 'Cancel' })}
				</ModalButton>
				<ModalButton size="compact">
					{intl.formatMessage({ defaultMessage: 'Save' })}
				</ModalButton>
			</ModalFooter>
		</Modal>
	);
}
