'use strict';

import Bot from '../Bot';

import HarvesterModule from '../../../modules/unit/Harvester';

const TYPE = 'harvester';

class Harvester extends Bot {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = false;
        this.setModule(HarvesterModule);
//
//         setTimeout(() => {
//
// //             this.app.unitActions.add(unit, 'move', moveData);
// // this.move(this.position.subtractValues(10,0));
//
//         }, 3000);
    }
}

export {
    Harvester as
    default, TYPE
};
