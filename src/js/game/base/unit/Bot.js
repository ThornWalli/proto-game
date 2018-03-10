'use strict';

import Figure from './Figure';
import Module from './abstract/Module';

const TYPE = 'bot';

class Bot extends Module(Figure) {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = false;
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
    Bot as
    default, TYPE
};
