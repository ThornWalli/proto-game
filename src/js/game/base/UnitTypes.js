'use strict';

import {
    default as Unit,
    TYPE as TYPE_UNIT
} from './Unit';
import {
    default as Wall,
    TYPE as TYPE_WALL
} from './unit/Wall';
import {
    default as Figure,
    TYPE as TYPE_FIGURE
} from './unit/Figure';
import {
    default as Bot,
    TYPE as TYPE_BOT
} from './unit/Bot';
import {
    default as Road,
    TYPE as TYPE_ROAD
} from './unit/Road';
import {
    default as Resource,
    TYPE as TYPE_RESOURCE
} from './unit/Resource';
import {
    default as Home,
    TYPE as TYPE_HOME
} from './unit/store/Home';
import {
    default as Harvester,
    TYPE as TYPE_HARVESTER
} from './unit/bot/Harvester';

class UnitTypes {
    constructor() {
        this.units = [];
    }
}

const TYPES = {};
TYPES[TYPE_UNIT] = Unit;
TYPES[TYPE_WALL] = Wall;
TYPES[TYPE_FIGURE] = Figure;
TYPES[TYPE_BOT] = Bot;
TYPES[TYPE_ROAD] = Road;
TYPES[TYPE_RESOURCE] = Resource;
TYPES[TYPE_HOME] = Home;
TYPES[TYPE_HARVESTER] = Harvester;

export {
    TYPES,
    UnitTypes as
    default
};
