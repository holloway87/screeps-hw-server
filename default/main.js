'use strict';

let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
    for (let name in Game.creeps) {
        if (!Game.creeps.hasOwnProperty(name)) {
            continue;
        }

        let creep = Game.creeps[name];
        if ('harvester' === creep.memory.role) {
            roleHarvester.run(creep);
        } else if ('upgrader' === creep.memory.role) {
            roleUpgrader.run(creep);
        }
    }
};
