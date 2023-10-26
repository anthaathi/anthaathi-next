import React from 'react';
import { DataSourceProvider } from '@anthaathi/components';

export default function AppDataSourceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DataSourceProvider dataSources={{}}>{children}</DataSourceProvider>;
}
