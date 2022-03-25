import { isUndefined } from 'lodash';
import { checkConstraints } from './constraint';

export default async function save(
        keys = Object.keys(this.$toJson()),
        skipId = true,
    ) {
    const { post } = this.client;

    if (isUndefined(post)) {
        throw new Error('HTTP Client has no `post` method');
    }

    checkConstraints(this);

    const data = await post(this.constructor.apiPath, this.pickKeys(keys, skipId));
    const stored = await this.$insert(data);
    return stored[this.constructor.entity][0];
}
