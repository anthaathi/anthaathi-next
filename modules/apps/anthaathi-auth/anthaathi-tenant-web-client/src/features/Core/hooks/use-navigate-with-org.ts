import { useNavigate, useParams } from 'react-router-dom';
import { To } from '@remix-run/router';
import { NavigateOptions } from 'react-router/dist/lib/context';

export function useNavigateWithOrg(): (
  to: To,
  options?: NavigateOptions,
) => void {
  const navigate = useNavigate();

  const { key } = useParams<{ key: string }>();

  return (to, options) => {
    if (typeof to === 'string') {
      to = `/o/${key}${to}`;
    } else {
      to.pathname = `/o/${key}${to.pathname}`;
    }

    return navigate(to, options);
  };
}
