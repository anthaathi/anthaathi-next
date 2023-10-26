import { graphql, usePaginationFragment } from 'react-relay';
import { TaskTemplateSelector_taskTemplates$key } from '../../../../__generated__/TaskTemplateSelector_taskTemplates.graphql';
import React, { useId, useLayoutEffect, useMemo, useState } from 'react';
import { ButtonGroup } from 'baseui/button-group';
import { Button } from 'baseui/button';
import { LabelSmall } from 'baseui/typography';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { useStyletron } from 'baseui';

export interface TaskTemplateSelectorProps {
  $key: TaskTemplateSelector_taskTemplates$key;
}

export function TaskTemplateSelector(props: TaskTemplateSelectorProps) {
  const taskTemplates = usePaginationFragment(
    graphql`
      fragment TaskTemplateSelector_taskTemplates on Query
      @refetchable(queryName: "TaskTemplateSelectorPaginationQuery")
      @argumentDefinitions(
        after: { type: "String" }
        first: { type: "Int" }
        organization: { type: "ID!" }
      ) {
        taskTemplates(
          organization: $organization
          after: $after
          first: $first
        ) @connection(key: "TaskTemplateSelector_taskTemplates") {
          edges {
            node {
              id
              iid
              key
              name
              description
            }
          }
        }
      }
    `,
    props.$key,
  );

  const intl = useIntl();

  const [searchParams, setSearchParams] = useSearchParams();

  const template = useMemo(() => {
    return searchParams.getAll('template');
  }, [searchParams]);

  const templateKey = useMemo(() => {
    return searchParams.getAll('key');
  }, [searchParams]);

  const mapping = useMemo(() => {
    const returnValue: Record<string, number> = {};

    taskTemplates.data.taskTemplates.edges.forEach((res, index) => {
      // @ts-ignore
      returnValue[res.node.iid] = index;
    });

    return returnValue;
  }, [taskTemplates.data.taskTemplates.edges]);

  const mappingForKey = useMemo(() => {
    const returnValue: Record<string, number> = {};

    taskTemplates.data.taskTemplates.edges.forEach((res, index) => {
      // @ts-ignore
      returnValue[res.node.key] = index;
    });

    return returnValue;
  }, [taskTemplates.data.taskTemplates.edges]);

  const [css] = useStyletron();

  const id = useId();

  const [shouldRenderLeftGradient, setShouldRenderLeftGradient] =
    useState(false);
  const [shouldRenderRightGradient, setShouldRenderRightGradient] =
    useState(false);

  useLayoutEffect(() => {
    const divElement: HTMLDivElement | null = document.getElementById(
      id,
    ) as HTMLDivElement;

    if (!divElement) {
      return;
    }

    const onUpdate = (event: Event) => {
      const target = event.target as HTMLDivElement;

      setShouldRenderLeftGradient(target.scrollLeft > 12);
      setShouldRenderRightGradient(
        target.scrollLeft + target.clientWidth < target.scrollWidth - 12,
      );
    };

    onUpdate({ target: divElement } as any);

    divElement.addEventListener('scroll', onUpdate, false);
    return () => {
      divElement.removeEventListener('scroll', onUpdate, false);
    };
  }, [id]);

  return (
    <>
      <LabelSmall marginBottom="scale400">
        {intl.formatMessage({ defaultMessage: 'Select task type' })}
      </LabelSmall>
      <div
        className={css({
          position: 'relative',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            top: '0',
            opacity: shouldRenderLeftGradient ? 1 : 0,
            left: '-2px',
            bottom: 0,
            transition: 'opacity 0.2s ease-in-out',
            width: '64px',
            userSelect: 'none',
            pointerEvents: 'none',
            background:
              'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 100%)',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            top: '0',
            userSelect: 'none',
            pointerEvents: 'none',
            opacity: shouldRenderRightGradient ? 1 : 0,
            right: '-2px',
            transition: 'opacity 0.2s ease-in-out',
            bottom: 0,
            width: '64px',
            background:
              'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 100%)',
          })}
        />
        <ButtonGroup
          mode="checkbox"
          size="compact"
          overrides={{
            Root: {
              props: {
                id: id,
              },
              style: {
                gap: '6px',
                overflow: 'auto',
              },
            },
          }}
          selected={
            template.length === 0
              ? templateKey.length === 0
                ? [0]
                : templateKey.map((temp) => mappingForKey[temp] + 1)
              : template.map((temp) => mapping[temp] + 1)
          }
        >
          <Button
            shape="pill"
            key="all"
            onClick={() => {
              setSearchParams((prev) => {
                prev.delete('template');
                prev.delete('key');

                return prev;
              });
            }}
          >
            <FormattedMessage defaultMessage="All" />
          </Button>

          {taskTemplates.data.taskTemplates.edges.map((res, index) => (
            <Button
              shape="pill"
              overrides={{
                BaseButton: {
                  style: {
                    width: 'max-content',
                    whiteSpace: 'nowrap',
                  },
                },
              }}
              onClick={() => {
                setSearchParams((prev) => {
                  const prevTemplate = prev.getAll('template');

                  if (!prevTemplate.includes(res?.node.iid?.toString()!)) {
                    prev.append('template', res?.node.iid?.toString()!);
                  } else {
                    prev.delete('template');

                    prevTemplate
                      .filter((temp) => temp !== res?.node.iid?.toString()!)
                      .forEach((e) => {
                        prev.append('template', e);
                      });
                  }

                  return prev;
                });
              }}
              key={res?.node.iid.toString() ?? index}
            >
              {res?.node.name}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </>
  );
}
