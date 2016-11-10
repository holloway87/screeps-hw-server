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

    var buildersCnt = 0;
    var harvesterCnt = 0;
    var upgraderCnt = 0;
    for (c in Game.creeps) {
        if (!Game.creeps.hasOwnProperty(c)) {
            continue;
        }
        var creep = Game.creeps[c];

        switch (creep.memory.role) {
            case 'builder':
                buildersCnt++;
                break;
            case 'harvester':
                harvesterCnt++;
                break;
            case 'upgrader':
                upgraderCnt++;
                break;
        }
    }

    if (globals.maxHarverster > harvesterCnt && 200 <= Game.spawns['Spawn1'].energy) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'harvester'});
    }
    if (globals.maxUpgrader > upgraderCnt && 200 <= Game.spawns['Spawn1'].energy) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'upgrader'});
    }
    if (globals.maxBuilders > buildersCnt && 200 <= Game.spawns['Spawn1'].energy) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: 'builder'});
    }

    for (c in Game.creeps) {
        if (!Game.creeps.hasOwnProperty(c)) {
            continue;
        }
        creep = Game.creeps[c];

        switch (creep.memory.role) {
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
        }
    }
};
