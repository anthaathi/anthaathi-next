import { SearchCustomer } from '@/features/Customer/SearchCustomer';
import { Button } from 'baseui/button';
import { FormattedMessage } from 'react-intl';
import { CustomerCreate } from '@/features/Customer/CustomerCreate';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { useStyletron } from 'baseui';
import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import { Suspense, useState } from 'react';

export interface SelectCustomerProps {
  onSelectCustomer: (customerId: string) => void;
}

export function SelectCustomer(props: SelectCustomerProps) {
  const [, $theme] = useStyletron();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SearchCustomer onSelectCustomer={props.onSelectCustomer} />

      <LabelXSmall
        $style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: $theme.sizing.scale600,
          paddingBottom: $theme.sizing.scale600,
          position: 'relative',
          zIndex: 1,
          ':before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: $theme.colors.borderOpaque,
          },
        }}
      >
        <FormattedMessage defaultMessage="OR" />
      </LabelXSmall>
      <Block
        display="flex"
        alignItems="center"
        paddingTop="scale600"
        paddingBottom="scale600"
      >
        <Modal
          size="auto"
          overrides={{
            Dialog: {
              style: {
                maxWidth: '700px',
              },
            },
          }}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <ModalHeader>
            <FormattedMessage defaultMessage="Create customer" />
          </ModalHeader>
          <ModalBody>
            <Suspense>
              <CustomerCreate
                onCustomerCreated={(value) => {
                  props.onSelectCustomer(value);
                  setIsOpen(false);
                }}
              />
            </Suspense>
          </ModalBody>
        </Modal>
        <Block
          display="flex"
          flexDirection="column"
          alignSelf="center"
          alignItems="center"
          width="100%"
        >
          <LabelXSmall marginBottom="scale300">
            <FormattedMessage defaultMessage="Could not found customer?" />
          </LabelXSmall>

          <Button
            size="compact"
            onClick={() => {
              setIsOpen(true);
            }}
            kind="secondary"
          >
            <FormattedMessage defaultMessage="Create customer" />
          </Button>
        </Block>
      </Block>
    </>
  );
}
