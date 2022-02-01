import { checkConstraints } from './constraint';
import { isUndefined, isNumber, isNull } from 'lodash';

export default async function findOrCreate(id) {
  if (isUndefined(id)) {
    throw new Error('No id is provided');
  }

  if (!isNumber(id)) {
    throw new Error('The id provided is not a number');
  }

  checkConstraints(this);

  const record = this.findOrFetch(id);

  if (isNull(record)) {
      return this.save()
  }

  return Promise.resolve(record);
}
