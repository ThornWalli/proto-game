"use strict";


import App from '../App';

import Test_PathFinding from '../../../game/test/PathFinding';
import Test_MapNavigation from '../../../game/test/MapNavigation';
import Test_MapBuilder from '../../../game/test/MapBuilder';
import history from 'gp-module-history';


export default App.extend({

    modelConstructor: App.prototype.modelConstructor.extend({

        session: {
            test: {
                type: 'string',
                required: true,
                default: history.registry.get('test').value
            }
        }

    }),

    initialize() {
        App.prototype.initialize.apply(this, arguments);
    },

    getOptions() {
        const options = App.prototype.getOptions.apply(this, arguments);
        options.test = this.getTestClass(this.model.test);
        if (!options.test) {
            throw new Error('Sets test class name…');
        }
        return options;
    },

    getTestClass(name) {
        switch (name.toLowerCase()) {
            case 'pathfinding':
                return Test_PathFinding;
            case 'mapnavigation':
                return Test_MapNavigation;
            case 'mapbuilder':
                return Test_MapBuilder;
        }
    }


});
