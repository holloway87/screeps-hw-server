var globals = require('globals');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
    for (var c in Memory.creeps) {
        if (!Memory.creeps.hasOwnProperty(c)) {
            continue;
        }
        if (!Game.creeps[c]) {
            delete Memory.creeps[c];
        }
    }

    var builders = _.filter(Game.creeps,
        /** @param {Creep} creep */
        function (creep) {return 'builder' == creep.memory.role;}
    );
    var harvesters = _.filter(Game.creeps,
        /** @param {Creep} creep */
        function (creep) {return 'harvester' == creep.memory.role;}
    );
    var upgraders = _.filter(Game.creeps,
        /** @param {Creep} creep */
        function (creep) {return 'upgrader' == creep.memory.role;}
    );

    if (globals.maxHarverster > harvesters.length && 200 <= Game.spawns['Spawn1'].energy) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
    } else if (globals.maxUpgrader > upgraders.length && 200 <= Game.spawns['Spawn1'].energy) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'upgrader'});
    } else if (globals.maxBuilders > builders.length && 200 <= Game.spawns['Spawn1'].energy) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'builder'});
    }

    _.forEach(builders,
        /** @param {Creep} creep */
        function (creep) {roleBuilder.run(creep);}
    );
    _.forEach(harvesters,
        /** @param {Creep} creep */
        function (creep) {roleHarvester.run(creep);}
    );
    _.forEach(upgraders,
        /** @param {Creep} creep */
        function (creep) {roleUpgrader.run(creep);}
    );
};
