var roleBase = require('role.base');

module.exports = {
    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        if (creep.memory.upgrading && 0 == creep.carry.energy) {
            creep.memory.upgrading = false;
        } else if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (ERR_NOT_IN_RANGE == creep.upgradeController(creep.room.controller)) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            roleBase.harvestHighestSource(creep);
        }
    }
};
