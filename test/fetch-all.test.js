import { Model } from '@vuex-orm/core';
import { installPlugin, createStore, mockResponse } from './helpers';

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

class RelationDummy extends Model {
  static entity = 'relation-dummy';
  static apiPath = 'relation-dummyPath';
}

test('Throws error when the client has no get method', () => {
  installPlugin();
  expect(Model.fetchAll()).rejects.toEqual(new Error('HTTP Client has no `get` method'));
});

test('Throws error when entity name or apiPath is not defined', () => {
  const get = jest.fn();
  installPlugin({ get });

  expect(EntityDummy.fetchAll()).rejects.toEqual(new Error("apiPath is not defined on class 'EntityDummy'"));
  expect(APIPathDummy.fetchAll()).rejects.toEqual(new Error("entity name is not defined on class 'APIPathDummy'"));
});

test('Calls the get method of the client when no constraint is violated', async () => {
  createStore(Dummy);
  const get = mockResponse({});
  installPlugin({ get });

  await Dummy.fetchAll();
  expect(get).toHaveBeenCalledWith('dummyPath', { params: {} });
});

test('throws error when filter is not an object', () => {
  expect(Dummy.fetchAll({ filter: '' })).rejects.toEqual(new Error('Filter needs to be an object'));
});

test('passes filter to get request', async () => {
  createStore(Dummy);
  const get = mockResponse({});
  installPlugin({ get });

  await Dummy.fetchAll({ filter: { search: '' } });
  expect(get).toHaveBeenCalledWith('dummyPath', { params: { search: '' } });
});

test('inserts fetched element in the database', async () => {
  const store = createStore(Dummy);
  const get = mockResponse([{ id: 1 }]);
  installPlugin({ get });
  const response = await Dummy.fetchAll();
  expect(Dummy.find(1)).toEqual({ $id: 1 });
  expect(response).toEqual([{ $id: 1 }]);
});

test('throws error when response could not be processed', () => {
  const store = createStore(Dummy);
  const get = mockResponse(null);
  installPlugin({ get });
  expect(Dummy.fetchAll()).rejects.toEqual(new Error('Unable to process response.'))
});

test('replaces the store when replace is set to true', async () => {
  const store = createStore(Dummy);
  installPlugin({ get: mockResponse({ id: 1 }) });
  await Dummy.fetchAll({ replace: true });
  expect(Dummy.all()).toEqual([{ $id: 1 }])

  installPlugin({ get: mockResponse({ id: 2 }) });
  await Dummy.fetchAll({ replace: true });
  expect(Dummy.all()).toEqual([{ $id: 2 }])
});

test('builds path using relations', async () => {
  createStore(Dummy, RelationDummy);
  await RelationDummy.insert({ data: { id: 1 } });
  const get = mockResponse([]);
  installPlugin({ get });
  await Dummy.fetchAll({ relations: [RelationDummy.find(1)] });
  expect(get).toHaveBeenCalledWith('relation-dummyPath/1/dummyPath', { params: {} });
});
