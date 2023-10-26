import { useParams } from 'react-router-dom';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { createContext, useContext } from 'react';
import {
  useOrganizationIdInfoQuery,
  useOrganizationIdInfoQuery$data,
} from '../../__generated__/useOrganizationIdInfoQuery.graphql';

/**
 * Returns the organization id from the URL.
 */
export const useOrganizationId = () => useParams()['orgId'];

export const useOrganizationInfo = () => {
  const organizationId = useOrganizationId();

  return useLazyLoadQuery<useOrganizationIdInfoQuery>(
    graphql`
      query useOrganizationIdInfoQuery($key: String!) {
        organizationByKey(key: $key) {
          id
					key
          name
        }
      }
    `,
    {
      key: organizationId!,
    }
  );
};

export const OrganizationContext =
  createContext<useOrganizationIdInfoQuery$data | null>(null);

export const useOrganizationContext = () => {
  return useContext(OrganizationContext);
};
