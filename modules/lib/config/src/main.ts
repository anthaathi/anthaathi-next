import * as convict from 'convict';
import { ipaddress } from 'convict-format-with-validator';
import * as path from 'path';

convict.addFormat(ipaddress);

// Define a schema
const config = convict.default({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  baseDomain: {
    doc: 'Base domain of authentication',
    format: '*',
    default: null,
    env: 'AUTH_BASE_DOMAIN',
    nullable: false,
  },
  companyName: {
    doc: 'Company name',
    format: '*',
    default: 'Anthaathi',
    env: 'AUTH_COMPANY_NAME',
  },
  logoURL: {
    doc: 'Company logo',
    format: '*',
    default: '/icon.svg',
    env: 'AUTH_LOGO_URL',
  },
  appName: {
    doc: 'App name will show up in the website',
    format: '*',
    default: 'Anthaathi Auth',
    env: 'AUTH_APP_NAME',
  },
  appDescription: {
    doc: 'Meta description',
    format: '*',
    default: `Authentication`,
    env: 'AUTH_APP_META_DESCRIPTION',
  },
  defaultReturnUrl: {
    doc: 'Default return url',
    format: '*',
    default: null,
    env: 'DEFAULT_RETURN_URL',
  },
});

// Load environment dependent configuration
const env = config.get('env');
try {
  config.loadFile(
    path.resolve(
      import.meta.env.VITE_APP_ROOT_PATH,
      './config/' + env + '.json',
    ),
  );
} catch (e) {}

// Perform validation
config.validate({ allowed: 'strict' });

export { config };
