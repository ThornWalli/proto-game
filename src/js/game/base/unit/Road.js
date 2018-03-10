'use strict';

import Unit from '../Unit';

const TYPE = 'road';

class Road extends Unit {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = false;
        this.walkable = true;
    }
}

export {
    Road as
    default, TYPE
};
