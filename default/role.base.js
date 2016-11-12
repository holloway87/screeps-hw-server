var roleBase = {
    /**
     * @param {Source} source
     * @param {Creep} creep
     * @return {int}
     */
    getEnergySourceCost: function(source, creep) {
        var placesCnt = 0;
        var creepsCnt = 0;
        for (var y = -1; y <= 1; y++) {
            for (var x = -1; x <= 1; x++) {
                if (0 == x && 0 == y) {
                    continue;
                }

                var objects = creep.room.lookAt(source.pos.x + x, source.pos.y + y);
                for (var o = 0; o < objects.length; o++) {
                    if (LOOK_TERRAIN == objects[o].type &&
                        ('swamp' == objects[o].terrain || 'plain' == objects[o].terrain)
                    ) {
                        placesCnt++;
                    }
                    if (LOOK_CREEPS == objects[o].type) {
                        creepsCnt++;
                    }
                }
            }
        }

        return creepsCnt - placesCnt;
    },

    /**
     * @param {Creep} creep
     */
    setBestEnergySource: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);

        var lowestCostSource = 0;
        var lowestCost = null;
        for (var s = 0; s < sources.length; s++) {
            var cost = roleBase.getEnergySourceCost(sources[s], creep);
            if (null == lowestCost || lowestCost > cost) {
                lowestCost = cost;
                lowestCostSource = s;
            }
        }

        creep.memory.harvestingSource = sources[lowestCostSource].id;
    },

    /**
     * @param {Creep} creep
     */
    harvestSourceInMemory: function (creep) {
        var source = Game.getObjectById(creep.memory.harvestingSource);
        var success = creep.harvest(source);
        if (creep.memory.moving && OK == success) {
            if (0 == roleBase.getEnergySourceCost(source, creep)) {
                roleBase.setBestEnergySource(creep);
            }
            creep.memory.moving = false;
        }
        if (ERR_NOT_IN_RANGE == success) {
            creep.moveTo(source);
            creep.memory.moving = true;
        }
    }
};

module.exports = roleBase;
