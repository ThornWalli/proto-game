'use strict';

// Import base-types
import Events from './base/Events';
import Size from './base/Size';
import Position from './base/Position';
import InputKeyEvent from './base/InputKeyEvent';
import InputPointerEvent from './base/InputPointerEvent';

import Map from './Map';

import Logger from './Logger';
import UnitSelect from './UnitSelect';
import UnitActions from './UnitActions';
import BotControl from './BotControl';
import UnitModuleControl from './UnitModuleControl';

import Display from './Display';
import InputControl from './InputControl';

import MapLoader from './MapLoader';

import history from 'gp-module-history';

import SyncPromise from 'sync-p';

// Units

import './base/UnitTypes';

class App extends Events {
    constructor(canvas, options) {
        super();

        // Properties
        this._map = null;
        this._display = null;
        this._inputControl = null;

        this._ready = this.setup(canvas, options);
    }

    setup(canvas, options) {

        return (new SyncPromise(resolve => {
            console.log('App Options:', options, this);
            global.app = this;
            this._inputControl = new InputControl(this);

            if (options.test) {
                this._activeTest = new options.test(this);
                options.size = this._activeTest.size || options.size;
                options.visibleSize = this._activeTest.visibleSize || options.visibleSize;
                console.log('App Test', this._activeTest);
            }

            // Prepare Map
            if (options.size && options.size instanceof Size) {
                this._map = new Map(options.size);
            } else {
                throw new Error('Needed property size as Size Object');
            }

            this._display = new Display(this, canvas, options);

            if (this._activeTest) {
                this._activeTest.start();
            }

            const mapUri = getGETParam('map-uri');
            if (mapUri) {
                this._mapLoader = new MapLoader(this);
                this._mapLoader.load(mapUri).then(resolve);
            } else {
                resolve();
            }
        })).then(() => {
            this._logger = new Logger(this);
            if (!this._activeTest || this._activeTest && !this._activeTest.disableLogic) {
                this._unitSelect = new UnitSelect(this);
                this._unitActions = new UnitActions(this);
                this._botControl = new BotControl(this);
                this._unitModuleControl = new UnitModuleControl(this);
            }
        });
    }

    /*
     * Functions
     */

    refresh() {}



    readMapData(data) {
        data = getDefaultMapData(data);
        this.map.reset(new Size(data.matrix), data.units);
        this.display.reset();
    }


    /*
     * Properties
     */

    get ready() {
        return this._ready;
    }

    get display() {
        return this._display;
    }
    get inputControl() {
        return this._inputControl;
    }
    get canvas() {
        return this._canvas;
    }
    get map() {
        return this._map;
    }
    get dimension() {
        return this._dimension;
    }
    get activeTest() {
        return this._activeTest;
    }

    get logger() {
        return this._logger;
    }
    get unitSelect() {
        return this._unitSelect;
    }
    get unitActions() {
        return this._unitActions;
    }
    get botControl() {
        return this._botControl;
    }

    /*
     * Events
     */

    // Pointer
    onPointerDown(event) {
        const offset = this.display.getOffset();
        event.position = new Position(event.x, event.y);
        event.matrixPosition = new Position(
            Math.floor((event.x + offset.x) / this.map.cellSize.width),
            Math.floor((event.y + offset.y) / this.map.cellSize.height)
        );
        return this._inputControl.pointerDown(event);
    }
    onPointerUp(event) {
        return this._inputControl.pointerUp(event);
    }
    onPointerMove(event) {
        return this._inputControl.pointerMove(event);
    }
    // Keyboard
    onKeyDown(event) {
        return this._inputControl.keyDown(event);
    }
    onKeyUp(event) {
        return this._inputControl.keyUp(event);
    }


}


function getGETParam(name) {
    if (history.registry.get(name)) {
        return history.registry.get(name).value;
    }
    return null;
}

function getDefaultMapData({
    matrix = new Size(),
    units = []
}) {
    return {
        matrix,
        units
    };
}

// Export

export {
    App as
    default,
    App,
    Size,
    Position,
    InputKeyEvent,
    InputPointerEvent,
    getDefaultMapData
};
