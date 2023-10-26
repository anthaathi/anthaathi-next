import { useRecoilState } from 'recoil';
import { taskSidebarAtom } from '../TaskSidebar/atom';
import { Button } from 'baseui/button';
import { FormattedMessage } from 'react-intl';
import { Add } from '@carbon/icons-react';
import { useStyletron } from 'styletron-react';

export function NewTaskButton() {
  const [, setTaskSidebar] = useRecoilState(taskSidebarAtom);
  const [css] = useStyletron();

  return (
    <>
      <div
        className={css({
          bottom: '12px',
          right: '12px',
          position: 'fixed',
          zIndex: 3,
        })}
      >
        <Button
          startEnhancer={<Add />}
          onClick={() => {
            setTaskSidebar('gid://Anthaathi/Action/CreateNewTask');
          }}
        >
          <FormattedMessage defaultMessage="New Task" />
        </Button>
      </div>
    </>
  );
}
