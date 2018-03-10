'use strict';

/**
 * Verwaltet die Bots.
 */
export default class UnitModuleControl {
    constructor(app) {
        this._app = app;

        this._units = this._app.map.units
            .on('add', onAddUnit, this)
            .on('remove', onRemoveUnit, this);

        this._units = this._app.map.units.createFilteredCollection(unit => {
            setupUnit(unit, this._app);
            return unit;
        });
        // setTimeout(() => {
        //     this._units.items.forEach(unit => {
        //         moveUnit.bind(this)(unit, 0, -2).then(() => {
        //             return test_botMoveLoop.bind(this)(unit);
        //         });
        //     });
        // }, 1000);

    }

    /*
     * Properties
     */

    get units() {
        return this._units;
    }
}

function setupUnit(unit, app) {
    if (isModuleUnit(unit)) {
        console.log('?');
        unit.setupModule(app);
    }
}

function onAddUnit(unit) {
    setupUnit(unit, this._app);
}

function onRemoveUnit(unit) {
    if (isModuleUnit(unit)) {
        this._units.remove(unit, {
            passive: true
        });
    }
}

function isModuleUnit(unit) {
    return 'setupModule' in unit;
}
