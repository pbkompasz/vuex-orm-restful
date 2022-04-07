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

class Vehicle extends Model {
    static entity = 'vehicle'
    static apiPath = 'vehicle'
    static fields() {
        return {
            id: this.attr(null),
            make: this.attr(null),
            status: this.hasOne(Status, 'id'),
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

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(),
      name: this.attr(''),
      todos: this.hasOne(Todo, 'id')
    }
  }
}

class Todo extends Model {
  static entity = 'todos'

  static fields () {
    return {
      id: this.attr(),
      user_id: this.attr(null),
      title: this.attr(''),
      done: this.attr(false),
    //   assignee: this.belongsTo(User, 'user_id')
    }
  }
}

// test('Throws error when the client has no get method', () => {
//   installPlugin();
//   expect(Model.fetch()).rejects.toEqual(new Error('HTTP Client has no `get` method'));
// });

// test('Throws error when no id is provided to fetch', () => {
//   const get = jest.fn();
//   installPlugin({ get });

//   expect(Model.fetch()).rejects.toEqual(new Error('No id is provided'));
// });

// test('Throws error when id is not a number', () => {
//   const get = jest.fn();
//   installPlugin({ get });

//   expect(Model.fetch('')).rejects.toEqual(new Error('The id provided is not a number'));
// });

// test('Throws error when entity name or apiPath is not defined', () => {
//   expect(EntityDummy.fetch(1)).rejects.toEqual(new Error("apiPath is not defined on class 'EntityDummy'"));
//   expect(APIPathDummy.fetch(1)).rejects.toEqual(new Error("entity name is not defined on class 'APIPathDummy'"));
// });

// test('Calls the get method of the client when no constraint is violated', async () => {
//   const store = createStore(Dummy);
//   const get = mockResponse({ id: 1 });
//   installPlugin({ get });

//   await Dummy.fetch(1);
//   expect(get).toHaveBeenCalledWith('dummyPath/1');
// });

// test('inserts fetched element in the database', async () => {
//   const store = createStore(Dummy);
//   const get = mockResponse({ id: 1 });
//   installPlugin({ get });
//   const response = await Dummy.fetch(1);
//   expect(Dummy.find(1)).toEqual({ $id: 1 });
//   expect(response[0].dummy[0]).toEqual({ $id: 1 })
// //   expect(response).toEqual({ $id: 1 });
// });

// testName = 'inserts fetched nested element in the database' 
// test(testName, async () => {
//     console.log(testName)
//     const store = createStore(DummyCompl, NestedDummy);
//     // const store1 = createStore(NestedDummy);
//     const data1 = { id: 1, vehicles: [{ id: 1, }, { id: 2 }] }
//     const data2 = [{ id: 1, name: 'car',  status_id: 1 }, { id: 2, name: 'bus', status_id: 2}]
//     const data3 = { id: 1, name: 'active', vehicles: [{ id: 1, name: 'car' }, { id: 2, name: 'bus' }] }
//     const data4 = { id: 1, name: 'active', vehicle: { id: 1, name: 'car' } }
//     const get = mockResponse(data3);
//     installPlugin({ get });
//     // console.log(DummyCompl.getFields())
//     const response = await NestedDummy.fetch(1);
//     console.log(NestedDummy.all())
//     console.log(DummyCompl.all())
//     expect(DummyCompl.find(1)).toEqual({ '$id': 1, id: 1, status_id: 1, name: 'car' });
//     // expect(response[0].dummy[0]).toEqual({ $id: 1 })

// })

