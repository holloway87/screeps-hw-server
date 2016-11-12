var globals = require('globals');
var roleBase = require('role.base');

var roleUpgrader = {
    /**
     * @param {Creep} creep
     */
    setNextMode: function (creep) {
        switch(creep.memory.mode) {
            case globals.MODE_HARVESTING:
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.mode = globals.MODE_UPGRADING;
                }
                break;
            case globals.MODE_UPGRADING:
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
    upgrade: function (creep) {
        if (ERR_NOT_IN_RANGE == creep.upgradeController(creep.room.controller)) {
            creep.moveTo(creep.room.controller);
        }
    },

    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        roleUpgrader.setNextMode(creep);
        switch (creep.memory.mode) {
            case globals.MODE_UPGRADING:
                roleUpgrader.upgrade(creep);
                break;
            case globals.MODE_HARVESTING:
                roleBase.harvestSourceInMemory(creep);
                break;
        }
    }
};

module.exports = roleUpgrader;
