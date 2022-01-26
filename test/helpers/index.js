import install from '../../src/install';
import * as components from '@vuex-orm/core';
import Vuex from 'vuex';
import Vue from 'vue';
import VuexORM, { Database } from '@vuex-orm/core';

Vue.use(Vuex);

export function installPlugin(client = {}, options = {}) {
  install(components, { client, ...options });
}

export function createStore(...entities) {
  const database = new Database();

  entities.forEach(entity => database.register(entity, {}));

  return new Vuex.Store({
    plugins: [VuexORM.install(database)],
    strict: true,
  });
}

export function mockResponse(data) {
  return jest.fn().mockReturnValue(Promise.resolve({ data }));
}

export function deferResponse() {
  let resolve = null;
  let reject = null;
  const mock = jest.fn();

  function implementMock() {
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    mock.mockReturnValue(promise);
  }

  implementMock();

  return {
    mock,
    resolve: data => resolve({ data }),
    reject,
    reload: implementMock,
  };
}
