import { Model } from '@vuex-orm/core';
import { installPlugin } from './helpers';

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

test('Throws error when the client has no put method', () => {
  installPlugin();
  const dummy = new Dummy({ $id: 1 });
  expect(() => { dummy.replace(); }).toThrow('HTTP Client has no `put` method');
});

test('Calls put method of the client', () => {
  const put = jest.fn();
  installPlugin({ put });
  const dummy = new Dummy({ $id: 1, title: 'title', desc: 'desc' });
  dummy.replace();
  expect(put).toHaveBeenCalledWith('dummyPath/1', { title: 'title', desc: 'desc' });
});
