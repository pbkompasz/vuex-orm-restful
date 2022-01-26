import _ from 'lodash';
import { checkConstraints } from './constraint';
import joinPath from 'path.join';

export default async function fetch(id, { useCache = true } = {}) {
    const { get } = this.client;

    if (_.isUndefined(get)) {
        throw new Error('HTTP Client has no `get` method');
    }

    if (_.isUndefined(id)) {
        throw new Error('No id is provided');
    }

    if (!_.isNumber(id)) {
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
        console.log(val)
        if (_.isEqual(val, "id")) {
            return true;
        }
        const field = fields[val];
        // if (field.constructor.name == 'HasOne' ||  )
        console.log({ field, type: self.getTypeModel(val) })
        if (['HasOne', 'BelongsTo', 'HasMany', 'hasManyBy', 'BelongsToMany', 'HasManyThrough', 'MorphOne', 'MorphTo', 'MorphMany', 'MorphToMany', 'MorphedByMany', ]
            .includes(field.constructor.name)) {
            return false; 
        }
        return true;
    }

    const createEntity = (field) => {
        switch (field.constructor.name) {
            case 'BelongsTo':
            case 'HasOne':
                
                break;
       

                
            default:
                break;
        }
    }

    const parseData = (data) => {
        try {
            data = data.data;
        } catch (error) {
            console.log(error)
        }
        const objects = []
        const newData = data;
        const fields = self.getFields();
        for (const property in data) {
            if (!isAttr(property, fields)) {
                // console.log('Nested property' + property)
                // objects.push({ data: data[property]})
                newData[property] = data[property].id;
            } else {
                // console.log('Normal property')
            }
        }
        objects.push({ data: newData })
        return objects;
    }

    // TODO 
    // get model for each association
    // rewrite test to expect array

    function fetchAPI() {
        throw new Error('random')
        return new Promise(async (resolve, reject) => {
            const data = await get(joinPath(self.apiPath, id.toString()));
            try {
                // const insertedData = await saveData({
                //     data,
                //     insertOrUpdate: self.insertOrUpdate,
                // });
                const objects = parseData(data) 
                // console.log(objects)
                const insertedData = await Promise.all(objects.map(object => { 
                    try {
                        return self.insertOrUpdate(object)
                    } catch (error) {
                        console.log(error) 
                    }

                }));
                // const insertedData = await self.insertOrUpdate(await parseData(data));
                // const insertedData = await self.insertOrUpdate((data));
                // console.log(insertedData[0])
                // resolve(insertedData[self.entity][0]);
                resolve(insertedData)
            } catch (error) {
                console.log(error)
                reject(new Error('Unable to process response.'))
            }
        });
    }

    return Promise.race([
        ...(useCache && self.useCache ? [fetchCache()] : []),
        fetchAPI(),
    ]);
}
