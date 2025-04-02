import {proxyActivities, sleep, log} from '@temporalio/workflow';

import type * as activities from './activities';
import {WorkflowInput, WorkflowOutput} from './shared';

const { getIP, getLocationInfo} = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute', // maximum time allowed for a single Activity Task Execution.
});

export async function getAddressFromIP(input: WorkflowInput): Promise<WorkflowOutput> {

  const ip = await getIP();

  if (input.seconds > 0 ){
    await sleep(`${input.seconds} seconds`);
  }

  const location = await getLocationInfo(ip);

  return {ip, location};
}
