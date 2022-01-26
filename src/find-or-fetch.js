import { checkConstraints } from './constraint';
import _ from 'lodash';

export default async function findOrFetch(id) {
  if (_.isUndefined(id)) {
    throw new Error('No id is provided');
  }

  if (!_.isNumber(id)) {
    throw new Error('The id provided is not a number');
  }

  checkConstraints(this);

  const record = this.find(id);

  if (_.isNull(record)) {
    return this.fetch(id);
  }

  return Promise.resolve(record);
}
