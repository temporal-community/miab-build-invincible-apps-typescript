import express, { Request, Response } from 'express';
import path from 'path';

import { Connection, Client } from '@temporalio/client';
import { getAddressFromIP  } from '../src/workflows';
import {TASK_QUEUE_NAME, DEMO_OPTIONS, WorkflowInput, WorkflowOutput} from '../src/shared'
import { nanoid } from 'nanoid';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML files from the 'server/templates' folder
app.use(express.static(path.join(__dirname, 'templates')));

let temporalClient: Client;

// Temporal Client Initialization
async function initializeTemporal() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  temporalClient = new Client({ connection });
}

// Start the Temporal Workflow
async function startWorkflow(input: WorkflowInput): Promise<WorkflowOutput> {
  const result = await temporalClient.workflow.execute(getAddressFromIP, {
    taskQueue: TASK_QUEUE_NAME,
    args: [input],
    workflowId: 'iplocate-' + nanoid(),
  });
  return result;
}

// Route to handle HTMX form submission
app.post('/greet', async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    let seconds = req.body.sleep_duration;
    
    if (!seconds) {
      seconds = 0;
    } else {
      seconds = Number(seconds);
    }

    const input = {
      name,
      seconds
    };
    const result = await startWorkflow(input);
    res.send(`<p>Hello, ${name}!<br> Your IP Address is <code>${result.ip}</code>.<br> You are in ${result.location}.</p>`);
  } catch (e) {
    res.send('<p>An error occurred</p>');
  }
});

app.get('/demo-options', async(req: Request, res: Response) => {
  res.send(`${DEMO_OPTIONS}`)
});

// Start the server
async function run() {
  const port = 8000;
  await initializeTemporal();
  app.listen(port, () => console.log('Server running on port ' + port));
}

run().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
