'use strict';

import Store from '../Store';

import HomeModule from '../../../modules/unit/Home';

const TYPE = 'home';

class Home extends Store {
    constructor() {
        super();
        this.setType(TYPE);
        this.selectable = true;
        this.walkable = false;
        this.setModule(HomeModule);
    }
}

export {
    Home as
    default, TYPE
};
