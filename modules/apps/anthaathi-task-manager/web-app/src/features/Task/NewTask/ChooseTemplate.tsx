import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { ChooseTemplateQuery } from '../../../../__generated__/ChooseTemplateQuery.graphql';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import { ChooseTemplate_organizationTemplate$key } from '../../../../__generated__/ChooseTemplate_organizationTemplate.graphql';
import { BadgeList, BadgeListItem, BadgeSize } from '@anthaathi/components';
import React from 'react';
import { Plus } from 'baseui/icon';
import { useStyletron } from 'baseui';

export interface ChooseTemplateProps {
  onSelectTemplate: (templateId: string) => void;
}

export function ChooseTemplate(props: ChooseTemplateProps) {
  const organizationId = useOrganizationContext();

  const chooseTemplateQuery = useLazyLoadQuery<ChooseTemplateQuery>(
    graphql`
      query ChooseTemplateQuery($organization: ID!) {
        ...ChooseTemplate_organizationTemplate
          @arguments(organization: $organization)
      }
    `,
    {
      organization: organizationId?.organizationByKey?.id!,
    }
  );

  const { data: organizationTemplate } = usePaginationFragment(
    graphql`
      fragment ChooseTemplate_organizationTemplate on Query
      @refetchable(queryName: "ChooseTemplatePaginationQuery")
      @argumentDefinitions(
        after: { type: "String" }
        first: { type: "Int" }
        organization: { type: "ID!" }
      ) {
        taskTemplates(
          organization: $organization
          first: $first
          after: $after
        ) @connection(key: "TaskTemplates_taskTemplates") {
          edges {
            node {
              id
              name
              description
            }
          }
        }
      }
    `,
    chooseTemplateQuery as ChooseTemplate_organizationTemplate$key
  );

	const [, $theme] = useStyletron();

  return (
    <BadgeList $size={BadgeSize.SMALL}>
      {organizationTemplate.taskTemplates.edges.map((res, index) => (
        <BadgeListItem
					color={$theme.colors.positive300}
          key={res?.node.id ?? index}
          title={res?.node.name}
          onClick={() => {
            props.onSelectTemplate(res?.node.id ?? '');
          }}
        >
          <Plus size={32} />
        </BadgeListItem>
      ))}
    </BadgeList>
  );
}
