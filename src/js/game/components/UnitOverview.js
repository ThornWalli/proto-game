'use strict';


export default class UnitOverview {
    constructor(app) {
        this._app = app;
    }

    getBots() {
        return this._app.botControl.units;
    }
    getUnits() {
        return this._app.map.units;
        // .filter(unit => {
        //     if (true) {
        //         return unit;
        //     }
        // });
    }
    getUnitsByType(type) {
        return this._app.map.units.filter(unit => {
            if (unit.isType(type)) {
                return unit;
            }
        });
    }

}
