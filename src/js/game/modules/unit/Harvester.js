'use strict';

import Module from '../Module';
import {
    TYPE as TYPE_RESOURCE
} from '../../base/unit/Resource';

export default class Harvester extends Module {
    constructor(app, unit) {
        super(app, unit);
        this.home = null;

    }
start(){

                this.collectResources();
}

    collectResources() {

        const units = this.searchNearResources(this.unit);
        if (units.length > 0) {
            this.log('Go to resource…');
            const resourceUnit = units.shift().unit;
            console.log(resourceUnit.position);
            this.moveUnitToPosition(this.unit, resourceUnit.position).then(() => {
                this.log('Collect resource…');
                return this.app.unitActions.add(this.unit, 'collect',resourceUnit).then(() => {

                        this.log('Resource collected, go to Home');
                    return this.moveToHome();
                });
            }).then(() => {

                this.collectResources();


            });
        }
    }
    searchNearResources(unit) {
        const distances = getDistanceFromResources(unit, this.app.map.units.filter(unit => {
            if (unit.isType(TYPE_RESOURCE)) {
                return unit;
            }
        }));
        return distances;
    }

    removeResource(unit) {
        unit.remove();
    }

    moveToHome() {
        return this.moveUnitToPosition(this.unit, this.home.position);
    }
    moveUnitToPosition(unit, position) {


        // get moveData
        // set moveData for move unit
        // if (unit.activeAction && unit.activeAction.type === 'move') {
        //     unit.activeAction.stop();
        // }

        return this.app.map.getMoveData(unit, position).then(moveData => {
            if (moveData.path.length > 0) {
                return this.app.unitActions.add(unit, 'move', moveData);
            } else {
                console.log('Position ist belegt');
            }
        });
    }

}


function getDistanceFromResources(unit, units) {
    return units.map(resourceUnit => {
        return {
            unit: resourceUnit,
            distance: getDistance(unit, resourceUnit)
        };
    }).sort((a, b) => {
        if (a.distance > b.distance) {
            return 1;
        } else if (a.distance < b.distance) {
            return -1;
        } else {
            return 0;
        }
    });

}

function getDistance(sourceUnit, destUnit) {
    return sourceUnit.position.distance(destUnit.position);

}
