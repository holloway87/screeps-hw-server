var globals = require('globals');

var roleWorker = {
    /**
     * @param {Source} source
     * @param {Creep} creep
     * @returns {int}
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
     * @param {Room} room
     * @returns {ConstructionSite[]}
     */
    getBuildTargets: function (room) {
        return room.find(FIND_CONSTRUCTION_SITES);
    },

    /**
     * @param {Room} room
     * @returns {Structure[]}
     */
    getRepairTargets: function (room) {
        return room.find(FIND_STRUCTURES, {
            /**
             * @param {Structure} structure
             */
            filter: function (structure) {
                return structure.hits < structure.hitsMax;
            }
        });
    },

    /**
     * @param {Room} room
     * @returns {StructureSpawn[]|StructureExtension[]|StructureTower[]}
     */
    getTransferTargets: function (room) {
        return room.find(FIND_STRUCTURES, {
            /**
             * @param {Structure} structure
             * @returns {boolean}
             */
            filter: function (structure) {
                return (structure instanceof StructureSpawn || structure instanceof StructureExtension ||
                    structure instanceof StructureTower) &&
                    structure.energy < structure.energyCapacity;
            }
        });
    },

    /**
     * @param {Creep} creep
     */
    setBestEnergySource: function (creep) {
        var sources = creep.room.find(FIND_SOURCES, function (source) {return 0 < source.energy;});

        if (0 == sources.length) {
            creep.memory.actSource = null;
        } else if (1 == sources.length) {
            creep.memory.actSource = sources[0].id;
        }

        var lowestCostSource = 0;
        var lowestCost = null;
        for (var s = 0; s < sources.length; s++) {
            var cost = roleWorker.getEnergySourceCost(sources[s], creep);
            if (null == lowestCost || lowestCost > cost) {
                lowestCost = cost;
                lowestCostSource = s;
            }
        }

        creep.memory.actSource = sources[lowestCostSource].id;
    },

    /**
     * @param {Creep} creep
     * @param {ConstructionSite[]} [targets]
     * @returns {string|null}
     */
    setBuildTarget: function (creep, targets) {
        if (!targets) {
            targets = roleWorker.getBuildTargets(creep.room);
        }
        if (targets.length) {
            creep.memory.actSource = targets[_.random(targets.length -1)].id;
        } else {
            creep.memory.actSource = null;
        }

        return creep.memory.actSource;
    },

    /**
     * @param {Creep} creep
     * @param {Structure[]} [targets]
     * @returns {string|null}
     */
    setRapairTarget: function (creep, targets) {
        if (!targets) {
            targets = roleWorker.getRepairTargets(creep.room);
        }
        if (targets.length) {
            creep.memory.actSource = targets[_.random(targets.length -1)].id;
        } else {
            creep.memory.actSource = null;
        }

        return creep.memory.actSource;
    },

    /**
     * @param {Creep} creep
     * @param {StructureSpawn[]|StructureExtension[]|StructureTower[]} [targets]
     * @returns {string|null}
     */
    setTransferTarget: function (creep, targets) {
        if (!targets) {
            targets = roleWorker.getTransferTargets(creep.room);
        }
        if (targets.length) {
            creep.memory.actSource = targets[_.random(targets.length -1)].id;
        } else {
            creep.memory.actSource = null;
        }

        return creep.memory.actSource;
    },

    /**
     * @param {Creep} creep
     */
    build: function (creep) {
        var target = Game.getObjectById(creep.memory.actSource);

        if (!(target instanceof ConstructionSite)) {
            roleWorker.setBuildTarget(creep);
            if (creep.memory.actSource) {
                target = Game.getObjectById(creep.memory.actSource);
            }
        }
        if (!target) {
            creep.memory.mode = globals.MODE_REPAIRING;
            roleWorker.setRapairTarget(creep);

            return;
        }

        var success = creep.build(target);
        if (creep.memory.moving && OK == success) {
            creep.memory.moving = false;
        }
        if (ERR_NOT_IN_RANGE == success) {
            creep.moveTo(target);
            creep.memory.moving = true;
        }
    },

    /**
     * @param {Creep} creep
     */
    harvest: function (creep) {
        var source = Game.getObjectById(creep.memory.actSource);

        if (!(source instanceof Source)) {
            roleWorker.setBestEnergySource(creep);
            source = Game.getObjectById(creep.memory.actSource);
        }

        if (0 == source.energy) {
            roleWorker.setBestEnergySource(creep);
            source = Game.getObjectById(creep.memory.actSource);
        }

        var success = creep.harvest(source);
        if (creep.memory.moving && OK == success) {
            if (0 == roleWorker.getEnergySourceCost(source, creep)) {
                roleWorker.setBestEnergySource(creep);
            }
            creep.memory.moving = false;
        }
        if (ERR_NOT_IN_RANGE == success) {
            creep.moveTo(source);
            creep.memory.moving = true;
        }
    },

    /**
     * @param {Creep} creep
     */
    repair: function (creep) {
        var target = Game.getObjectById(creep.memory.actSource);
        var setNextMode = false;

        if (!(target instanceof Structure)) {
            roleWorker.setRapairTarget(creep);
            if (creep.memory.actSource) {
                target = Game.getObjectById(creep.memory.actSource);
            } else {
                setNextMode = true;
            }
        }

        if (target.hits == target.hitsMax) {
            setNextMode = true;
        }
        if (setNextMode) {
            creep.memory.mode = globals.MODE_UPGRADING;

            return;
        }

        var success = creep.repair(target);
        if (creep.memory.moving && OK == success) {
            if (target.energy == target.energyCapacity) {
                roleWorker.setRapairTarget(creep);
            }
            creep.memory.moving = false;
        }
        if (ERR_NOT_IN_RANGE == success) {
            creep.moveTo(target);
            creep.memory.moving = true;
        }
    },

    /**
     * @param {Creep} creep
     */
    setNextModeAfterHarvesting: function (creep) {
        //noinspection JSUnusedGlobalSymbols
        var structures = roleWorker.getTransferTargets(creep.room);
        if (structures.length) {
            creep.memory.mode = globals.MODE_TRANSFERING;
            roleWorker.setTransferTarget(creep, structures);

            return;
        }

        structures = roleWorker.getBuildTargets(creep.room);
        if (structures.length) {
            creep.memory.mode = globals.MODE_BUILDING;
            roleWorker.setBuildTarget(creep, structures);

            return;
        }

        structures = roleWorker.getRepairTargets(creep.room);
        if (structures.length) {
            creep.memory.mode = globals.MODE_REPAIRING;
            roleWorker.setRapairTarget(creep);

            return;
        }

        creep.memory.mode = globals.MODE_UPGRADING;
    },

    /**
     * @param {Creep} creep
     */
    setNextMode: function (creep) {
        switch(creep.memory.mode) {
            case globals.MODE_BUILDING:
                if (0 == creep.carry.energy) {
                    creep.memory.mode = globals.MODE_HARVESTING;
                    roleWorker.setBestEnergySource(creep);
                }
                break;
            case globals.MODE_HARVESTING:
                if (creep.carry.energy == creep.carryCapacity) {
                    roleWorker.setNextModeAfterHarvesting(creep);
                }
                break;
            case globals.MODE_REPAIRING:
                if (0 == creep.carry.energy) {
                    creep.memory.mode = globals.MODE_HARVESTING;
                    roleWorker.setBestEnergySource(creep);
                }
                break;
            case globals.MODE_TRANSFERING:
                if (0 == creep.carry.energy) {
                    creep.memory.mode = globals.MODE_HARVESTING;
                    roleWorker.setBestEnergySource(creep);
                }
                break;
            case globals.MODE_UPGRADING:
                if (0 == creep.carry.energy) {
                    creep.memory.mode = globals.MODE_HARVESTING;
                    roleWorker.setBestEnergySource(creep);
                }
                break;
            default:
                creep.memory.mode = globals.MODE_HARVESTING;
                roleWorker.setBestEnergySource(creep);
        }
    },

    /**
     * @param {Creep} creep
     */
    transfer: function (creep) {
        var target = Game.getObjectById(creep.memory.actSource);
        var setNextMode = false;

        if (!(target instanceof StructureSpawn || target instanceof StructureExtension ||
            target instanceof StructureTower)
        ) {
            roleWorker.setTransferTarget(creep);
            if (creep.memory.actSource) {
                target = Game.getObjectById(creep.memory.actSource);
            } else {
                setNextMode = true;
            }
        }

        if (target.energy == target.energyCapacity) {
            roleWorker.setTransferTarget(creep);
            if (creep.memory.actSource) {
                target = Game.getObjectById(creep.memory.actSource);
            } else {
                setNextMode = true;
            }
        }
        if (setNextMode) {
            creep.memory.mode = globals.MODE_BUILDING;
            roleWorker.setBuildTarget(creep);

            return;
        }

        var success = creep.transfer(target, RESOURCE_ENERGY);
        if (creep.memory.moving && OK == success) {
            if (target.energy == target.energyCapacity) {
                roleWorker.setTransferTarget(creep);
            }
            creep.memory.moving = false;
        }
        if (ERR_NOT_IN_RANGE == success) {
            creep.moveTo(target);
            creep.memory.moving = true;
        }
    },

    /**
     * @param {Creep} creep
     */
    upgrade: function (creep) {
        if (ERR_NOT_IN_RANGE == creep.upgradeController(creep.room.controller)) {
            creep.moveTo(creep.room.controller);
        }
    },

    /**
     * @param {Creep} creep
     */
    run: function (creep) {
        roleWorker.setNextMode(creep);
        switch (creep.memory.mode) {
            case globals.MODE_BUILDING:
                roleWorker.build(creep);
                break;
            case globals.MODE_HARVESTING:
                roleWorker.harvest(creep);
                break;
            case globals.MODE_REPAIRING:
                roleWorker.repair(creep);
                break;
            case globals.MODE_TRANSFERING:
                roleWorker.transfer(creep);
                break;
            case globals.MODE_UPGRADING:
                roleWorker.upgrade(creep);
                break;
        }
    }
};

module.exports = roleWorker;
