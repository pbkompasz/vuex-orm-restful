import _ from 'lodash';

export default function pickKeys(keys = Object.keys(this.$toJson())) {
  if (!_.isArray(keys)) {
    throw new Error('Keys need to be an array.');
  }

  return _.omit(_.pick(this.$toJson(), keys), ['$id']);
}
