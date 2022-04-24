
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

module.export = {
    isAttr,
}