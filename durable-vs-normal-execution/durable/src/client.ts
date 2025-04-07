import { Connection, Client } from '@temporalio/client';
import { countingWorkflow } from './workflows';
import { nanoid } from 'nanoid';

async function run() {

  const connection = await Connection.connect({ address: 'localhost:7233' });

  const client = new Client({ connection });

  const handle = await client.workflow.start(countingWorkflow, {
    taskQueue: "durable",
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'counting-workflow-' + nanoid(),
  });

  console.log(`Started workflow ${handle.workflowId}`);

  const output = await handle.result();

  console.log(output);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});