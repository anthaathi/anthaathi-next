'use client';

import { useStyletron } from 'baseui';
import React from 'react';
import Image from 'next/image';
import { HeadingXSmall } from 'baseui/typography';
import { StyledLink } from 'baseui/link';
import Link from 'next/link';
import { StatefulPopover } from 'baseui/popover';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { FormattedMessage } from 'react-intl';
import { StatefulMenu } from 'baseui/menu';
import kratosClient from '@/utils/kratos-client';

export function Header({ title, icon }: { title: string; icon: string }) {
  const [css, $theme] = useStyletron();

  return (
    <header
      className={css({
        boxShadow: $theme.lighting.shadow500,
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        backgroundColor: $theme.colors.backgroundPrimary,
      })}
    >
      <div
        className={css({
          maxWidth: 'calc(1200px - 58px)',
          margin: '0 auto',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        })}
      >
        <Image src={icon} width={34} height={34} alt="Logo" />
        <span className={css({ width: '20px' })} />
        <HeadingXSmall>{title}</HeadingXSmall>

        <span
          className={css({
            flexGrow: 1,
          })}
        />
        <StatefulPopover
          placement="bottomRight"
          content={({ close }) => (
            <Block>
              <StatefulMenu
                overrides={{
                  List: {
                    style: {
                      width: '220px',
                    },
                  },
                }}
                onItemSelect={({ item }) => {
                  switch (item.key) {
                    case 'logout':
                      kratosClient.createBrowserLogoutFlow({}).then((docs) => {
                        window.location.href = docs.data.logout_url;
                      });
                      close();
                  }
                }}
                items={[
                  {
                    label: (
                      <FormattedMessage defaultMessage="Logout" id="C81/uG" />
                    ),
                    key: 'logout',
                  },
                ]}
              />
            </Block>
          )}
          returnFocus
          autoFocus
        >
          <Button
            kind="secondary"
            size="compact"
            shape="pill"
            startEnhancer={
              <svg
                id="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 32 32"
              >
                <path d="M16,8a5,5,0,1,0,5,5A5,5,0,0,0,16,8Zm0,8a3,3,0,1,1,3-3A3.0034,3.0034,0,0,1,16,16Z" />
                <path d="M16,2A14,14,0,1,0,30,16,14.0158,14.0158,0,0,0,16,2ZM10,26.3765V25a3.0033,3.0033,0,0,1,3-3h6a3.0033,3.0033,0,0,1,3,3v1.3765a11.8989,11.8989,0,0,1-12,0Zm13.9925-1.4507A5.0016,5.0016,0,0,0,19,20H13a5.0016,5.0016,0,0,0-4.9925,4.9258,12,12,0,1,1,15.985,0Z" />
                <rect
                  id="_Transparent_Rectangle_"
                  data-name="&lt;Transparent Rectangle&gt;"
                  className={css({
                    fill: 'none',
                  })}
                  width="32"
                  height="32"
                />
              </svg>
            }
          >
            <FormattedMessage defaultMessage="My account" id="dXSivY" />
          </Button>
        </StatefulPopover>
      </div>
    </header>
  );
}
