import _ from 'lodash';

class ConstraintViolationError extends Error {}

export function checkEntityName({ entity, name }) {
  if (_.isUndefined(entity)) {
    throw new ConstraintViolationError(`entity name is not defined on class '${name}'`);
  }
  return true;
}

export function checkApiPath({ apiPath, name }) {
  if (_.isUndefined(apiPath)) {
    throw new ConstraintViolationError(`apiPath is not defined on class '${name}'`);
  }
  return true;
}

const constraints = [checkEntityName, checkApiPath];

export function checkConstraints(entity) {
  return constraints
    .map((constraint) => {
      if (_.isFunction(entity)) {
        return constraint(entity);
      }
      return constraint(entity.constructor);
    }).reduce((l, r) => l && r, true);
}
