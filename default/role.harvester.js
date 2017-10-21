'use strict';

/**
 * Harvester role.
 *
 * Harvests energy and distributes it to spawns and room controllers.
 *
 * @returns {{run: run}}
 * @constructor
 */
let RoleHarvester = function () {
    const STATE_HARVEST = 0;
    const STATE_TRANSFER = 1;
    const STATE_UPGRADE_CONTROLLER = 2;

    const MAX_CREEPS = 3;

    let creepIdx = 0;

    return {
        'create': create,
        'creepEnergyNeeded': 200,
        'maxCreeps': MAX_CREEPS,
        'run': run
    };

    /**
     * Creates a new harvester.
     *
     * @param {StructureSpawn} spawn
     */
    function create(spawn) {
        spawn.spawnCreep([CARRY, MOVE, WORK], 'harvester' + creepIdx, {'memory': {'role': 'harvester'}});
        creepIdx++;
        if (MAX_CREEPS <= creepIdx) {
            creepIdx = 0;
        }
    }

    /**
     * Harvest resources.
     *
     * When finished, upgrade controller.
     *
     * @param {Creep} creep
     */
    function harvest(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            let source = Game.getObjectById(creep.memory.sourceId);
            if (ERR_NOT_IN_RANGE === creep.harvest(source)) {
                creep.moveTo(source);
            }
        } else {
            setToTransferEnergy(creep);
        }
    }

    /**
     * Harvest resources and put them into the spawn.
     *
     * @param {Creep} creep
     */
    function run(creep) {
        if (STATE_HARVEST === creep.memory.state) {
            harvest(creep);
        } else if (STATE_TRANSFER === creep.memory.state) {
            transfer(creep);
        } else if (STATE_UPGRADE_CONTROLLER === creep.memory.state) {
            upgradeController(creep);
        } else {
            // new guy
            setToHarvest(creep);
        }
    }

    /**
     * Send harvest to next available energy source.
     *
     * @param {Creep} creep
     */
    function setToHarvest(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        creep.memory.sourceId = sources[0].id;
        creep.memory.state = STATE_HARVEST;
    }

    /**
     * Decides where to transfer the energy to.
     *
     * If a spawn doesn't have full energy, transfer it there, otherwise upgrade the controller.
     *
     * @param creep
     */
    function setToTransferEnergy(creep) {
        let spawns = creep.room.find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawns.length; i++) {
            if (spawns[i].energy < spawns[i].energyCapacity) {
                creep.memory.state = STATE_TRANSFER;
                creep.memory.sourceId = spawns[i].id;

                return;
            }
        }

        creep.memory.state = STATE_UPGRADE_CONTROLLER;
    }

    /**
     * Transfer energy to a spawn.
     *
     * @param {Creep} creep
     */
    function transfer(creep) {
        if (0 < creep.carry.energy) {
            let spawn = Game.getObjectById(creep.memory.sourceId);

            // if the spawn is full suddenly set target again
            if (spawn.energy === spawn.energyCapacity) {
                setToTransferEnergy(creep);

                return;
            }

            if (ERR_NOT_IN_RANGE === creep.transfer(spawn, RESOURCE_ENERGY)) {
                creep.moveTo(spawn);
            }
        } else {
            setToHarvest(creep);
        }
    }

    /**
     * Upgrade the room controller.
     *
     * @param {Creep} creep
     */
    function upgradeController(creep) {
        if (0 < creep.carry.energy) {
            if (ERR_NOT_IN_RANGE === creep.upgradeController(creep.room.controller)) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            setToHarvest(creep);
        }
    }
};

module.exports = new RoleHarvester();
