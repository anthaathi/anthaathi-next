import { graphql, useFragment } from 'react-relay';
import { OrganizationCard_index$key } from '../../../../../__generated__/OrganizationCard_index.graphql';
import { useStyletron } from 'baseui';
import { expandBorderStyles } from 'baseui/styles';

export function OrganizationCard({
  $key,
}: {
  $key: OrganizationCard_index$key;
}) {
  const data = useFragment(
    graphql`
      fragment OrganizationCard_index on Organization {
        id
        iid
        key
        name
        description
        data
      }
    `,
    $key,
  );

  const [css, $theme] = useStyletron();

  return (
    <div
      className={css({
        borderRadius: '10px',
        padding: $theme.sizing.scale700,
        ...expandBorderStyles($theme.borders.border300),
        cursor: 'pointer',
        ':hover': {
          boxShadow: $theme.lighting.shadow400,
        },
      })}
    >
      {data.name}
    </div>
  );
}
