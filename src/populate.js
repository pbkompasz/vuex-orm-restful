

export default function populate(entity, fieldName) {
    if (!relational(entity[fieldName])) {
        throw new Error({
            message: 'Field is not an entity'
        })
    }
    // call fetch on entity
}