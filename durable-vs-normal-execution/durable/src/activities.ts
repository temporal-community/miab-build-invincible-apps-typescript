import * as activity from '@temporalio/activity';

export async function addOne(num: number): Promise<number> {
  return num + 1;
}
