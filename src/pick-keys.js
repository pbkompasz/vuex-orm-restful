import { isArray, omit, pick } from 'lodash';

export default function pickKeys(
        keys = Object.keys(this.$toJson()),
        skipId = false,     
    ) {
    if (!isArray(keys)) {
        throw new Error('Keys need to be an array.');
    }

    const omitItems = ['$id']
    if (skipId) omitItems.push('id')

    return omit(pick(this.$toJson(), keys), omitItems);
}
