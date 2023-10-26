import { PrismaClient } from './generated/client';
import { isDev } from './utils/is-dev';

export const prisma = new PrismaClient({
  log: isDev ? ['query'] : [],
});
