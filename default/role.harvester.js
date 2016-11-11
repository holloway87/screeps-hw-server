var roleBase = require('role.base');

module.exports = {
    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            roleBase.harvestHighestSource(creep);
        } else {
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
        }
    }
};
