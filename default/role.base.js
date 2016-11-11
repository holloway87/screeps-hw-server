module.exports = {
    harvestHighestSource: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        _.sortBy(sources,
            /** @param {Source} source */
            function (source) {return source.energy;}
        );
        if (ERR_NOT_IN_RANGE == creep.harvest(sources[sources.length -1])) {
            creep.moveTo(sources[sources.length -1]);
        }
    }
};
