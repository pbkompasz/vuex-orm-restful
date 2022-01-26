import { Model } from '@vuex-orm/core';
import { installPlugin, createStore, mockResponse } from './helpers';

class Dummy extends Model {
  static entity = 'dummy';
  static apiPath = 'dummyPath';
}

class APIPathDummy extends Model {
  static apiPath = '';
}

class EntityDummy extends Model {
  static entity = '';
}

test('Throws error when no id is provided to fetch', () => {
  const get = jest.fn();
  installPlugin({ get });

  expect(Model.findOrFetch()).rejects.toEqual(new Error('No id is provided'));
});

test('Throws error when id is not a number', () => {
  const get = jest.fn();
  installPlugin({ get });

  expect(Model.findOrFetch('')).rejects.toEqual(new Error('The id provided is not a number'));
});

test('Throws error when entity name or apiPath is not defined', () => {
  expect(EntityDummy.fetch(1)).rejects.toEqual(new Error("apiPath is not defined on class 'EntityDummy'"));
  expect(APIPathDummy.fetch(1)).rejects.toEqual(new Error("entity name is not defined on class 'APIPathDummy'"));
});

test('Does not fetch when entity is alery in the store', async () => {
  const store = createStore(Dummy);
  const post = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  const get = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  installPlugin({ get, post });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });
  const savedDummy = await dummy.save();

  await Dummy.findOrFetch(1);
  expect(get).not.toHaveBeenCalled();
});

test('Fetches entity when not stored', async () => {
  const store = createStore(Dummy);
  const get = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  installPlugin({ get });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });

  await Dummy.findOrFetch(1);
  expect(get).toHaveBeenCalledWith('dummyPath/1');
});
