import { isUndefined } from 'lodash';
// Make a GET call with id
import fetch from './fetch';
// Make a GET call
import fetchAll from './fetch-all';
// Make a call to the local database or GET call to the backend server
import findOrFetch from './find-or-fetch';
// Call findOrFetch on the local database, create entity if return value is null
import findOrCreate from './find-or-create';
// Make a POST cal
import apiPath from './api-path';
// Make a POST cal
import save from './save';
// Make a PATCH call
import update from './update';
// Make a PUT cal
import replace from './replace';
// Make a DELETE cal
import destroy from './destroy';
// Make a POST cal
import listKey from './list-key';
// Make a POST cal
import routeName from './route-name';
import { routeURL, showURL, editURL } from './route-url';
// Make a POST cal
import pickKeys from './pick-keys';

/* eslint-disable no-param-reassign */
export default function install({ Model }, { client, useCache = true } = {}) {
  // REST Client needs to be installed to make http requests
  if (isUndefined(client)) {
    throw new Error('HTTP-Client is not defined');
  }

  Model.client = client;
  Model.useCache = useCache;

  Model.fetch = fetch;
  Model.fetchAll = fetchAll;
  Model.findOrFetch = findOrFetch;
  Model.findOrCreate = findOrCreate;

  Model.prototype.client = client;
  Model.prototype.save = save;
  Model.prototype.update = update;
  Model.prototype.replace = replace;
  Model.prototype.destroy = destroy;
  Model.prototype.listKey = listKey;
  Model.prototype.apiPath = apiPath;
  Model.prototype.routeName = routeName;
  Model.prototype.routeURL = routeURL;
  Model.prototype.showURL = showURL;
  Model.prototype.editURL = editURL;
  Model.prototype.pickKeys = pickKeys;
}
/* eslint-enable no-param-reassign */
