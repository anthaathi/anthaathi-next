import { CustomerGroupInfoCard } from '@/features/Customer/CustomerGroupInfoCard';
import { useOutletContext } from 'react-router-dom';
import { CustomerGroupInfoQuery$data } from '../../../__generated__/CustomerGroupInfoQuery.graphql';
import { graphql, useFragment } from 'react-relay';
import { useStyletron } from 'baseui';
import { CustomerKPI } from '@/features/Customer/CustomerKPI';
import { Block } from 'baseui/block';
import { TaskList } from '@/features/Task/TaskList';

export default function CustomerGroupInfoTabOverview() {
  const context = useOutletContext<CustomerGroupInfoQuery$data>();

  const overview = useFragment(
    graphql`
      fragment CustomerGroupInfoTabOverviewQuery on CustomerGroup {
        id
      }
    `,
    context.node!
  );

	console.log(overview);

	const [css, $theme] = useStyletron();

  return (
    <Block
      display="flex"
      flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
      maxWidth="1420px"
      $style={{
        gap: '12px',
      }}
    >
      <div
        className={css({
          flexGrow: 1,
        })}
      >
        <CustomerKPI />

        <Block paddingBottom="scale800" />

        <TaskList $key={context} />
      </div>

      <div
        className={css({
          width: '100%',
					minWidth: '100%',
					maxWidth: '100%',
					[$theme.mediaQuery.large]: {
						width: '30%',
						minWidth: '400px',
						maxWidth: '400px',
					},
        })}
      >
        <CustomerGroupInfoCard $key={context.node!} />
      </div>
    </Block>
  );
}
