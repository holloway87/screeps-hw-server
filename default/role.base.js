module.exports = {
    /**
     * @param {Creep} creep
     */
    setBestEnergySource: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);

        var lowestCostSource = 0;
        var lowestCost = null;
        for (var s = 0; s < sources.length; s++) {
            var placesCnt = 0;
            var creepsCnt = 0;
            for (var y = -1; y <= 1; y++) {
                for (var x = -1; x <= 1; x++) {
                    if (0 == x && 0 == y) {
                        continue;
                    }

                    var objects = creep.room.lookAt(sources[s].pos.x + x, sources[s].pos.y + y);
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
            var cost = creepsCnt - placesCnt;
            if (null == lowestCost || lowestCost > cost) {
                lowestCost = cost;
                lowestCostSource = s;
            }
        }

        creep.memory.harvestingSource = lowestCostSource;
    },

    /**
     * @param {Creep} creep
     */
    harvestSourceInMemory: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if (ERR_NOT_IN_RANGE == creep.harvest(sources[creep.memory.harvestingSource])) {
            creep.moveTo(sources[creep.memory.harvestingSource]);
        }
    }
};
