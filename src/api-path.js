import { checkConstraints } from './constraint';
import joinPath from 'path.join';

export default function apiPath() {
  checkConstraints(this.constructor);

  return joinPath(this.constructor.apiPath, this.$id.toString());
}
