import { AxiosError, isAxiosError } from 'axios';
import { ErrorHandler } from '@/containers/ErrorHandler';
import { config } from '@anthaathi-internal/config';

export function ErrorRenderer({
  error,
  companyName,
}: {
  error: unknown | AxiosError;
  companyName: string;
}) {
  if (isAxiosError(error)) {
    console.error(
      'Failed with axios error',
      error.response?.data,
      error.response?.status,
    );

    return (
      <ErrorHandler
        appName={config.get('appName')}
        id={error.response?.data.error.id}
        message={error.response?.data.error?.message}
        reason={error.response?.data.error?.reason}
        companyName={companyName}
      />
    );
  }

  return <></>;
}
