"use strict";

import {
    touchEvent
} from '../../utils/dom';

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';
import viewport from 'gp-module-viewport';

import Test_PathFinding from '../../game/test/PathFinding';

import {
    App,
    Size,
    InputKeyEvent,
    InputPointerEvent,
    Position
} from '../../game/App';

class Events_Dom {
    static onContextMenu(event) {
        event.preventDefault();
    }
    static onChangeTypeSelect(event) {
        this.model.type = event.target.value;
    }

    static onPointerDown(event) {
        touchEvent(this, event);
        event.preventDefault();
        this.model.app.onPointerDown(this.getPointerEvent(event));
        $(document)
            .on(`mouseup.${this.cid} touchend.${this.cid}`, Events_Dom.onPointerUp.bind(this))
            .on(`mousemove.${this.cid} touchmove.${this.cid}`, Events_Dom.onPointerMove.bind(this));
    }
    static onPointerUp(event) {
        touchEvent(this, event);
        this.model.app.onPointerUp(this.getPointerEvent(event));
        $(document)
            .off(`mouseup.${this.cid} touchend.${this.cid}`)
            .off(`mousemove.${this.cid} touchmove.${this.cid}`);
    }
    static onPointerMove(event) {
        touchEvent(this, event);
        this.model.app.onPointerMove(this.getPointerEvent(event));
    }

    static onKeyDown(event) {
        this.model.app.onKeyDown(this.getKeyEvent(event));
    }
    static onKeyUp(event) {
        this.model.app.onKeyUp(this.getKeyEvent(event));
    }

}

export default Controller.extend({

    modelConstructor: DomModel.extend({

        session: {
            app: {
                type: 'object',
                required: false
            },
            offset: {
                type: 'object',
                required: true,
                default () {
                    return new Position();
                }
            }
        }

    }),

    events: {
        'contextmenu canvas': Events_Dom.onContextMenu,
        'touchstart canvas': Events_Dom.onPointerDown,
        'mousedown canvas': Events_Dom.onPointerDown,
    },

    bindings: {},

    initialize() {
        Controller.prototype.initialize.apply(this, arguments);

        this.elements = {
            canvas: this.queryByHook('appCanvas')
        };
        viewport.on(viewport.EVENT_TYPES.INIT, onViewportInit.bind(this));

        $(document)
            .on(`keydown.${this.cid}`, Events_Dom.onKeyDown.bind(this))
            .on(`keyup.${this.cid}`, Events_Dom.onKeyUp.bind(this));

    },
    getKeyEvent(event) {
        event = new InputKeyEvent(event);
        return event;
    },
    getPointerEvent(event) {
        event = new InputPointerEvent(event);
        event.x -= this.model.offset.x;
        event.y -= this.model.offset.y;
        return event;
    },

    getOptions() {
        return {
            dimension: new Size(640, 480),
            size: new Size(8, 8),
            // visibleSize: new Size(4, 4),
            test: Test_PathFinding
        };
    }


});


function onViewportInit() {
    this.model.app = new App(this.elements.canvas, this.getOptions());
    viewport.on(viewport.EVENT_TYPES.RESIZE, onViewportResize.bind(this));
    global.requestAnimationFrame(onViewportResize.bind(this));
}

function onViewportResize() {

    console.log('App Offset:', this.model.offset);
    this.model.offset.setValuesLocal(parseInt((this.el.offsetWidth - this.elements.canvas.offsetWidth) / 2), parseInt((this.el.offsetHeight - this.elements.canvas.offsetHeight) / 2));
    this.elements.canvas.style.left = `${this.model.offset.x}px`;
    this.elements.canvas.style.top = `${this.model.offset.y}px`;

    this.model.app.refresh();
}
