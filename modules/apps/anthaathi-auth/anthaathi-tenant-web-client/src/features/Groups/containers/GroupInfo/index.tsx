import { graphql, useFragment } from 'react-relay';
import { GroupInfo_groupInfo$key } from '../../../../../__generated__/GroupInfo_groupInfo.graphql';
import { UserList } from '@/features/Users/containers/UserList';
import { App_NodePageQuery$data } from '../../../../../__generated__/App_NodePageQuery.graphql';
import { HeadingXSmall } from 'baseui/typography';
import { FormattedMessage } from 'react-intl';
import { DetailViewerCard, FormDataViewer } from '@anthaathi/components';
import { Group } from '@carbon/icons-react';
import React from 'react';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';
import { MemberAdd } from '@/features/Groups/containers/MemberAdd';

export function GroupInfo(props: {
  $key: NonNullable<App_NodePageQuery$data>;
}) {
  const data = useFragment(
    graphql`
      fragment GroupInfo_groupInfo on Node {
        id
        ... on Group {
          name
          description
          data
          template {
            config
          }
        }
      }
    `,
    props.$key.node as GroupInfo_groupInfo$key,
  );

  const [css] = useStyletron();

  return (
    <>
      <DetailViewerCard
        $outlined
        titleIcon={<Group />}
        title="Group information"
      >
        <>
          <FormDataViewer
            data={data}
            schema={{
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: 'Name',
                },
                description: {
                  type: 'string',
                  format: 'text',
                  title: 'Description',
                },
                data: data.template?.config
                  ? data.template?.config
                  : {
                      type: 'object',
                      properties: {},
                    },
              },
            }}
          />
        </>
      </DetailViewerCard>

      <Block
        marginTop="scale600"
        marginBottom="scale600"
        alignContent="center"
        placeContent="center"
        paddingLeft="scale200"
        display="flex"
      >
        <HeadingXSmall marginTop="0" marginBottom="0">
          <FormattedMessage defaultMessage="Group members" />
        </HeadingXSmall>
        <span
          className={css({
            flexGrow: 1,
          })}
        />
        <MemberAdd />
      </Block>
      <UserList $key={props.$key} />
    </>
  );
}
