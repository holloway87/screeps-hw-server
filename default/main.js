'use strict';

let roleHarvester = require('role.harvester');

/**
 * Clean memory.
 */
function clearMemory() {
    for (let c in Memory.creeps) {
        if (!Memory.creeps.hasOwnProperty(c)) {
            continue;
        }
        if (!Game.creeps[c]) {
            delete Memory.creeps[c];
        }
    }
}

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
        let spawns = room.find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawns.length; i++) {
            if (spawns[i].energy >= roleHarvester.creepEnergyNeeded) {
                roleHarvester.create(spawns[i]);
            }
        }
    }
}

module.exports.loop = function () {
    clearMemory();

    for (let name in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(name)) {
            continue;
        }

        updateRoom(Game.rooms[name]);
    }
};
