import _ from 'lodash';
import { checkEntityName } from './constraint';

export default function listKey() {
  checkEntityName(this.constructor);

  if (_.isUndefined(this.$id)) {
    throw new Error(`Unable to generate listKey on '${this.constructor.entity}'. No $id is present.`);
  }

  return `${this.constructor.entity}-${this.$id}`;
}
