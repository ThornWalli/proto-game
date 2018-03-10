'use strict';

import Unit from '../Unit';

const TYPE = 'resource';

class Resource extends Unit {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = true;
        this.walkable = false;
    }
}

export {
    Resource as
    default, TYPE
};
