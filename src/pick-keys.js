import { isArray, omit, pick } from 'lodash';

export default function pickKeys(keys = Object.keys(this.$toJson())) {
  if (!isArray(keys)) {
    throw new Error('Keys need to be an array.');
  }

  return omit(pick(this.$toJson(), keys), ['$id']);
}
