import { 
    Attr,
    HasOne,
} from '@vuex-orm/core'

import { isUndefined, isNumber, isEqual, values, isObject, isEmpty } from 'lodash';

const isAttr = (val, fields) => {
        // if (isEqual(val, "id")) {
        //     return true;
        // }
        const field = fields[val];
        if (!field || !field.constructor) {
            return 'simple'
        }
        // if (field.constructor.name == 'HasOne' ||  )
        if (field && ['HasOne', 'BelongsTo', 'HasMany', 'hasManyBy', 'BelongsToMany', 'HasManyThrough', 'MorphOne', 'MorphTo', 'MorphMany', 'MorphToMany', 'MorphedByMany', ]
            .includes(field.constructor.name)) {
            return field.constructor.name.toLowerCase(); 
        }
        return 'simple';
    }

const returnModel = (field) => {

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

const parseOpts = (opts) => {
    const queryParameters = {}

    if (isNumber(opts)) {
        queryParameters.id = opts
        return queryParameters
    }

    if (isObject(opts)) {
        if (queryParameters.id)
            queryParameters.id = opts.id
        for (const [key, value] of Object.entries(opts)) {
            if (isObject(value)) {
                console.warn('Warning object as query parameter value. Skipping!')
                continue
            }
            queryParameters[key] = value.toString()
        }
        return queryParameters
    }

    throw new Error('The search criteria provided is not valid')
}

const createPath = (apiPath, parameters) => {
    if (isEmpty(parameters)) {
        throw new Error('No valid query parameters')
    }

    let res = apiPath

    if (parameters.id) {
        return res.concat('/', parameters.id.toString())
    }

    res = res.concat('?')
    for (const [key, value] of Object.entries(parameters)) {
        res = res.concat(`${key}=${value}&`)
    }

    return res.substring(0, res.length - 1)
}

export {
    isAttr,
    returnModel,
    createEntity,
    parseOpts,
    createPath,
}