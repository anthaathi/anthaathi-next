import { useStyletron } from 'baseui';
import { createPortal } from 'react-dom';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LabelMedium, LabelXSmall } from 'baseui/typography';
import { Input } from 'baseui/input';
import {
  fetchQuery,
  graphql,
  useFragment,
  useRelayEnvironment,
} from 'react-relay';
import { useOrganizationContext } from '@/hooks/use-organization-id';
import {
  UserSelectorPopupQuery,
  UserSelectorPopupQuery$data,
} from '../../../../__generated__/UserSelectorPopupQuery.graphql';
import { UserSelectorPopupFragment$key } from '../../../../__generated__/UserSelectorPopupFragment.graphql';
import { Badge } from 'baseui/badge';
import { Spinner } from 'baseui/spinner';
import { StyledLink } from 'baseui/link';
import { useSession } from '@anthaathi/components';

export interface UserSelectorPopupProps {
  x: number;
  y: number;

  onClose: (userId?: string) => void;
  isLoading: boolean;
}

export function UserSelectorPopup({
  onClose,
  ...props
}: UserSelectorPopupProps) {
  const [css, $theme] = useStyletron();

  const id = useId();

  const element = useRef<HTMLDivElement | null>(null);

  const updateView = useReducer((x: number) => x + 1, 0)[1];

  useEffect(() => {
    function createElement() {
      if (typeof window === 'undefined') {
        return null;
      }

      let rootElement: HTMLDivElement | null = document.getElementById(
        'app-portal'
      ) as HTMLDivElement;

      if (!rootElement) {
        rootElement = document.createElement('div');
        rootElement.setAttribute('id', 'app-portal');
        document.body.appendChild(rootElement);
      }

      const div = document.createElement('div');

      div.setAttribute('id', id);
      rootElement.appendChild(div);

      return div;
    }

    element.current = createElement();
    updateView();

    return () => {
      if (element.current) {
        element.current.remove();
      }
    };
  }, [id, updateView]);

  const x =
    props.x + 320 > window.innerWidth ? window.innerWidth - 340 : props.x;
  const y =
    props.y + 320 > window.innerHeight ? window.innerHeight - 340 : props.y;

  const [value, setValue] = useState('');

  const intl = useIntl();

  const env = useRelayEnvironment();

  const org = useOrganizationContext();

  const searchUsers = useCallback(
    async (search: string) => {
      return fetchQuery<UserSelectorPopupQuery>(
        env,
        graphql`
          query UserSelectorPopupQuery($query: String!, $organizationId: ID!) {
            searchUser(query: $query, organizationId: $organizationId) {
              edges {
                node {
                  id
                  ...UserSelectorPopupFragment
                }
              }
            }
          }
        `,
        { query: search, organizationId: org?.organizationByKey?.id! },
        {
          fetchPolicy: 'store-or-network',
        }
      ).toPromise();
    },
    [env, org?.organizationByKey?.id]
  );

  const [result, setResult] = useState<UserSelectorPopupQuery$data | undefined>(
    undefined
  );

  const session = useSession();

  // Call when escape key is pressed
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!element.current) {
    return null;
  }

  return createPortal(
    <>
      <div
        className={css({
          position: 'fixed',
          top: y + 'px',
          left: x + 'px',
          zIndex: 1000,
          padding: '6px 0',
          backgroundColor: 'white',
          width: '320px',
          boxShadow: $theme.lighting.shadow400,
          borderRadius: $theme.borders.radius300,
        })}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={css({
            position: 'relative',
          })}
        >
          {props.isLoading && (
            <div
              className={css({
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `rgba(255, 255, 255, 0.1)`,
                cursor: 'wait',
              })}
            >
              <Spinner />
            </div>
          )}

          <div
            className={css({
              paddingLeft: $theme.sizing.scale500,
              paddingRight: $theme.sizing.scale500,
              paddingTop: $theme.sizing.scale0,
              width: `calc(100% - ${$theme.sizing.scale500} - ${$theme.sizing.scale500})`,
            })}
          >
            <LabelMedium marginTop="scale100" marginBottom="scale400">
              <FormattedMessage defaultMessage="Select user" />
            </LabelMedium>

            <Input
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                searchUsers(e.target.value).then((result) => {
                  if (result) {
                    setResult(result);
                  }
                });
              }}
              placeholder={intl.formatMessage({
                defaultMessage: 'Type to search user',
              })}
              size="compact"
            />
          </div>

          <ul
            className={css({
              listStyle: 'none',
              paddingLeft: $theme.sizing.scale0,
              paddingTop: $theme.sizing.scale0,
              paddingBottom: $theme.sizing.scale0,
              marginTop: $theme.sizing.scale0,
              marginBottom: $theme.sizing.scale0,
            })}
          >
            <StyledLink
              href="#"
              onClick={() => {
                onClose('gid://Anthaathi/UserCore/' + session?.identity.id);
              }}
              $style={{
                paddingLeft: $theme.sizing.scale500,
                paddingRight: $theme.sizing.scale500,
              }}
            >
              <FormattedMessage defaultMessage="Assign to me" />
            </StyledLink>
            {result?.searchUser?.edges?.map((edge) => {
              return (
                <User
                  key={edge?.node?.id}
                  onSelect={(userId) => {
                    onClose(userId);
                  }}
                  user={edge?.node!}
                />
              );
            })}
          </ul>
        </div>
      </div>

      <div
        className={css({
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        })}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
    </>,
    element.current
  );
}

export interface UserProps {
  user: UserSelectorPopupFragment$key;
  onSelect: (userId: string) => void;
}

const User = (props: UserProps) => {
  const [css, $theme] = useStyletron();

  const result = useFragment(
    graphql`
      fragment UserSelectorPopupFragment on UserCore {
        id
        firstName
        lastName
        email {
          email
        }
      }
    `,
    props.user
  );

  return (
    <li
      tabIndex={0}
      className={css({
        display: 'flex',
        alignItems: 'center',
        padding: $theme.sizing.scale400,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background-color 0.1s ease-in-out',
        ':hover': {
          backgroundColor: $theme.colors.mono200,
        },
      })}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          props.onSelect(result.id);
        }
      }}
      onClick={() => {
        props.onSelect(result.id);
      }}
    >
      <div
        className={css({
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: $theme.colors.primary200,
          marginRight: $theme.sizing.scale200,
        })}
      />
      <div
        className={css({
          marginLeft: $theme.sizing.scale200,
        })}
      >
        <LabelMedium marginBottom="scale100" marginTop="scale0">
          {result.firstName} {result.lastName}
        </LabelMedium>
        <LabelXSmall>
          {result.email.map((res) => (
            <Fragment key={res.email}>
              <Badge content={res.email} />
            </Fragment>
          ))}
        </LabelXSmall>
      </div>
    </li>
  );
};
