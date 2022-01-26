import { Model } from '@vuex-orm/core';
import { installPlugin, mockResponse, createStore } from './helpers';

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

test('Throws error when the client has no post method', () => {
  installPlugin();
  const dummy = new Dummy();
  expect(dummy.save()).rejects.toEqual(new Error('HTTP Client has no `post` method'));
});

test('Calls post method of the client', async () => {
  createStore(Dummy);
  const post = mockResponse({ id: 1 });
  installPlugin({ post });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });
  await dummy.save();
  expect(post).toHaveBeenCalledWith('dummyPath', { title: 'title', desc: 'desc' });
});

test('Only saves picked keys', async () => {
  createStore(Dummy);
  const post = mockResponse({ id: 1 });
  installPlugin({ post });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });
  await dummy.save(['title']);
  expect(post).toHaveBeenCalledWith('dummyPath', { title: 'title' });
});

test('inserts object in store on save', async () => {
  const store = createStore(Dummy);
  const post = mockResponse({ id: 1, title: 'title', desc: 'desc' });
  installPlugin({ post });
  const dummy = new Dummy({ title: 'title', desc: 'desc' });
  const response = await dummy.save();
  expect(response).toEqual({ $id: 1, title: 'title', desc: 'desc' });
  expect(Dummy.find(1)).toEqual({ $id: 1, title: 'title', desc: 'desc' });
});
