import { isUndefined } from 'lodash';
import { checkConstraints } from './constraint';

export default async function destroy() {
  const { delete: destroy } = this.client;

  if (isUndefined(destroy)) {
    throw new Error('HTTP Client has no `delete` method');
  }

  checkConstraints(this);

  await destroy(this.apiPath());
  return this.$delete();
}
