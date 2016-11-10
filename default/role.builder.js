module.exports = {
    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        if (creep.memory.building && 0 == creep.carry.energy) {
            creep.memory.building = false;
        } else if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (ERR_NOT_IN_RANGE == creep.build(targets[0])) {
                    creep.moveTo(targets[0]);
                }
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};
