import { useOrganizationId } from '@/hooks/use-organization-id';
import { useNavigate } from 'react-router-dom';

export const useAppNavigate = () => {
  const org = useOrganizationId();

  const navigate = useNavigate();

  return (path: string) => {
    navigate(`/o/${org}${path}`);
  };
};
