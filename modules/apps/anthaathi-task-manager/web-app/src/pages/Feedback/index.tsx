import { graphql, useLazyLoadQuery, useMutation } from 'react-relay';
import { useParams } from 'react-router-dom';
import { FormBuilderV2 } from '@anthaathi/components';
import { FeedbackQuery } from '../../../__generated__/FeedbackQuery.graphql';
import { Block } from 'baseui/block';
import { FeedbackMutation } from '../../../__generated__/FeedbackMutation.graphql';
import { useSnackbar } from 'baseui/snackbar';
import { FormattedMessage, useIntl } from 'react-intl';
import { HeadingMedium } from 'baseui/typography';

export default function Feedback() {
  const params = useParams();

  const query = useLazyLoadQuery<FeedbackQuery>(
    graphql`
      query FeedbackQuery($id: ID!) {
        node(id: $id) {
          id
          ... on TaskFeedback {
            id
            config
          }
        }
      }
    `,
    {
      id: 'gid://Anthaathi/TaskFeedback/' + params.id,
    }
  );

  const [submitFeedback, isLoading] = useMutation<FeedbackMutation>(graphql`
    mutation FeedbackMutation($input: CreateTaskFeedbackInput!) {
      createTaskFeedback(input: $input) {
        success
      }
    }
  `);

  const snackbar = useSnackbar();

  const intl = useIntl();

  if (!query.node) {
    return (
      <HeadingMedium
        margin="auto"
        padding="scale1600"
        $style={{
          textAlign: 'center',
        }}
      >
        <FormattedMessage defaultMessage="Link is expired or does not exists. Please check the link or contact the administration." />
        <br />
        <FormattedMessage defaultMessage="Thank you!" />
      </HeadingMedium>
    );
  }

  return (
    <Block maxWidth="600px" margin="12px auto">
      {query.node?.config && (
        <FormBuilderV2
          schema={query.node.config}
          isLoading={isLoading}
          onSubmit={(e) => {
            submitFeedback({
              variables: {
                input: {
                  feedbackId: query.node?.id!,
                  data: e,
                },
              },
              onCompleted: (response, errors) => {
                if (errors) {
                  console.error(errors);
                } else {
                  snackbar.enqueue({
                    message: intl.formatMessage({
                      defaultMessage: 'Thanks for your feedback!',
                    }),
                  });
                }
              },
            });
          }}
        />
      )}
    </Block>
  );
}
