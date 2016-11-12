var globals = require('globals');
var roleBase = require('role.base');

var roleBuilder = {
    /**
     * @param {Creep} creep
     */
    build: function (creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (ERR_NOT_IN_RANGE == creep.build(targets[0])) {
                creep.moveTo(targets[0]);
            }
        } else {
            targets = creep.room.find(FIND_STRUCTURES, {
                /**
                 * @param {Structure} structure
                 */
                filter: function (structure) {
                    return STRUCTURE_ROAD == structure.structureType && structure.hits < structure.hitsMax;
                }
            });
            if (targets.length) {
                if (ERR_NOT_IN_RANGE == creep.repair(targets[0])) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    },

    /**
     * @param {Creep} creep
     */
    setNextMode: function(creep) {
        switch(creep.memory.mode) {
            case globals.MODE_HARVESTING:
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.mode = globals.MODE_BUILDING;
                }
                break;
            case globals.MODE_BUILDING:
                if (0 == creep.carry.energy) {
                    creep.memory.mode = globals.MODE_HARVESTING;
                    roleBase.setBestEnergySource(creep);
                }
                break;
            default:
                creep.memory.mode = globals.MODE_HARVESTING;
                roleBase.setBestEnergySource(creep);
        }
    },

    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        roleBuilder.setNextMode(creep);
        switch (creep.memory.mode) {
            case globals.MODE_BUILDING:
                roleBuilder.build(creep);
                break;
            case globals.MODE_HARVESTING:
                roleBase.harvestSourceInMemory(creep);
                break;
        }
    }
};

module.exports = roleBuilder;
