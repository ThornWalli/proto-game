'use strict';

import Events from './Events';

export default class Collection extends Events {

    constructor(filter) {
        super();
        this._filter = filter;
        this._items = [];
    }

    /*
     * Functions
     */

    sort() {
        return this._items.sort.apply(this._items, arguments);
    }
    find() {
        return this._items.find.apply(this._items, arguments);
    }
    forEach() {
        return this._items.forEach.apply(this._items, arguments);
    }
    reduce() {
        return this._items.reduce.apply(this._items, arguments);
    }
    map() {
        return this._items.map.apply(this._items, arguments);
    }
    filter() {
        return this._items.filter.apply(this._items, arguments);
    }

    createFilteredCollection(filter) {
        const collection = new(this.class)(this._filter);
        collection._items = this.filter(filter);
        this.on('add', collection.add, collection);
        this.on('remove', collection.add, collection);
        return collection;
    }

    add(item, options) {
        if (!this._filter || this._filter(item)) {
            this._items.push(item);
            if (!options || options && !options.silence) {
                this.trigger('add', item, options);
            }
        }
    }

    remove(item, options = {}) {
        if (!this._filter || this._filter(item)) {
            this._items.splice(this._items.indexOf(item), 1);
            if (!options || options && !options.silence) {
                this.trigger('remove', item, options);
            }
        }
    }

    /*
     * Properties
     */

    get items() {
        return this._items;
    }
    get length() {
        return this._items.length;
    }
    get class() {
        return Collection;
    }
}
