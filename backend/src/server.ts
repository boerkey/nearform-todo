import 'dotenv/config';
import { buildApp } from './app.js';
import { disconnectPrisma } from './lib/prisma.js';

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '0.0.0.0';

async function main() {
  const app = await buildApp();

  const close = async () => {
    await app.close();
    await disconnectPrisma();
    process.exit(0);
  };

  process.on('SIGINT', close);
  process.on('SIGTERM', close);

  try {
    await app.listen({ port, host });
    app.log.info(`Listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
