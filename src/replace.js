import { isUndefined, omit } from 'lodash';
import { checkConstraints } from './constraint';

export default function replace() {
  const { put } = this.client;

  if (isUndefined(put)) {
    throw new Error('HTTP Client has no `put` method');
  }

  checkConstraints(this);

  put(this.apiPath(), omit(this.$toJson(), '$id'));
}
