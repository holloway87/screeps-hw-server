var roleUpgrader = {
    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        if (0 == creep.carry.energy) {
            var sources = creep.room.find(FIND_SOURCES);
            if (ERR_NOT_IN_RANGE == creep.harvest(sources[sources.length -1])) {
                creep.moveTo(sources[sources.length -1]);
            }
        } else {
            if (ERR_NOT_IN_RANGE == creep.upgradeController(creep.room.controller)) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;
