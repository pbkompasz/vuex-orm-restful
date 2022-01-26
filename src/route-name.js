import { checkEntityName } from './constraint';

export default function routeName() {
  checkEntityName(this.constructor);

  return this.constructor.routeName || this.constructor.entity;
}
