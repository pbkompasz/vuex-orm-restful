import { Model } from '@vuex-orm/core';
import { installPlugin, mockResponse, createStore } from './helpers';

class Dummy extends Model {
  static entity = 'dummy';
  static apiPath = 'dummyPath';
}

class RouteDummy extends Model {
  static entity = 'dummy';
  static apiPath = 'dummyPath';
  static routeName = 'dummyRoute';
}

class EmptyDummy extends Model {}

test('Throws error when no entity is defined', () => {
  installPlugin();
  const emptyDummy = new EmptyDummy();

  expect(() => { emptyDummy.routeName(); }).toThrow("entity name is not defined on class 'EmptyDummy'");
});

test('Falls back to entity name', () => {
  installPlugin();
  const dummy = new Dummy();

  expect(dummy.routeName()).toBe('dummy');
});

test('Returns routeName', () => {
  installPlugin();
  const routeDummy = new RouteDummy();

  expect(routeDummy.routeName()).toBe('dummyRoute');
});
