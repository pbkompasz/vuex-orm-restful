import { 
    Attr,
    HasOne,
} from '@vuex-orm/core'
import _ from 'lodash';

const parseData = (data) => {
    if (!checkData(data)) {
        throw new Error('bad data')
    }
    if (!_.isArray(data)) {
        data = [data]
    }  
    const objects = [] 
    data.forEach((a) => {
        for (field of a) {
            if (_.isObject(field)) {

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