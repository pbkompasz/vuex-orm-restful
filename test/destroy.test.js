import { Model } from '@vuex-orm/core';
import { installPlugin, createStore, mockResponse } from './helpers';

class Dummy extends Model {
  static entity = 'dummy';
  static apiPath = 'dummyPath';

  static fields() {
    return {
      title: this.string(''),
      desc: this.string(''),
    }
  }
}

test('Throws error when the client has no patch method', () => {
  installPlugin();
  const dummy = new Dummy({ $id: 1 });
  expect(dummy.destroy()).rejects.toEqual(new Error('HTTP Client has no `delete` method'));
});

test('Calls delete method of the client', async () => {
  const store = createStore(Dummy);
  const destroy = jest.fn();
  const post = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  installPlugin({ delete: destroy, post });
  const dummy = new Dummy({ $id: 1, title: 'title', desc: 'desc' });
  const storedDummy = await dummy.save();
  await dummy.destroy();
  expect(destroy).toHaveBeenCalledWith('dummyPath/1');
});

test('Removes entity from store', async () => {
  const store = createStore(Dummy);
  const destroy = jest.fn();
  const post = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  installPlugin({ delete: destroy, post });
  const dummy = new Dummy({ $id: 1, title: 'title', desc: 'desc' });
  const storedDummy = await dummy.save();
  expect(Dummy.find(1)).toEqual({ $id: 1, title: 'title', desc: 'desc' });
  const response = await dummy.destroy();
  expect(response).toEqual({ $id: 1, title: 'title', desc: 'desc' });
  expect(Dummy.find(1)).toBeNull();
});
