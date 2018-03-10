'use strict';

import LogCollection from './base/collection/Log';
import Log from './base/Log';

/**
 * Verwaltet die Logs.
 */
export default class Logger {
    constructor(app) {
        this._app = app;
        this._logs = new LogCollection();
    }

    log(type, text) {
        this._logs.add(new Log(type, text));
    }

    get logs() {
        return this._logs;
    }

}
