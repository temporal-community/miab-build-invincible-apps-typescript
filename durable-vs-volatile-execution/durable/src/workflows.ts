import {proxyActivities, sleep, log} from '@temporalio/workflow';

import type * as activities from './activities';

const { addOne} = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute', // maximum time allowed for a single Activity Task Execution.
});

export async function countingWorkflow(): Promise<void> {

    let i = 1;
    log.warn("***Counting to 10***");
    while ( i<=10) {
        log.warn(i.toString());
        i = await addOne(i);
        await sleep('1 second');
    }
    log.warn("***Finished counting to 10***");
}
