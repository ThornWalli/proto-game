'use strict';

import Collection from '../Collection';

export default class UnitCollection extends Collection {

    /*
     * Functions
     */

    add(unit) {
        unit.on('remove', onUnitRemove, this);
        unit.on('change.position', onUnitChangePosition, this);
        Collection.prototype.add.apply(this, arguments);
    }

    remove(unit, options = {}) {
        unit.off('change.position', onUnitChangePosition, this);
        Collection.prototype.remove.apply(this, arguments);
        if (!options.passive) {
            unit.destroy();
        }
    }

    getByType(type) {
        return this.filter(unit => {
            if (unit.type === type) {
                return type;
            }
        });
    }

    /*
     * Properties
     */

    get class() {
        return UnitCollection;
    }
}

function onUnitRemove(unit) {
    this.remove(unit);
}

function onUnitChangePosition(position, unit) {
    this.trigger('change.unit.position', position, unit);
}
