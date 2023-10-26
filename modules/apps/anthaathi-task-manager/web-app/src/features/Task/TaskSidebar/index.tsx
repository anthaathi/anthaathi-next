import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Close } from '@carbon/icons-react';
import { useRecoilState } from 'recoil';
import { taskSidebarAtom } from '@/features/Task/TaskSidebar/atom';
import { TaskDetails } from '@/features/Task/TaskDetails';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { NewTask } from '@/features/Task/NewTask';
import { sidebarAtom } from '@anthaathi/components';
import { FocusMe } from '@/features/Common/FocusMe';
import { useLocation } from 'react-router-dom';

export default function TaskSidebar() {
  const [css, $theme] = useStyletron();

  const [currentState, setCurrentState] = useRecoilState(taskSidebarAtom);
  const [, setIsOpenSidebar] = useRecoilState(sidebarAtom);

  const [state, setState] = useState(currentState);

  const key = useRef<number>();

  const router = useLocation();

  useEffect(() => {
    const mediaQueryList = window.matchMedia(
      $theme.mediaQuery.medium.replace('@media ', '')
    );

    if (!mediaQueryList.matches) {
      setIsOpenSidebar('close');
    }
  }, [router.pathname, setIsOpenSidebar, $theme.mediaQuery.medium]);

  const escFunction = useCallback(
    (event: any) => {
      const isPopover = document.activeElement?.closest(
        '[data-autofocus-inside="true"]'
      );
      const isModelOpen = document.activeElement?.closest(
        '[data-baseweb="modal"]'
      );
      const isPopoverOpen = document.activeElement?.closest(
        '[data-baseweb="popover"]'
      );
      const hasPopup = document.activeElement?.closest(
        '[aria-haspopup="listbox"]'
      );
      const isAppRoot = document.activeElement?.closest('#app-portal');

      if (
        event.key === 'Escape' &&
        !(isPopover || isModelOpen || isPopoverOpen || isAppRoot || hasPopup)
      ) {
        setCurrentState(null);
      }
    },
    [setCurrentState]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (key.current) {
      clearTimeout(key.current);
    }

    const isLargeDevice = window.matchMedia(
      `${$theme.mediaQuery.medium}`.replace('@media ', '')
    );

    if (!isLargeDevice.matches) {
      setIsOpenSidebar('close');
    }

    if (currentState) {
      setState(currentState);
    } else {
      key.current = setTimeout(() => {
        setState(currentState);
      }, 300);
    }
    // eslint-disable-next-line
  }, [currentState]);

  return (
    <>
      {currentState && (
        <div
          className={css({
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 50,
            opacity: 0.01,
            right: 0,
            backgroundColor: $theme.colors.backgroundPrimary,
          })}
          onClick={() => {
            setCurrentState(null);
          }}
          data-type="overlay"
        />
      )}

      <div
        className={css({
          position: 'fixed',
          bottom: 0,
          zIndex: 99,
          backgroundColor: $theme.colors.backgroundPrimary,
          width: '800px',
          maxWidth: '100%',
          top: '24px',
          borderTopLeftRadius: $theme.sizing.scale600,
          borderTopRightRadius: $theme.sizing.scale600,
          transition: 'transform .1s ease',
          transform: currentState ? 'translateY(0)' : 'translateY(100%)',
          [$theme.mediaQuery.medium]: {
            top: 0,
            right: 0,
            maxWidth: '100%',
            boxShadow: currentState ? $theme.lighting.shadow700 : 'none',
            borderTopRightRadius: $theme.sizing.scale0,
            borderBottomLeftRadius: $theme.sizing.scale600,
            transform: currentState ? 'translateX(0)' : 'translateX(100%)',
          },
        })}
      >
        <div
          className={css({
            position: 'relative',
            height: 'calc(100% - 24px)',
            overflow: 'auto',
            [$theme.mediaQuery.medium]: {
              padding: '24px',
            },
            padding: '12px',
          })}
        >
          <div
            className={css({
              position: 'sticky',
              top: 0,
              zIndex: 10000,
            })}
          >
            <Button
              size="mini"
              kind="secondary"
              onClick={() => {
                setCurrentState(null);
              }}
              overrides={{
                Root: {
                  style: {
                    right: '12px',
                    top: '12px',
                    position: 'absolute',
                    zIndex: 100,
                  },
                },
              }}
            >
              <Close size={24} />
            </Button>
          </div>
          {state?.startsWith('gid://Anthaathi/Task/') && (
            <>
              <Suspense>
                <FocusMe />
                <TaskDetails id={state} />
              </Suspense>
            </>
          )}

          {state?.startsWith('gid://Anthaathi/Action/CreateNewTask') && (
            <NewTask />
          )}
        </div>
      </div>
    </>
  );
}
