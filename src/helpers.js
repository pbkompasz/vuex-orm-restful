import { 
    Attr,
    HasOne,
} from '@vuex-orm/core'
import { isUndefined, isArray, isObject } from 'lodash';

const parseData = (data) => {
    if (!checkData(data)) {
        throw new Error('bad data')
    }
    if (!isArray(data)) {
        data = [data]
    }  
    const objects = [] 
    data.forEach((a) => {
        for (field of a) {
            if (isObject(field)) {

            }
            
        }
    })
    for (field in data) {

    }
}

const insertData = (data) => {

}


export default {
    parseData,
    insertData,
}