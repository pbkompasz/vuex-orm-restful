import { Model } from '@vuex-orm/core';
import {
  checkEntityName,
  checkApiPath,
  checkConstraints,
} from '@/constraint';

class EntityDummy extends Model {
  static entity = '';
}

class APIPathDummy extends Model {
  static apiPath = '';
}

class Dummy extends Model {
  static entity = '';
  static apiPath = '';
}

test('throws error when entity name is missing on the model', () => {
  class Dummy extends Model {}

  expect(() => {
    checkEntityName(Dummy);
  }).toThrow("entity name is not defined on class 'Dummy'");
});

test('passes entity check', () => {
  expect(checkEntityName(EntityDummy)).toBe(true);
})

test('throws error when apiPath is missing on the model', () => {
  class Dummy extends Model {}

  expect(() => {
    checkApiPath(Dummy);
  }).toThrow("apiPath is not defined on class 'Dummy'");
});

test('passes apiPath check', () => {
  expect(checkApiPath(APIPathDummy)).toBe(true);
});

test('throws error when not every test passes', () => {
  expect(() => {
    checkConstraints(EntityDummy);
  }).toThrow("apiPath is not defined on class 'EntityDummy'");

  expect(() => {
    checkConstraints(APIPathDummy);
  }).toThrow("entity name is not defined on class 'APIPathDummy'");

  expect(checkConstraints(Dummy)).toBe(true);
});
