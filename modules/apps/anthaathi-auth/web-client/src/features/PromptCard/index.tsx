'use client';
import { useStyletron } from 'baseui';
import * as React from 'react';
import { HeadingMedium, ParagraphMedium } from 'baseui/typography';
import Image from 'next/image';

export interface SignInCardProps {
  children: React.ReactNode;
  companyName?: React.ReactNode;

  appName?: React.ReactNode;
  caption?: React.ReactNode;
  maxWidth?: string;
}

export default function PromptCard(props: SignInCardProps) {
  const [css, $theme] = useStyletron();

  return (
    <div
      className={css({
        minHeight: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        placeContent: 'center',
        [$theme.mediaQuery.medium]: {
          backgroundColor: '#EFEFEF',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      })}
      data-testid="sign-in-card"
    >
      <div
        className={css({
          width: '100%',
          height: '100%',
          paddingLeft: $theme.sizing.scale800,
          paddingRight: $theme.sizing.scale800,
          paddingBottom: $theme.sizing.scale1200,
          paddingTop: $theme.sizing.scale1200,
          backgroundColor: $theme.colors.backgroundPrimary,
          [$theme.mediaQuery.medium]: {
            maxWidth: props.maxWidth ?? '440px',
            boxShadow: $theme.lighting.shadow400,
            borderRadius: $theme.borders.buttonBorderRadius,
          },
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            placeContent: 'center',
            marginBottom: '12px',
          })}
        >
          <Image
            src="/icon.svg"
            width={644}
            className={css({
              maxWidth: '100px',
              height: 'auto',
            })}
            height={612}
            alt={(props.companyName as never) ?? ''}
          />
        </div>

        {props.appName && (
          <>
            <ParagraphMedium
              marginTop="scale200"
              marginBottom="scale0"
              $style={{
                color: $theme.colors.tabColor,
                fontWeight: 300,
                textAlign: 'center',
              }}
            >
              {props.caption}
            </ParagraphMedium>
            <HeadingMedium
              marginTop="scale200"
              marginBottom="scale1200"
              $style={{ textAlign: 'center' }}
            >
              {props.appName}
            </HeadingMedium>
          </>
        )}
        {props.children}
      </div>
    </div>
  );
}
