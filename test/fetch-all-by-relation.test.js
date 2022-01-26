import { Model } from '@vuex-orm/core';
import { installPlugin, mockResponse, createStore } from './helpers';

class Dummy extends Model {
  static entity = 'dummy';
  static apiPath = 'dummyPath';
}

class RelationA extends Model {
  static entity = 'dummyrelationA';
  static apiPath = 'dummyRelationPathA';
}

class RelationB extends Model {
    static entity = 'dummyrelationB';
    static apiPath = 'dummyRelationPathB';
}

test('Calls the get method with relations when no constraint is violated', async () => {
    const store = createStore(RelationA, Dummy);
    const get = mockResponse({ id: 1 });
    installPlugin({ get });

    const relation = new RelationA({ $id: 1 });

    await Dummy.fetchAll({ relations: [relation] });
    expect(get).toHaveBeenCalledWith('dummyRelationPathA/1/dummyPath', { params: {} });
});

test('Calls the get method with multiple relations', async () => {
  const store = createStore(RelationA, RelationB, Dummy);
  const get = mockResponse({ id: 1 });
  installPlugin({ get });

  const relationA = new RelationA({ $id: 1 });
  const relationB = new RelationB({ $id: 2 });

  await Dummy.fetchAll({ relations: [relationA, relationB] });
  expect(get)
    .toHaveBeenCalledWith('dummyRelationPathA/1/dummyRelationPathB/2/dummyPath', { params: {} });
});
