import { Model } from '@vuex-orm/core';
import { installPlugin, createStore, mockResponse } from './helpers';

let testName

class EntityDummy extends Model {
    static entity = '';
}

class APIPathDummy extends Model {
    static apiPath = '';
}

class Dummy extends Model {
    static entity = 'dummy';
    static apiPath = 'dummyPath';
}

class DummyCompl extends Model {
    static entity = 'dummyCompl'
    static apiPath = 'dummyPath'
    static fields() {
        return {
            id: this.attr(null),
            // nestedDummyId: this.hasOne(NestedDummy, 'id'),
            status_id: this.attr(null),
            name: this.attr(''),
            // status: this.belongsTo(NestedDummy, 'status_id'),
        }
    }
}

class NestedDummy extends Model {
    static entity = 'nestedDummy'
    static apiPath = 'nestedDummyPath'
    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            vehicles: this.hasMany(DummyCompl, 'status_id')
        }
    }
}
// TODO
// https://github.com/vuex-orm/vuex-orm/issues/378
// https://vuex-orm.org/guide/data/retrieving.html#relationships
// https://vuex-orm.org/guide/model/relationships.html#one-to-one


class Vehicle extends Model {
    static entity = 'vehicle'
    static apiPath = 'vehicle'
    static fields() {
        return {
            id: this.attr(null),
            make: this.attr(null),
            status: this.belongsTo(Status, 'status_id'),
            status_id: this.attr(null),
        }
    }
}


class Status extends Model {
    static entity = 'status'
    static apiPath = 'status'
    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            // vehicles: this.hasMany(Vehicle, 'status'),
        }
    }
}

// class User extends Model {
//   static entity = 'users'

//   static fields () {
//     return {
//       id: this.attr(),
//       name: this.attr(''),
//       todos: this.hasOne(Todo, 'id')
//     }
//   }
// }

// class Todo extends Model {
//   static entity = 'todos'

//   static fields () {
//     return {
//       id: this.attr(),
//       user_id: this.attr(null),
//       title: this.attr(''),
//       done: this.attr(false),
//     //   assignee: this.belongsTo(User, 'user_id')
//     }
//   }
// }

test('Throws error when the client has no get method', () => {
    installPlugin();
    expect(Model.fetch()).rejects.toEqual(new Error('HTTP Client has no `get` method'));
});

test('Throws error when no id or search criteria is provided to fetch', () => {
    const get = jest.fn();
    installPlugin({ get });

    expect(Model.fetch()).rejects.toEqual(new Error('No id or search criteria is provided'));
});

test('Throws error when id is not a number', () => {
    const get = jest.fn();
    installPlugin({ get });

    expect(Model.fetch('')).rejects.toEqual(new Error('The id provided is not a number'));
});

test('Throws error when search criteria is not valid', () => {
    const get = jest.fn();
    installPlugin({ get });

    expect(Model.fetch('')).rejects.toEqual(new Error('The search criteria provided is not valid'));
});

test('Throws error when entity name or apiPath is not defined', () => {
    expect(EntityDummy.fetch(1)).rejects.toEqual(new Error("apiPath is not defined on class 'EntityDummy'"));
    expect(APIPathDummy.fetch(1)).rejects.toEqual(new Error("entity name is not defined on class 'APIPathDummy'"));
});

test('Calls the get method of the client when no constraint is violated', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({ id: 1 });
    installPlugin({ get });

    await Dummy.fetch(1);
    expect(get).toHaveBeenCalledWith('dummyPath/1');
});

test('Checks if the created path confirms to the provided search criteria with only criteria being the id', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({ id: 1 });
    installPlugin({ get });

    await Dummy.fetch({
        id: 1,
    });
    expect(get).toHaveBeenCalledWith('dummyPath/1');
});

test('Checks if the created path confirms to the provided search criteria', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({ id: 1 });
    installPlugin({ get });

    await Dummy.fetch({
        id: 1,
    });
    expect(get).toHaveBeenCalledWith('dummyPath/1');
});

test('Inserts fetched element in the database', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({ id: 1 });
    installPlugin({ get });
    const response = await Dummy.fetch(1);
    expect(Dummy.find(1)).toEqual({ $id: 1 });
});

test('Inserts fetched element in the database and retrieves a copy of the element1', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({ id: 1 });
    installPlugin({ get });
    const response = await Dummy.fetch(1).get();
    expect(Dummy.find(1)).toEqual({ $id: 1 });
    //   expect(response[0].dummy[0]).toEqual({ $id: 1 })
    expect(response).toEqual({ $id: 1 });
});

test('Check populate on one field', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({
        id: 1,
        otherField: {
            id: 2,
        },
    });
    installPlugin({ get });
    const response = await Dummy.fetch(1).get().populate('otherField');
    expect(Dummy.find(1)).toEqual({ $id: 1 });
    expect(response).toEqual({
        id: 1,
        otherField: {
            id: 2,
        },
    });
});

test('Check populate on all fields', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({
        id: 1,
        otherField1: {
            id: 2,
        },
        otherField2: {
            id: 3,
        },
    });
    installPlugin({ get });
    const response = await Dummy.fetch(1).get().populate('all');
    // or
    // const response = await Dummy.fetch(1).get().populate();
    expect(Dummy.find(1)).toEqual({ $id: 1 });
    expect(response).toEqual({
        id: 1,
        otherField1: {
            id: 2,
        },
        otherField2: {
            id: 3,
        },
    });
});

test('Check populate with data fetched from backend', async () => {
    const store = createStore(Dummy);
    const get = mockResponse({
        id: 1,
        otherField1: 2,
        otherField2: 3,
    });
    installPlugin({ get });
    const response = await Dummy.fetch(1).get().populate('all');
    // or
    // const response = await Dummy.fetch(1).get().populate();
    expect(Dummy.find(1)).toEqual({ $id: 1 });
    expect(response).toEqual({
        id: 1,
        otherField1: {
            id: 2,
        },
        otherField1: {
            id: 3,
        },
    });
});

test('random', async () => {
    const data = [
        {
            name: 'John Doe',
            todos: [
                {
                    id: 1,
                    title: 'Create awesome application!',
                    done: false
                },
                {
                    id: 2,
                    title: 'Read the documentation',
                    done: false
                }
            ]
        },
        {
            name: 'Johnny Doe',
            todos: [
                {
                    id: 3,
                    title: 'Star Vuex ORM repository',
                    done: false
                }
            ]
        }
    ]
    const dataVehicle = [
        {
            id: 3,
            make: 'Merc',
            status: {
                id: 1,
                name: 'Active',
            },
        },
        {
            id: 2,
            make: 'Merc',
            status: {
                id: 1,
                name: 'Active',
            }
        },
        {
            id: 1,
            make: 'bmw',
            status: {
                id: 2,
                name: 'Inactive',
            }
        },
    ]
    // const store = createStore(User, Todo);
    const store = createStore(Vehicle, Status);

    Vehicle.insert({ data: dataVehicle })
    // Vehicle.insert({ data })
    // console.log(User.all())
    // console.log(Todo.all())
    console.log(Vehicle.all())
    console.log(Status.all())
    console.log(Vehicle.query().with('status').get())
    // const res = Vehicle.fetch(1).gets()
    //     .populate('asd')
    //     .populate('asd2')

    // console.log(res)
    // console.log(res)
    // console.log(res.get())
    // console.log(res.get())

})

test('throws error when response could not be processed', () => {
  const store = createStore(Dummy);
  const get = mockResponse(null);
  installPlugin({ get });
  expect(Dummy.fetch(1)).rejects.toEqual(new Error('Unable to process response.'))
});
