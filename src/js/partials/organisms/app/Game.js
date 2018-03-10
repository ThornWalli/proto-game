"use strict";


import App from '../App';


export default App.extend({

    modelConstructor: App.prototype.modelConstructor.extend({

        session: {
        }

    }),

    initialize() {
        App.prototype.initialize.apply(this, arguments);
    }

});
