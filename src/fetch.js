import { isUndefined, isNumber, isEqual } from 'lodash';
import { checkConstraints } from './constraint';
import joinPath from 'path.join';
import { 
    Attr,
    HasOne,
} from '@vuex-orm/core'

export default async function fetch(id, { useCache = true, populate = false } = {}) {
    const { get } = this.client;

    if (isUndefined(get)) {
        throw new Error('HTTP Client has no `get` method');
    }

    if (isUndefined(id)) {
        throw new Error('No id is provided');
    }

    if (!isNumber(id)) {
        throw new Error('The id provided is not a number');
    }

    checkConstraints(this);

    const self = this;

    function fetchCache() {
        return new Promise((resolve) => {
            const cachedValue = self.find(id);
            if (cachedValue) {
                resolve(cachedValue);
            }
        });
    }

    const isAttr = (val, fields) => {
        // if (isEqual(val, "id")) {
        //     return true;
        // }
        const field = fields[val];
        if (!field.constructor) {
            console.log('no constructor')
            return 'simple'
        }
        // if (field.constructor.name == 'HasOne' ||  )
        if (field && ['HasOne', 'BelongsTo', 'HasMany', 'hasManyBy', 'BelongsToMany', 'HasManyThrough', 'MorphOne', 'MorphTo', 'MorphMany', 'MorphToMany', 'MorphedByMany', ]
            .includes(field.constructor.name)) {
            return field.constructor.name.toLowerCase(); 
        }
        return 'simple';
    }

    const createEntity = (name, field, attrType, data) => {
        const tempModel = (self.database().entities.find((field) => { return field.name == field.model.entity}).model)
        const returnData = { model: tempModel, data: { data: null } }
        const d_copy = {
            ...data[name],
        }
        // fill in foreign keys
        d_copy[self.fields()[name].foreignKey] = (data[self.fields()[name].localKey])
        returnData.data = { data: d_copy }
        return returnData
    }

    const createEntities = (name, field, attrType, data) => {
        const tempModel = (self.database().entities.find((field) => { return field.name == field.model.entity}).model)
        const returnData = { model: tempModel, data: { data: [] } }
        data[name].forEach((d) => {
            const d_copy = {
                ...d,
            }
            // fill in foreign keys
            d_copy[self.fields()[name].foreignKey] = (data[self.fields()[name].localKey])
            returnData.data.data.push(d_copy)
        })
        return returnData
    }

    const parseData = (data) => {
        try {
            // Sometimes data is null
            data = data.data;
        } catch (error) {
            console.log(error.message)
        }
        // Array containing objects
        const objects = []
        const newData = data;
        const fields = self.getFields();
        for (const property in data) {
            const attrType = isAttr(property, fields);
            console.log(attrType, property)
            switch (attrType) {
                case 'simple':
                    console.log('Normal property')
                    break;
                case 'hasone':

                    newData[property] = data[property].id;
                    objects.push(createEntity(property, fields[property], attrType, data))
                    break;
                case 'hasmany':
                    objects.push(createEntities(property, fields[property], attrType, data))
                    delete newData[property];
                    break;
                default:
                    break;
            }
        }
        objects.push({ model: self, data: { data: newData } })
        return objects;
    }

    // TODO 
    // get model for each association
    // rewrite test to expect array

    async function fetchAPI() {

        

        return new Promise(async (resolve, reject) => {
            const data = await get(joinPath(self.apiPath, id.toString()));
            console.log(data)
            try {
                const objects = parseData(data) 
                const insertedData = await Promise.all(objects.map(object => { 
                    console.log(object)
                    try {
                        return object.model.insertOrUpdate(object.data)
                    } catch (error) {
                        console.log(error) 
                    }

                }));
                resolve(insertedData)
            } catch (error) {
                console.log(error.message)
                reject(new Error('Unable to process response.'))
            }
        });
    }

    return Promise.race([
        ...(useCache && self.useCache ? [fetchCache()] : []),
        fetchAPI(),
    ]);
}
