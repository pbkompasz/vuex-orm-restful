import { Model } from '@vuex-orm/core';
import { installPlugin, createStore, mockResponse } from './helpers';

class Dummy extends Model {
  static entity = 'dummy';
}

class EntityDummy extends Model {}

test('throws error when no entity is defined', () => {
  installPlugin();
  const entityDummy = new EntityDummy();
  expect(() => { entityDummy.listKey(); }).toThrow("entity name is not defined on class 'EntityDummy'");
});

test('throws error when no id is defined', () => {
  installPlugin();
  const dummy = new Dummy();
  expect(() => { dummy.listKey(); }).toThrow("Unable to generate listKey on 'dummy'. No $id is present.");
});

test('generates list key', () => {
  const dummies = [
    new Dummy({ $id: 1, title: 'title', desc: 'desc' }),
    new Dummy({ $id: 2, title: 'title', desc: 'desc' }),
  ];
  expect(dummies.map(d => d.listKey())).toEqual(['dummy-1', 'dummy-2']);
});
