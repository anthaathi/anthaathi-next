import { FormattedMessage } from 'react-intl';
import { useEffect, useRef } from 'react';
import { useStyletron } from 'baseui';

export function FocusMe() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const [css] = useStyletron();

  return (
    <a
      ref={ref}
      href="#top"
      onClick={(e) => {
        e.preventDefault();
      }}
      className={css({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      })}
    >
      <FormattedMessage defaultMessage="Modal" />
    </a>
  );
}