test( 'vehicle-status example, with primary key as nested value', async () => {
    console.log('vehicle-status example, with primary key as nested value')
    const store = createStore(Vehicle, Status);
    // const statusActive = { id: 1, name: 'active', vehicles: [1, 2] }
    // const statusInactive = { id: 2, name: 'inactive', vehicles: [3] }
    const vehicle = {
            id: 1,
            make: 'Merc',
            status: {
                name: 'Active',
            }
        }
    const get = mockResponse(vehicle);
    installPlugin({ get });
    const response = await Vehicle.fetch(1);
    console.log(Status.all())
    console.log(Vehicle.all())
    // console.log(Status.find(1))
    // console.log(response[0])
    // expect(Status.find(1)).toEqual({ '$id': 1, id: 1, name: 'active', vehicles: [1, 2] });
    // expect(response[0].status[0]).toEqual({ '$id': 1, id: 1, name: 'active', vehicles: [1, 2] });
    // expect(await Status.fetch(1)).toEqual(Status.find(1));
})

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
            make: 'Merc',
            status: {
                name: 'Active',
            }
        },
        {
            make: 'Merc',
            status: {
                name: 'Active',
            }
        },
    ]
    // const store = createStore(User, Todo);
    const store = createStore(Vehicle, Status);

    Vehicle.insert({ data: dataVehicle })
    // console.log(User.all())
    // console.log(Todo.all())
    console.log(Vehicle.all())
    console.log(Status.all())

})

// testName = 'vehicle-status example, with primary key as nested value with populate'
// test(testName, async () => {
//     console.log(testName)
//     const store = createStore(Vehicle, Status);
//     const statusActive = { id: 1, name: 'active', vehicles: [1, 2] }
//     const statusInactive = { id: 2, name: 'inactive', vehicles: [3] }
//     const response = await Status.fetch(1, {
//         populate: true,
//     });
// })

// testName = 'vehicle-status example, with object as nested value'
// test(testName, async () => {
//     console.log(testName)
//     const store = createStore(Vehicle, Status);
//     const statusActive = { id: 1, name: 'active', vehicles: [{ id: 1, name: 'car' }, { id: 2, name: 'bus' }] }
//     const statusInactive = { id: 2, name: 'inactive', vehicles: [{ id: 3, name: 'car' }] }
//     const response = await Status.fetch(1);
//     console.log(Vehicle.all())
//     console.log(Status.all())
// })

// test('inserts fetched nested element in the database with populate', async () => {
//     const store = createStore(DummyCompl, NestedDummy);
//     // const store1 = createStore(NestedDummy);
//     const data1 = { id: 1, vehicles: [{ id: 1, }, { id: 2 }] }
//     const data2 = [{ id: 1, name: 'car',  status_id: 1 }, { id: 2, name: 'bus', status_id: 2}]
//     const data3 = { id: 1, name: 'active', vehicles: [{ id: 1, name: 'car' }, { id: 2, name: 'bus' }] }
//     const data4 = { id: 1, name: 'active', vehicle: { id: 1, name: 'car' } }
//     const get = mockResponse(data3);
//     installPlugin({ get });
//     // console.log(DummyCompl.getFields())
//     const response = await NestedDummy.fetch(1).populate()
//     console.log(response)
//     // const response1 = await NestedDummy.fetch(1);
//     // console.log(response1)
//     // await NestedDummy.insertOrUpdate({ data: { id: 1, vehicles: [{ id: 1, }, { id: 2 }] }})
//     // await NestedDummy.insert({ data: { id: 1, name: 'active', vehicles: [{ id: 1, name: 'car' }, { id: 2, name: 'bus' }] }})
//     // await DummyCompl.insertOrUpdate({ data: [{ id: 1, name: 'car',  status_id: 1 }, { id: 2, name: 'bus', status_id: 2}]})
//     // await NestedDummy.insert({ data: { id: 1, name: 'active', }})
//     // await NestedDummy.insert({ data: { id: 2, name: 'inactive', }})
//     // const nested = NestedDummy.find(1)
//     // nested.vehicles = nested.vehicles.concat(DummyCompl.all().filter((a) => {
//     //     return a.status_id === nested.id
//     // }))
//     // console.log(nested)
//     // console.log(NestedDummy.all())
//     // console.log(DummyCompl.all())
//     expect(DummyCompl.find(1)).toEqual({ $id: 1 });
//     expect(response[0].dummy[0]).toEqual({ $id: 1 })

// })

// TODO
// for hasone does not work yet
// call .populate on return
// write tests

// test('throws error when response could not be processed', () => {
//   const store = createStore(Dummy);
//   const get = mockResponse(null);
//   installPlugin({ get });
//   expect(Dummy.fetch(1)).rejects.toEqual(new Error('Unable to process response.'))
// });
