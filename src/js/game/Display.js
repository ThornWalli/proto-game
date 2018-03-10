'use strict';

import Events from './base/Events';
import Size from './base/Size';
import Position from './base/Position';
import PositionBounds from './base/PositionBounds';

import DrawGrid from './display/DrawGrid';

import RenderTimer from './base/RenderTimer';

export default class Display extends Events {
    constructor(app, canvas, options) {
        super();
        this._app = app;
        this._canvas = canvas;
        this._context = this._canvas.getContext("2d");
        this._visibleDimension = new Size();
        this._position = new Position(0, 0);
        this._visibleSize = new Size(3, 3);
        this._visibleBounds = new PositionBounds();

        this._positionClamp = new Position();

        this._renderTimer = new RenderTimer();
        this._renderTimer.start();

        this.setup(options);

        // Events
        app.inputControl
            .on('keydown', Display.onKeyDown, this);

        this.setPosition(0, 0);
    }
    setup(options) {


        // Prepare Canvas
        if (options.dimension && options.dimension instanceof Size) {
            this._visibleDimension.setLocal(options.dimension);
            this._canvas.width = this._visibleDimension.width;
            this._canvas.height = this._visibleDimension.height;
        } else {
            throw new Error('Needed property size as Size Object');
        }
        this._app.map.on('reset', () => {
            this.refresh();
        });

        this.setMatrixSizes(options.visibleSize);

        setupDrawGrid(this);

        this.showInfo();

    }

    /*
     * Functions
     */

    showInfo() {
        const map = this.app.map;
        const positionBounds = map.size.subtract(this._visibleSize.divideValues(2, 2)).divideValuesLocal(2, 2);
        console.log([
            'Display Info',
            `Matrix Size:\t${map.size.width} x ${map.size.height}`,
            `Cell Size:\t\t${map.cellSize.width} x ${map.cellSize.height}`,
            `Visible Size:\t${this._visibleSize.width} x ${this._visibleSize.height}`,
            `Position Bounds\t${-positionBounds.x} x ${-positionBounds.y} | ${positionBounds.x} x ${positionBounds.y}`
        ].join('\n'));
    }

    setMatrixSizes(visibleSize) {
        if (visibleSize && visibleSize instanceof Size) {
            this._visibleSize.setLocal(visibleSize);
        } else {
            this._visibleSize.setLocal(this.getMaxVisibleCells());
        }
        this._positionClamp.setLocal(this.app.map.size).subtractLocal(this._visibleSize).divideValuesLocal(2, 2);
    }

    reset() {
        this.setMatrixSizes();
        this.setPosition(this.position.setValuesLocal(0, 0));
        this._drawGrid.render(true);
        this.trigger('reset');
    }
    refresh() {
        this.trigger('refresh');
    }


    isIntersectedPosition(position) {
        return this.visibleBounds.intersect(position);
    }

    getMaxVisibleCells() {
        const map = this.app.map;
        let width = map.size.width * map.cellSize.width;
        if (width > this.visibleDimension.width) {
            width = this.visibleDimension.width;
        }
        width /= map.cellSize.width;
        let height = map.size.height * map.cellSize.height;
        if (height > this.visibleDimension.height) {
            height = this.visibleDimension.height;
        }
        height /= map.cellSize.height;
        return new Size(width, height);
    }

    getOffset() {
        const visibleOffset = this.getVisibleOffset().clampValuesLocal(0, 0);
        let offset = this._visibleBounds.min.multiply(this.app.map.cellSize).subtractLocal(visibleOffset);
        return offset;
    }

    getVisibleOffset() {
        const size = this._visibleSize.width >= this.app.map.size.width ? this.app.map.size : this._visibleSize;
        return this._visibleDimension.subtract(size.multiply(this.app.map.cellSize)).divideValues(2, 2);
    }

    setPosition(position, y) {
        if (y !== undefined) {
            position = new Position(position, y);
        }
        // console.log('clamp',
        //     this._positionClamp.multiplyValues(-1, -1),
        //     this._positionClamp)
        this.position.setLocal(position)
            .clampLocal(
                this._positionClamp.multiplyValues(-1, -1),
                this._positionClamp
            );

        this._visibleBounds.min.setLocal(
                this.position)
            .addLocal(this.app.map.size
                .subtract(this._visibleSize)
                .divideValuesLocal(2, 2));
        this._visibleBounds.max.setLocal(this._visibleBounds.min.add(this._visibleSize).subtractValuesLocal(1, 1));

        this._drawGrid.render();

        this.refresh();

    }

    /*
     * Properties
     */

    get app() {
        return this._app;
    }
    get renderTimer() {
        return this._renderTimer;
    }
    get position() {
        return this._position;
    }
    get visibleBounds() {
        return this._visibleBounds;
    }
    get visibleSize() {
        return this._visibleSize;
    }
    get visibleDimension() {
        return this._visibleDimension;
    }

    get dimension() {
        return new this.map.size.multiply(this.map.cellSize);
    }
    get context() {
        return this._context;
    }

    /*
     * Events
     */


    static onKeyDown(event) {
        const position = this.position;
        switch (event.code) {
            case event.KEY_TYPES.ARROW_LEFT:
                this.setPosition(position.x - 1, position.y);
                break;
            case event.KEY_TYPES.ARROW_UP:
                this.setPosition(position.x, position.y - 1);
                break;
            case event.KEY_TYPES.ARROW_RIGHT:
                this.setPosition(position.x + 1, position.y);
                break;
            case event.KEY_TYPES.ARROW_BOTTOM:
                this.setPosition(position.x, position.y + 1);
                break;
        }
    }
}



// Debug

function setupDrawGrid(display) {
    display._drawGrid = new DrawGrid(display);
    display.app.map.on('refresh', function() {
        display._renderTimer.add(this.render.bind(this),'drawGrid');
    }, display._drawGrid);
}
