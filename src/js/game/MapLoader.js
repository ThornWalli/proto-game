'use strict';

import xhr from 'xhr';
import SyncPromise from 'sync-p';
export default class MapLoader {
    constructor(app) {
        this._app = app;
    }
    load(url) {
        return new SyncPromise(resolve => {
            xhr({
                method: 'get',
                uri: url
            }, (err, resp, body) => {
                if (err) {
                    throw err;
                }
                this._app.readMapData(JSON.parse(body));
                resolve();
            });
        });
    }
}
