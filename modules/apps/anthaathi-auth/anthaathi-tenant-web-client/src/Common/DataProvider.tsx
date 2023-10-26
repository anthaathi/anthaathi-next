import { DataSourceProvider } from '@anthaathi/components';
import React, { useCallback } from 'react';
import { GlobalUserDataSource } from '@anthaathi/components/types/Features/Datasource';

export function AppDataProvider(props: { children: React.ReactNode }) {
  const user: GlobalUserDataSource = useCallback(
    async (values, currentInputState) => {
      return [];
    },
    [],
  );

  return (
    <DataSourceProvider
      dataSources={{
        user,
      }}
    >
      {props.children}
    </DataSourceProvider>
  );
}
