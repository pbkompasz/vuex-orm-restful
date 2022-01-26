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
  expect(dummy.update()).rejects.toEqual(new Error('HTTP Client has no `patch` method'));
});

test('Calls patch method of the client', async () => {
  const store = createStore(Dummy);
  const post = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  const patch = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  installPlugin({ patch, post });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });
  const savedDummy = await dummy.save();
  await savedDummy.update();
  expect(patch).toHaveBeenCalledWith('dummyPath/1', { title: 'title', desc: 'desc' });
});

test('Only updates picked keys', async () => {
  const store = createStore(Dummy);
  const post = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  const patch = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  installPlugin({ patch, post });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });
  const savedDummy = await dummy.save();
  await savedDummy.update(['title']);
  expect(patch).toHaveBeenCalledWith('dummyPath/1', { title: 'title' });
});

test('updates object in store', async () => {
  const store = createStore(Dummy);
  const post = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  const patch = mockResponse({ id: 1, title: 'title', desc: 'foo' });
  installPlugin({ patch, post });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });
  const savedDummy = await dummy.save();
  const response = await savedDummy.update();
  expect(response).toEqual({ $id: 1, title: 'title', desc: 'foo' });
  expect(Dummy.find(1)).toEqual({ $id: 1, title: 'title', desc: 'foo' });
});
