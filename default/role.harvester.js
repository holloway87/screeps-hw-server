'use strict';

let roleHarvester = {
    /**
     * Harvest resources and put them into the spawn.
     *
     * @param {Creep} creep
     */
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            let sources = creep.room.find(FIND_SOURCES);
            if (ERR_NOT_IN_RANGE === creep.harvest(sources[0])) {
                creep.moveTo(sources[0]);
            }
        } else {
            if (ERR_NOT_IN_RANGE === creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY)) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
};

module.exports = roleHarvester;
