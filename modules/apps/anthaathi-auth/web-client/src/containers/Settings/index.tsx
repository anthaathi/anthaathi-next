import { SettingsFlow } from '@ory/kratos-client';
import { Header } from '@/features/CommonUI/Header';

import { config } from '@anthaathi-internal/config';
import { FlowRenderer } from '@/containers/Settings/FlowRenderer';

export function SettingsContainer({ flow }: { flow: SettingsFlow }) {
  return (
    <>
      <Header title={config.get('companyName')} icon={config.get('logoURL')} />

      <FlowRenderer flow={flow} />
    </>
  );
}
