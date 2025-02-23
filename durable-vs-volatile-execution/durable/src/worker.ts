import { NativeConnection, Worker, DefaultLogger, Runtime } from '@temporalio/worker';
import * as activities from './activities';

// Using custom logger and setting to warn to restrict output for demo
// Suppressing logs this way is not standard.
const logger = new DefaultLogger('WARN', ({ level, message }) => {
  console.log(`${message}`);
});
Runtime.install({ logger });

async function run() {

  const connection = await NativeConnection.connect({
    address: 'localhost:7233',
  });
  try {

    const worker = await Worker.create({
      connection,
      namespace: 'default',
      taskQueue: 'durable',
      workflowsPath: require.resolve('./workflows'),
      activities,
    });

    await worker.run();
  } finally {
    await connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
