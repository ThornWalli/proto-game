'use strict';

import Unit from '../Unit';

const TYPE = 'wall';

class Wall extends Unit {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = true;
        this.walkable = false;

    }
}

export {
    Wall as
    default, TYPE
};
