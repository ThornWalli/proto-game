'use strict';

import Collection from './base/Collection';
import Events from './base/Events';

import Move from './base/action/Move';
import Collect from './base/action/Collect';

import SyncPromise from 'sync-p';

/**
 * Verwaltet die Aktionen der einzelnen Units.
 */
class UnitActions extends Events {
    constructor(app) {
        super();
        this._app = app;
        this._actionsByUnits = new Map();
        this._activeActions = new Collection();
        // this._activeActions.on('add', onAddAction, this);

        // this._app.timer.on('tick', () => {
        //     this._activeActions.forEach(action => {
        //         action.tick();
        //     });
        // });
    }

    add(unit, type) {
        if (isActionUnit(unit)) {
            let args = Array.from(arguments);
            args = args.splice(2, args.length);
            return new SyncPromise(resolve => {
                let action;
                if (typeof type === 'string') {
                    action = new(getAction(type))(unit, resolve);
                } else {
                    action = new type(unit, resolve);
                }
                if (args.length > 0) {
                    action.set.apply(action, args);
                }
                action.unit.once('setAction', () => {
                    action.on('stop', onActionStop, this);
                    action.on('start', onActionStart, this);
                }, this);
                if (!action.unit.setAction(action)) {
                    if (!this._actionsByUnits.has(unit.id)) {
                        this._actionsByUnits.set(unit.id, []);
                    }
                    this._actionsByUnits.get(unit.id).push(action);
                } else {
                    action.unit.activeAction.start();
                }

            });
        }
    }
    log(text) {
        this._app.logger.log('action', 'Action:' + text);
    }

    /*
     * Properties
     */

    get actions() {
        return this._actions;
    }

    get units() {
        return this._units;
    }

    get activeActions() {
        return this._activeActions;
    }
}


function onActionStart(action) {
    // console.log('UnitActions', 'Action Begin');
    this._activeActions.add(action);
}

function onActionStop(action) {
    // console.log('UnitActions', 'Action Stop', action.type, Date.now());
    action.callback(action);
    const id = action.unit.id;
    this._activeActions.remove(action);

    if (this._actionsByUnits.has(id) && action) {
        action = this._actionsByUnits.get(id).shift();
        action.unit.setAction(action);
    }
}


function isActionUnit(unit) {
    return 'setAction' in unit;
}


const actions = {
    move: Move,
    collect: Collect
};

function getAction(type) {
    return actions[type];
}

export {
    UnitActions as
    default, getAction
};
