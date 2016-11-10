var roleHarvester = {
    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            var structures = creep.room.find(FIND_STRUCTURES, {
                /**
                 * @param {Structure} structure
                 * @returns {boolean}
                 */
                filter: function (structure) {
                    return STRUCTURE_SPAWN == structure.structureType || STRUCTURE_EXTENSION == structure.structureType;
                }
            });
            if (structures.length) {
                if (ERR_NOT_IN_RANGE == creep.transfer(structures[0], RESOURCE_ENERGY)) {
                    creep.moveTo(structures[0]);
                }
            }
        }
    }
};

module.exports = roleHarvester;
