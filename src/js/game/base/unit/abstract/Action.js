'use strict';

/**
 * Abstract Class Action
 */
const Action = Unit => class extends Unit {
    constructor() {
        super();
        this._activeAction = null;
    }

    /*
     * Functions
     */

    setAction(action) {
        if (!this._activeAction) {
            this._activeAction = action;
            this._activeAction.on('stop', () => {
                console.log('stop?');
                this._activeAction = null;
            });
            this.trigger('setAction', this._activeAction, this);
            return true;
        } else {
            return false;
        }
    }



    /**
     * Properties
     */
    get activeAction() {
        return this._activeAction;
    }
};

export default Action;
