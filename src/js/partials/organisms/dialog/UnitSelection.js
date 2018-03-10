'use strict';

import Dialog from '../Dialog';

import Template from '../../../base/Template';
import itemTmpl from './tmpl/unitSelectionItem.hbs';

import {
    TYPES
} from '../../../game/base/UnitTypes';

export default Dialog.extend({

    itemTmpl: new Template(itemTmpl),

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {
            selectedId: {
                type: 'string',
                required: false
            }
        }
    }),

    events: Object.assign(Dialog.prototype.events, {
        'click li': onClickItem
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
        this.elements.list = this.queryByHook('unitSelectionItems');
        this.model.on('change:selectedId', onChangeSelectedId, this);
        this.renderItems();
    },

    renderItems() {
        this.elements.list.innerHTML = '';
        Object.keys(TYPES).forEach(id => this.elements.list.appendChild(this.itemTmpl.toFragment({
            id,
            name: id
        })));
    }

});

// Model Events
function onChangeSelectedId(model, selectedId) {
    if (this.elements.list.querySelector(`[data-id].js--selected`)) {
        this.elements.list.querySelector(`[data-id].js--selected`).classList.remove('js--selected');
    }
    this.elements.list.querySelector(`[data-id="${selectedId}"]`).classList.add('js--selected');
    this.targetModel.app.activeTest.unitType = TYPES[selectedId];
}
// Dom Events
function onClickItem(event) {
    this.model.selectedId = event.delegateTarget.dataset.id;
}
