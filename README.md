<p align="center">
  <img width="192" src="https://github.com/vuex-orm/vuex-orm/raw/master/logo-vuex-orm.png" alt="Vuex ORM">
</p>

<h1 align="center">Vuex ORM Plugin: vuex-orm-rest</h1>

This is a fork of the original vuex-orm-rest plugin by [@bierik](https://github.com/bierik/).
Most improvements are focusing on working well with a sails.js backend.
Current improvements: 
 - bugfixes
 - works with all associations supported by vuex-orm
 - added support for custom model methods
 - calling all or find fetches automatically from backend if store is empty
 - database.registerPath instead of registering every file manually
 - passing 'populate: true' to find, fetch, findOrFetch returns populated models
 - calling .populate('entity') populates entity field
 - hasMany fills up database, some reason not working, array stays empty when using Model.insert, Model.insertOrUpdate
 - findOrCreate method

[Vuex-ORM](https://github.com/vuex-orm/vuex-orm) brings Object-Relational Mapping to the Vuex Store. vuex-orm-rest lets you communicate with RESTful backends.

The plugin extends the basic model of Vuex-ORM with some helful functions to make CRUD operations such as (save, fetch, fetchAll, update and delete).

You no longer need to access your http client manually. All the comunication happens thru the enhanced Vuex-ORM models.

# Dependencies

* [vuex](https://github.com/vuejs/vuex)

``` bash
yarn add vuex
```

* [Vuex-ORM](https://github.com/vuex-orm/vuex-orm)

``` bash
yarn add @vuex-orm/core
```

* [axios](https://github.com/axios/axios) (recommended)

``` bash
yarn add axios
```


# Installation

``` bash
yarn add vuex-orm-rest
```
The following exmaple installs the plugin using [axios](https://github.com/axios/axios) as the HTTP-Client and a vue-router instance.

 ``` javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core';
import VuexORMRest from 'vuex-orm-rest';
import axios from 'axios';

const client = axios.create({ baseURL: '/api' });
const database = new VuexORM.Database();

VuexORM.use(VuexORMRest, { client });
Vue.use(Vuex);
export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
});
```

The plugin requires a HTTP-Client to make requests to the backend. The client is passed as an option to the plugin. The following tables shows the association between the client- and CRUD method.

| Plugin   | Client |
|----------|--------|
| fetch    | get    |
| fetchAll | get    |
| save     | post   |
| update   | patch  |
| replace  | put    |
| destroy  | delete |


# Defining models

Go to https://vuex-orm.github.io/vuex-orm/guide/components/models.html to see how to define models using Vuex-ORM.

## Custom methods

```javascript
// User Model

import { Model } from '@vuex-orm/core'

export default class User extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'user'
    static apiPath = 'user'; 

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields () {
        return {
            id: this.attr(null),
            name: this.attr(''),
            age: this.attr('')
        }
    }
    static methods () {
        const findUsersYounger = (id) => {
            const user = User.fetch(id)
            return User.fetchAll({ filter: { age: age => age < user.age } });
        }
    }
}
```

# Interacting with the backend

Assume we have a `user` model. Additionally to the `entity` an `apiPath` variable has to be defined.
The `apiPath` represents the URL under which the entity is reachable on the REST API.

``` javascript
import { Model } from '@vuex-orm/core';

class User extends Model {
  static entity = 'users';
  static apiPath = 'users';

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}
```

Your vuex-orm instance need to know about your model.

``` javascript
database.register(User, {});
```

## fetch(id = null)

Fills the store with a single item by id.
Returns a promise with the fetched data.

``` javascript
User.fetch(1);
```

The fetched user now lies in the store and can be retrieved by using the Vuex-ORM actions.

``` javascript
const user = User.find(1);
```

## fetchAll({ filter = {}, relations = [], replace = false })

Fills the store with a list of items.
Returns a promise with the fetched data.

``` javascript
User.fetchAll();
```

Pass filter to append it as query string to the get request.

``` javascript
User.fetchAll({ filter: { active: true } });
```

Pass relations to fetch nested structure.

``` javascript
const user = User.find(1);
Comments.fetchAll({ relations: [user] });
// fetches using /user/1/comments
```

Retrieve the fetched users.

``` javascript
User.all();
```

## save(keys = Object.keys(this.$toJson()))

Saves a user instance using post verb.
Returns a promise with the post response.

``` javascript
const user = new User({ name: 'John Doe' });
user.save();
```

Pass keys as param to define which attributes should be send to the backend.

``` javascript
const user = new User({ name: 'John Doe' });
user.save(['name']);
```


## update(keys = Object.keys(this.$toJson()))

Updates an existing user using patch verb.
Returns a promise with the patch response.
The update function also accepts a list of keys for every property that should be part of the patch payload.

``` javascript
// Retrieve the user from the store
const user = User.find(1);
user.name = 'Michelangelo';
// This only updates the name property
user.update(['name']);
```

## replace

Replaces a whole user instance using put verb.
Returns a promise with the put response.

``` javascript
// Retrieve the user from the store
const user = User.find(1);
user.name = 'Michelangelo';
// This only updates the name property
user.replace();
```

## destroy

Destroys a user using the delete verb.
Returns a promise with the delete response.

``` javascript
// Retrieve the user from the store
const user = User.find(1);
user.destroy();
```

## routeURL(type = 'show', options = {})

Generate a route URL with prefix on a model instance.
``` javascript
const user = User.find(1);
user.routeURL('some'); // --> { name: 'some-user', params: { id: 1 } }
```

Passing options allows for having params such as a hash on the link
``` javascript
const user = User.find(1);
user.routeURL('show', { hash: '#hash' }); // --> { name: 'some-user', params: { id: 1 }, hash: '#hash' }
```

## showURL(options = {})

Generate a route URL with show prefix on a model instance.
``` javascript
const user = User.find(1);
user.showURL(); // --> { name: 'show-user', params: { id: 1 } }
```

## editURL(options = {})

Generate a route URL with edit prefix on a model instance.
``` javascript
const user = User.find(1);
user.showURL(); // --> { name: 'edit-user', params: { id: 1 } }
```

## listKey

Generate unique key for iterations in DOM such as `v-for` in vuejs.
``` javascript
const user = User.find(1);
user.listKey(); // --> 'user-1'
```

## pickKeys(keys = Object.keys(this.$toJson()))

Serializes all fields by default but the `$id` of an entity. Using the `keys` parameter you can define which keys should be serialized.

``` javascript
const user = User.find(1);
user.pickKeys(); // --> { firstname: 'Hugo', lastname: 'Boss' }
user.pickKeys(['firstname']); // --> { firstname: 'Hugo' }
```

The `save` and `update` method uses `pickKeys` to determine which fields should be send to the backend.
You could override this method to always include a certain key:

```javascript
pickKeys(keys) {
  return super.pickKeys([
    ...keys,
    'this_key_is_always_in_the_payload',
  ]);
}
```

# Caching

Every `fetch` or `fetchAll` request first hits the store and returns the entities immediately if found.
In the background the http request happens and updates as soon as the response is back.
This method will make your UI respond fast on the first hit but may be outdated.
But the request in the background will update it as soon as possible.


The caching is enabled by default and can be turned of globally by passing the `useCache` option.

``` javascript
import VuexORM from '@vuex-orm/core';
import VuexORMRest from 'vuex-orm-rest';

VuexORM.use(VuexORMRest, { useCache: false });
```

It is also possible to disable the caching for a single request.

``` javascript
User.fetch(1, { useCache: false });
```

# Async queue

The async queue is a utility which helps to manage fetching data.
It is possible to execute functions sequentially or in parallel.
All the methods from the queue are chainable. The whole queue is executed using the `exec` method.

## Sequence

The sequence method executes functions sequentially. The result from the previous sequence is passed to the next step when resolved.

``` javascript
const res = await Queue
  .sequence(() => Promise.resolve(1))
  .sequence((res) => Promise.resolve(res + 1))
  .exec(); // Evaluates to 2
```
## Parallel

The parallel method executes functions in parallel. The result from the previous parallel is passed to the next step as an array when all functions are resolved.

``` javascript
const res = await Queue
  .parallel(() => Promise.resolve(1))
  .parallel(() => Promise.resolve(2))
  .parallel(() => Promise.resolve(3))
  .exec(); // Evaluates to [1, 2, 3]
```

It is also possible to mix the parallel and sequence method.

``` javascript
const res = await Queue
  .sequence(() => Promise.resolve(1))
  .parallel((res) => Promise.resolve(res + 1))
  .parallel((res) => Promise.resolve(res + 1))
  .parallel((res) => Promise.resolve(res + 1))
  .sequence((res) => Promise.resolve(res))
  .exec(); // Evaluates to [2, 2, 2]
```

## 