import _ from 'lodash';
import { checkEntityName } from './constraint';

const ROUTE_TYPES = {
  SHOW: 'show',
  EDIT: 'edit',
};

export function routeURL(type = ROUTE_TYPES.SHOW, options = {}) {
  checkEntityName(this.constructor);

  if (_.isUndefined(this.$id)) {
    throw new Error(`Unable to generate route URL. No id defined for '${this.constructor.entity}'.`);
  }

  return {
    name: [type, this.constructor.routeName].join('-'),
    params: {
      id: this.$id,
    },
    ...options,
  };
}

export function showURL(options = {}) {
  return this.routeURL(ROUTE_TYPES.SHOW, options);
}

export function editURL(options = {}) {
  return this.routeURL(ROUTE_TYPES.EDIT, options);
}
