import { isUndefined, isNumber, isEqual } from 'lodash';
import { checkConstraints } from './constraint';
import joinPath from 'path.join';
import { 
    Attr,
    HasOne,
} from '@vuex-orm/core'

export default async function fetch(id, { useCache = true } = {}) {
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
        // if (field.constructor.name == 'HasOne' ||  )
        if (['HasOne', 'BelongsTo', 'HasMany', 'hasManyBy', 'BelongsToMany', 'HasManyThrough', 'MorphOne', 'MorphTo', 'MorphMany', 'MorphToMany', 'MorphedByMany', ]
            .includes(field.constructor.name)) {
            return field.constructor.name.toLowerCase(); 
        }
        return 'simple';
    }

    const createEntity = (name, field, attrType, data) => {
        const tempModel = (self.database().entities.find((field) => { return field.name == field.model.entity}).model)
        console.log(field)
        console.log(self.fields())
        console.log(data)
        // fill in foreign keys
        // switch (field.constructor.name) {
        //     case 'BelongsTo':
        //     case 'HasOne':
                
        //         break;
       

                
        //     default:
        //         break;
        // }
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
        // console.log(field)
        // console.log(self.fields()[name].foreignKey)
        // console.log(data[self.fields()[name].localKey])
        // console.log(name)
        // switch (field.constructor.name) {
        //     case 'BelongsTo':
        //     case 'HasOne':
                
        //         break;
       

                
        //     default:
        //         break;
        // }
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
            // if (!isAttr(property, fields)) {
            //     console.log('Nested property' + property)
            //     // Replace object with it's id 
            //     newData[property] = data[property].id;
            //     // and store the object as a new entity
            //     // objects.push({ model: getModel(property), data: { data: data[property] } })

            // } else {
            // }
        }
        // TODO rewrite to this 
        objects.push({ model: self, data: { data: newData } })
        // in main function call model.insetOrUpdate(data)
        // objects.push({ data: newData })
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
                // const insertedData = await saveData({
                //     data,
                //     insertOrUpdate: self.insertOrUpdate,
                // });
                const objects = parseData(data) 
                console.log(objects)
                // reject()
                // console.log(self.fields()['nestedDummyId'].model.entity)
                // const store = self.store()
                // // const nestedDummyModel = store.state.entities['nestedDummy']
                // // get model by field name
                // const nestedDummyModel = (self.database().entities.find((a) => { return a.name == 'nestedDummy'}).model)
                // if (nestedDummyModel) {
                //     try {
                //         console.log(nestedDummyModel)
                //         console.log(self)
                //         // just return model when rewrite
                //         await nestedDummyModel.insertOrUpdate({ data: { id: 2, } })
                //     } catch (error) {
                //         console.log(error) 
                //     }
                // }
                const insertedData = await Promise.all(objects.map(object => { 
                    console.log(object)
                    try {
                        return object.model.insertOrUpdate(object.data)
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
