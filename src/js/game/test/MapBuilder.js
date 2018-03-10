'use strict';

import Size from '../base/Size';
import Test from '../Test';

import Wall from '../base/unit/Wall';

export default class MapBuilder extends Test {
    constructor(app) {
        super(app);
        // Events
        app.inputControl.on('pointerdown', onPointerDown, this);
        this.unitType = Wall;
    }

    /*
     * Functions
     */

    start() {
        // Create Units
        // createUnits(this.units);
        this.map.refresh();
    }

    /*
     * Properties
     */

    get size() {
        return new Size(48, 48);
    }
    get visibleSize() {
        return null;
    }
    get disableLogic() {
        return true;
    }
}


// function createUnits(units) {
//
//     createUnitWall(units);
//
// }

// function createUnitWall(units) {
//
//     let unit;
//     const ignore = [2];
//     for (let i = 0; i < 7; i++) {
//         if (ignore.indexOf(i) === -1) {
//             unit = new Wall();
//             unit.position.setValuesLocal(3, i);
//             units.add(unit, {
//                 silence: true
//             });
//         }
//     }
//
//     for (let i = 0; i < 2; i++) {
//         unit = new Wall();
//         unit.position.setValuesLocal(4 + i, 4);
//         units.add(unit, {
//             silence: true
//         });
//     }
//
// }

// Events
//
// Pointer

function onPointerDown(event) {
    if (this.display.isIntersectedPosition(event.matrixPosition)) {
        const x = event.matrixPosition.x,
            y = event.matrixPosition.y;
        let unit = this.map.getUnitByCell(x, y);

        console.log('MapBuilder', x, y, unit, this, this.app.unitType);
        if (unit) {
            this.units.remove(unit);
        } else {
            const unit = new(this.unitType)();
            unit.position.setValuesLocal(x, y);
            this.units.add(unit, {
                silence: false
            });
        }
        this.map.refresh();
    }
}
