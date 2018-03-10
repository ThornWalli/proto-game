'use strict';

import Dialog from '../Dialog';

import Template from '../../../base/Template';
import itemTmpl from './tmpl/unitOverviewItem.hbs';
import selectOptionTmpl from './tmpl/unitOverviewSelectOption.hbs';

import UnitOverview from '../../../game/components/UnitOverview';

import {
    TYPES
} from '../../../game/base/UnitTypes';


export default Dialog.extend({

    itemTmpl: new Template(itemTmpl),
    selectOptionTmpl: new Template(selectOptionTmpl),

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {
            /**
             * UnitOverview
             * @type {UnitOverview}
             */
            unitOverview: {
                type: 'object',
                required: false
            },

            unitType: {
                type: 'string',
                required: true,
                default: 'unit'
            }
        }
    }),

    events: Object.assign(Dialog.prototype.events, {
        'change [data-hook="unitOverviewUnitTypeSelect"]': onChangeUnitType
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
        this.elements.list = this.queryByHook('unitOverviewItems');
        this.elements.unitTypes = this.queryByHook('unitOverviewUnitTypeSelect');

        this.elements.items = [];
        this.model.once('change:unitOverview', () => this.renderItems());
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

    renderItems() {
        renderList.bind(this)();
        this.elements.unitTypes.innerHTML = '';
        Object.keys(TYPES).forEach(id => this.elements.unitTypes.appendChild(this.selectOptionTmpl.toFragment(id)));
    }

});

function renderList() {
        this.elements.list.innerHTML = '';
        this.model.unitOverview.getUnitsByType(this.model.unitType).forEach(botUnit => {
            this.elements.list.appendChild(createItem(botUnit, botUnit.activeAction, this.itemTmpl));
            this.elements.items[botUnit.id] = this.elements.list.lastElementChild;
            botUnit.on('setAction', onBotUnitSetAction, this);
        });

}

function onBotUnitSetAction(action, unit) {
    if (action) {
        action.once('complete', () => {
            replaceItem.bind(this)(unit);
        });
    }
    replaceItem.bind(this)(unit, action);
}

function replaceItem(unit, action) {
    this.elements.list.append(createItem(unit, action, this.itemTmpl));
    const node = this.elements.list.lastElementChild;
    this.elements.list.replaceChild(node, this.elements.items[unit.id]);
    this.elements.items[unit.id] = node;
}

function createItem(unit, action, tmpl) {
    if (action) {
        action = action.toString();
    } else {
        action = '';
    }
    return tmpl.toFragment({
        id: unit.id,
        name: unit.type,
        action
    });
}

function onChangeTargeApp(model, app) {
    app.ready.then(() => this.model.unitOverview = new UnitOverview(app));

}


function onChangeUnitType(e) {
    this.model.unitType = e.target.value;
    renderList.bind(this)();
}
