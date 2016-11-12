var globals = require('globals');
var roleBase = require('role.base');

var roleHarvester = {
    /**
     * @param {Creep} creep
     */
    setNextMode: function (creep) {
        switch(creep.memory.mode) {
            case globals.MODE_HARVESTING:
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.mode = globals.MODE_TRANSFERING;
                }
                break;
            case globals.MODE_TRANSFERING:
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
    transfer: function (creep) {
        //noinspection JSUnusedGlobalSymbols
        var structures = creep.room.find(FIND_STRUCTURES, {
            /**
             * @param {Structure} structure
             * @returns {boolean}
             */
            filter: function (structure) {
                return STRUCTURE_SPAWN == structure.structureType || STRUCTURE_EXTENSION == structure.structureType;
            }
        });
        for (var s in structures) {
            if (!structures.hasOwnProperty(s)) {
                continue;
            }
            if (structures[s].energy < structures[s].energyCapacity) {
                if (ERR_NOT_IN_RANGE == creep.transfer(structures[s], RESOURCE_ENERGY)) {
                    creep.moveTo(structures[s]);
                }
            }
        }
    },

    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        roleHarvester.setNextMode(creep);
        switch (creep.memory.mode) {
            case globals.MODE_TRANSFERING:
                roleHarvester.transfer(creep);
                break;
            case globals.MODE_HARVESTING:
                roleBase.harvestSourceInMemory(creep);
                break;
        }
    }
};

module.exports = roleHarvester;
