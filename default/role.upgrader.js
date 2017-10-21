let roleUpgrader = {
    run: function (creep) {
        if (0 === creep.carry.energy) {
            let sources = creep.room.find(FIND_SOURCES);
            if (ERR_NOT_IN_RANGE === creep.harvest(sources[0])) {
                creep.moveTo(sources[0]);
            }
        } else {
            if (ERR_NOT_IN_RANGE === creep.upgradeController(creep.room.controller, RESOURCE_ENERGY)) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;
