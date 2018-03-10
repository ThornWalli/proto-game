'use strict';

export default class Module {
    constructor(app, unit) {
        this._app = app;
        this._unit = unit;
    }
    log(text) {
        this._app.logger.log('module', text);
    }


    get app() {
        return this._app;
    }
    get unit() {
        return this._unit;
    }
}
