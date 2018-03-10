'use strict';

import Position from '../base/Position';
import {
    TYPE as TYPE_WALL
} from '../base/unit/Wall';
import {
    TYPE as TYPE_FIGURE
} from '../base/unit/Figure';
import {
    TYPE as TYPE_BOT
} from '../base/unit/Bot';
import {
    TYPE as TYPE_ROAD
} from '../base/unit/Road';
import {
    TYPE as TYPE_DEFAULT
} from '../base/Unit';

import {
    TYPE as TYPE_STORE
} from '../base/unit/Store';
import {
    TYPE as TYPE_RESOURCE
} from '../base/unit/Resource';

import {
    TYPE as TYPE_HOME
} from '../base/unit/store/Home';
import {
    TYPE as TYPE_HARVESTER
} from '../base/unit/bot/Harvester';

const TYPE_PATHFINDER_PATH = 'pathfinderPath';

export default class DrawGrid {

    constructor(display) {
        this._display = display;
        this._context = this._display.context;

        this._tmpBackgroundCanvas = document.createElement('canvas');
        this._tmpBackgroundContext = this._tmpBackgroundCanvas.getContext('2d');
    }

    get map() {
        return this._display.app.map;
    }

    get visibleDimension() {
        return this._display.visibleDimension;
    }

    drawBackground(offset, force) {
        const visibleSize = this._display.visibleSize;
        if (!this._hasTmpBackground || force) {
            this._context.beginPath();
            for (let y = 0; y < visibleSize.height; y++) {
                for (let x = 0; x < visibleSize.width; x++) {
                    this.drawCell(
                        new Position(this._display.visibleBounds.min.x + x, this._display.visibleBounds.min.y + y),
                        offset
                    );
                }
            }
            this._context.stroke();
            this.createTmpBackground();
        }
        this._context.drawImage(this._tmpBackgroundCanvas, 0, 0);
    }

    createTmpBackground() {
        this._tmpBackgroundCanvas.width = this.visibleDimension.width;
        this._tmpBackgroundCanvas.height = this.visibleDimension.height;
        this._tmpBackgroundContext.clearRect(0, 0, this.visibleDimension.width, this.visibleDimension.height);
        this._tmpBackgroundContext.drawImage(this._context.canvas, 0, 0);
        this._hasTmpBackground = true;
    }

    drawUnits(offset) {
        this._context.beginPath();
        this.map.units.forEach(unit => {
            // type = ;unit.isSelected ? CELL_TYPES.UNIT_SELECTED : CELL_TYPES.UNIT;
            this.drawCell(unit.position, offset, unit.type, unit.isSelected);
            if (!!unit.activeAction && unit.activeAction.type === 'move') {
                unit.activeAction.moveData.path.forEach(position => {
                    this.drawCell(position, offset, TYPE_PATHFINDER_PATH);
                });
            }
        });
        this._context.stroke();
    }

    render(force) {

        this._context.clearRect(0, 0, this.visibleDimension.width, this.visibleDimension.height);
        const offset = this._display.getVisibleOffset();
        offset.clampValuesLocal(0, 0);
        // offset.setValuesLocal(0,0)
        this.drawBackground(offset, force);

        this.drawUnits(offset);
    }

    intersectMap(position) {
        return this._display.visibleBounds.intersect(position);
    }



    drawCell(position, offset, type = TYPE_DEFAULT, selected = false) {
        if (this.intersectMap(position)) {
            const min = this._display.visibleBounds.min;
            let x = position.x,
                y = position.y;

            if (selected) {
                this._context.fillStyle = CELL_STYLES[type].selected.fill;
                this._context.strokeStyle = CELL_STYLES[type].selected.stroke;
            } else {
                this._context.fillStyle = CELL_STYLES[type].fill;
                this._context.strokeStyle = CELL_STYLES[type].stroke;
            }

            x = offset.x + (x - min.x) * this.map.cellSize.width;
            y = offset.y + (y - min.y) * this.map.cellSize.height;
            this._context.fillRect(x, y, this.map.cellSize.width, this.map.cellSize.height);

            this._context.rect(x - 0.5, y - 0.5, this.map.cellSize.width, this.map.cellSize.height);


            if (type !== 'default') {
                this._context.fillStyle = 'red';
                this._context.font = "8px sans-serif";
                const text = `${type[0].toUpperCase()}${type[1].toUpperCase()}`;
                this._context.fillText(text, x + 2, y + 8);
            }


        }
    }
}

// #444444
// #cccccc
// #fea3aa
// #f8b88b
// #faf884
// #bebd73
// #baed91
// #b2cefe
// #f2a2e8
// CELL_STYLES
// #181818
// #ffffff
// #fff85b
// #52d8ff
// #ff5252

const CELL_STYLES = {};

CELL_STYLES[TYPE_DEFAULT] = {
    fill: '#444',
    stroke: '#000000'
};
CELL_STYLES[TYPE_FIGURE] = {
    fill: '#faf884',
    stroke: '#000000',
    selected: {
        fill: 'rgb(5, 7, 123)',
        stroke: '#000000'
    }
};
CELL_STYLES[TYPE_WALL] = {
    fill: '#baed91',
    stroke: '#000000'
};
CELL_STYLES[TYPE_BOT] = {
    fill: '#bebd73',
    stroke: '#000000'
};
CELL_STYLES[TYPE_ROAD] = {
    fill: '#333333',
    stroke: '#000000'
};

CELL_STYLES[TYPE_PATHFINDER_PATH] = {
    fill: 'rgba(178, 206, 254, 0.1)',
    stroke: '#000000'
};



CELL_STYLES[TYPE_STORE] = {
    fill: '#FFFFFF',
    stroke: '#000000'
};

CELL_STYLES[TYPE_RESOURCE] = {
    fill: '#52d8ff',
    stroke: '#000000'
};


CELL_STYLES[TYPE_HARVESTER] = {
    fill: '#f8b88b',
    stroke: '#000000',
    selected: {
        fill: 'rgb(5, 7, 123)',
        stroke: '#000000'
    }
};

CELL_STYLES[TYPE_HOME] = {
    fill: '#FFFFFF',
    stroke: '#000000',
    selected: {
        fill: 'rgb(5, 7, 123)',
        stroke: '#000000'
    }
};
