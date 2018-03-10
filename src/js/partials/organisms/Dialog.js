"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';
import viewport from 'gp-module-viewport';

export default Controller.extend({

    modelConstructor: DomModel.extend({

        session: {

            isHorizontalCenterPositioning: {
                type: 'boolean',
                required: true
            },
            isVerticalCenterPositioning: {
                type: 'boolean',
                required: true
            }


        }

    }),

    events: {},
    bindings: {},

    initialize() {
        Controller.prototype.initialize.apply(this, arguments);
        this.model.isHorizontalCenterPositioning = this.el.classList.contains('dialog-position--horizontal-center');
        this.model.isVerticalCenterPositioning = this.el.classList.contains('dialog-position--vertical-center');
        this.elements = {};
        viewport.on(viewport.EVENT_TYPES.INIT, this.onViewportInit.bind(this));

    },

    onViewportInit() {
        viewport.on(viewport.EVENT_TYPES.RESIZE, this.onViewportResize.bind(this));
        this.onViewportResize.bind(this)();
    },

    onViewportResize() {
        if (this.model.isHorizontalCenterPositioning || this.model.isVerticalCenterPositioning) {
            this.setPosition();
        }
    },

    setPosition() {
        this.el.style.left = null;
        this.el.style.top = null;
        this.el.style.transform = null;
        if (!this.anim) {

            this.anim = setTimeout(() => {
                global.requestAnimationFrame(() => {
                    var position = this.el.getBoundingClientRect();
                    global.requestAnimationFrame(() => {
                        if (this.model.isHorizontalCenterPositioning) {
                            this.el.style.left = `${parseInt(position.left)}px`;
                        }
                        if (this.model.isVerticalCenterPositioning) {
                            this.el.style.top = `${parseInt(position.top)}px`;
                        }
                        this.el.style.transform = `none`;
                        this.anim = null;
                    });
                });
            }, 500);
        }
    }


});
