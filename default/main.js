var globals = require('globals');
var roleWorker = require('role.worker');

function clearMemory() {
    for (var c in Memory.creeps) {
        if (!Memory.creeps.hasOwnProperty(c)) {
            continue;
        }
        if (!Game.creeps[c]) {
            delete Memory.creeps[c];
        }
    }
}

/**
 * @param {Room} room
 */
function updateRoom(room) {
    var workers = room.find(FIND_MY_CREEPS,
        /** @param {Creep} creep */
        function (creep) {return globals.ROLE_WORKER == creep.memory.role;}
    );

    if (1050 <= room.energyCapacityAvailable) {
        if (globals.maxWorker > workers.length && 1050 <= room.energyAvailable) {
            Game.spawns['Spawn1'].createCreep(
                [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                null, {role: globals.ROLE_WORKER});
        }
    } else {
        if (globals.maxWorker > workers.length && 200 <= room.energyAvailable) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], null, {role: globals.ROLE_WORKER});
        }
    }

    _.forEach(workers,
        /** @param {Creep} creep */
        function (creep) {roleWorker.run(creep);}
    );
}

module.exports.loop = function () {
    clearMemory();

    for (var r in Game.rooms) {
        if (!Game.rooms.hasOwnProperty(r)) {
            continue;
        }

        updateRoom(Game.rooms[r]);
    }
};
