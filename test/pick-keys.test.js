import { Model } from '@vuex-orm/core';
import { installPlugin } from './helpers';

class Dummy extends Model {
  static entity = 'dummy';

  static fields() {
    return {
      title: this.attr(null),
      name: this.attr(null),
    };
  }
}

test('thorws error when keys is not an array', () => {
  installPlugin();
  const dummy = new Dummy({ $id: 1, title: 'title', name: 'name' });

  expect(() => dummy.pickKeys('title')).toThrow('Keys need to be an array');
});

test('picks all fields by default', () => {
  installPlugin();
  const dummy = new Dummy({ $id: 1, title: 'title', name: 'name' });
  // Always omits $id key
  expect(dummy.pickKeys()).toEqual({
    title: 'title',
    name: 'name',
  });
});

test('allows picking keys', () => {
  installPlugin();
  const dummy = new Dummy({ $id: 1, title: 'title', name: 'name' });
  // Always omits $id key
  expect(dummy.pickKeys(['title'])).toEqual({
    title: 'title',
  });
});
