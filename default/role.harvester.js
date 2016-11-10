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
            var spawns = creep.room.find(FIND_MY_SPAWNS);
            if (ERR_NOT_IN_RANGE == creep.transfer(spawns[0], RESOURCE_ENERGY)) {
                creep.moveTo(spawns[0]);
            }
        }
    }
};

module.exports = roleHarvester;
