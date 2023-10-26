import React, { Suspense, useState } from 'react';
import { ChooseTemplate } from '@/features/Task/NewTask/ChooseTemplate';
import { HeadingSmall } from 'baseui/typography';
import { FormattedMessage } from 'react-intl';
import { SelectCustomer } from '@/features/Customer/SelectCustomer';
import { graphql, useMutation } from 'react-relay';
import { NewTaskMutation } from '../../../../__generated__/NewTaskMutation.graphql';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { useRecoilState } from 'recoil';
import { taskSidebarAtom } from '@/features/Task/TaskSidebar/atom';

export function NewTask() {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<string | null>(null);

  const organization = useOrganizationContext();

  const [createTask, ] = useMutation<NewTaskMutation>(graphql`
    mutation NewTaskMutation($input: CreateTaskInput!) {
      createTask(input: $input) {
        task {
          id
					title
					description
        }
      }
    }
  `);

  const [, setState] = useRecoilState(taskSidebarAtom);

  return (
    <Suspense>
      {step === 0 && (
        <>
          <HeadingSmall marginTop="scale300" marginBottom="scale800">
            <FormattedMessage defaultMessage="Select task type" />
          </HeadingSmall>
          <ChooseTemplate
            onSelectTemplate={(data) => {
              setStep(1);
              setTemplate(data);
            }}
          />
        </>
      )}

      {step === 1 && template && (
        <>
          <HeadingSmall marginTop="scale0" marginBottom="scale600">
            <FormattedMessage defaultMessage="Select customer" />
          </HeadingSmall>
          <SelectCustomer
            onSelectCustomer={(customerId) => {
              createTask({
                variables: {
                  input: {
                    customer: customerId,
                    description: 'Created',
                    templateId: template,
                    title:
                      'Created from template at ' + new Date().toISOString(),
                    organizationId: organization?.organizationByKey?.id!,
                  },
                },
                onCompleted: (response, errors) => {
                  if (errors) {
                    console.log(errors);
                    return;
                  }

                  setState(response.createTask.task.id);
                },
              });
            }}
          />
        </>
      )}
    </Suspense>
  );
}
