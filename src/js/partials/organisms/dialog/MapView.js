'use strict';

import {
    touchEvent
} from '../../../utils/dom';

import Dialog from '../Dialog';
import Position from '../../../game/base/Position';
import PositionBounds from '../../../game/base/PositionBounds';

import MapView from '../../../game/components/MapView';
import InputPointerEvent from '../../../game/base/InputPointerEvent';

class Events_Dom {
    static onChangeTypeSelect(event) {
        this.model.type = event.target.value;
    }

    static onPointerDown() {
        $(document)
            .on(`mouseup.${this.cid} touchend.${this.cid}`, Events_Dom.onPointerUp.bind(this))
            .on(`mousemove.${this.cid} touchmove.${this.cid}`, Events_Dom.onPointerMove.bind(this));
    }
    static onPointerUp() {
        $(document)
            .off(`mouseup.${this.cid} touchend.${this.cid}`)
            .off(`mousemove.${this.cid} touchmove.${this.cid}`);
    }
    static onPointerMove(event) {
        touchEvent(this, event);
        if (this.model.canvasBounds.intersect(event.clientX, event.clientY)) {
            event = this.getPointerEvent(event);
            // this.model.position.setValuesLocal(event.x - this.model.canvasBounds.width / 2, event.y - this.model.canvasBounds.height / 2);
            this.model.position.setValuesLocal(event.x, event.y).divideValuesLocal(this.model.canvasBounds.width, this.model.canvasBounds.height).subtractValuesLocal(0.5, 0.5);
            this.model.mapView.setPosition(this.model.position);
        }
    }

    static onContextMenu(event) {
        event.preventDefault();
    }

}

export default Dialog.extend({

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {
            /**
             * Canvas Offset
             * @type {Position}
             */
            canvasBounds: {
                type: 'object',
                required: true,
                default () {
                    return new PositionBounds();
                }
            },
            /**
             * Selection position
             * @type {Position}
             */
            position: {
                type: 'object',
                required: true,
                default () {
                    return new Position();
                }
            },
            /**
             * MapView
             * @type {MapView}
             */
            mapView: {
                type: 'object',
                required: false
            }
        }
    }),

    events: Object.assign(Dialog.prototype.events, {
        'contextmenu canvas': Events_Dom.onContextMenu,
        'touchstart canvas': Events_Dom.onPointerDown,
        'mousedown canvas': Events_Dom.onPointerDown,
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
        this.elements.canvas = this.queryByHook('mapViewCanvas');
    },

    onViewportInit() {
        if (this.targetModel) {
            if (this.targetModel.app) {
                onChangeTargeApp.bind(this)(this.targetModel, this.targetModel.app);
            } else {
                this.targetModel.once('change:app', onChangeTargeApp, this);
            }

        } else {
            throw new Error('TargetModel is undefined…');
        }
        Dialog.prototype.onViewportInit.apply(this, arguments);
    },

    onViewportResize() {
        Dialog.prototype.onViewportResize.apply(this, arguments);
        this.model.mapView.refresh();
        const clientRect = this.elements.canvas.getBoundingClientRect();
        this.model.canvasBounds.min.setValuesLocal(clientRect.left, clientRect.top);
        this.model.canvasBounds.max.setValuesLocal(this.model.canvasBounds.min.x + clientRect.width, this.model.canvasBounds.min.y + clientRect.height);
    },

    getPointerEvent(event) {
        event = new InputPointerEvent(event);
        event.x -= this.model.canvasBounds.min.x;
        event.y -= this.model.canvasBounds.min.y;
        return event;
    }


});

function onChangeTargeApp(model, app) {
    this.model.mapView = new MapView(app, this.elements.canvas);
}
