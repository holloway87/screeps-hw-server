'use strict';

let roleHarvester = require('role.harvester');

/**
 * Update one room.
 *
 * @param {Room} room
 */
function updateRoom(room) {
    let harvesters = room.find(FIND_MY_CREEPS,
        /** @param {Creep} creep */
        function (creep) {return 'harvester' === creep.memory.role;}
    );

    let harvestersCnt = 0;
    for (let name in harvesters) {
        if (!harvesters.hasOwnProperty(name)) {
            continue;
        }

        let creep = harvesters[name];
        if ('harvester' === creep.memory.role) {
            roleHarvester.run(creep);
            harvestersCnt++;
        }
    }

    if (roleHarvester.maxCreeps > harvestersCnt) {
        let spawns = Game.rooms['W3N8'].find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawns.length; i++) {
            if (spawns[i].energy >= roleHarvester.creepEnergyNeeded) {
                roleHarvester.create(spawns[i]);
            }
        }
    }
}

module.exports.loop = function () {
    for (let name in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(name)) {
            continue;
        }

        updateRoom(Game.rooms[name]);
    }
};
