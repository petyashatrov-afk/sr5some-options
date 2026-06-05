const MODULE_NAME = 'sr5-some-options';

const SPEED_PENALTIES = [
  { max: 6, attack: 0, defense: 0 },
  { max: 12, attack: -1, defense: 0 },
  { max: 20, attack: -2, defense: -1 },
  { max: 30, attack: -3, defense: -2 },
  { max: 45, attack: -4, defense: -3 },
  { max: 70, attack: -5, defense: -4 },
  { max: Infinity, attack: -6, defense: -5 }
];

const distanceTraveled = new Map();

function getAttackPenalty(distanceMeters) {
  for (let level of SPEED_PENALTIES) {
    if (distanceMeters <= level.max) return level.attack;
  }
  return 0;
}

function getDefenseModifier(distanceMeters) {
  for (let level of SPEED_PENALTIES) {
    if (distanceMeters <= level.max) return level.defense;
  }
  return 0;
}

async function applyAttackPenalty(testInstance) {
  if (!game.combat) return;

  const targetUuids = testInstance.data?.targetUuids || [];
  if (targetUuids.length === 0) return;

  const targetUuid = targetUuids[0];
  const target = await fromUuid(targetUuid);
  if (!target) return;

  const targetActor = target.actor || target;
  if (!targetActor) return;

  const distance = distanceTraveled.get(targetActor.id) || 0;
  const penalty = getAttackPenalty(distance);
  if (penalty === 0) return;

  if (!testInstance.data.pool) return;
  if (!testInstance.data.pool.changes) testInstance.data.pool.changes = [];

  testInstance.data.pool.changes.push({
    name: `Штраф за скорость цели (${distance.toFixed(2)} м)`,
    value: penalty,
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    priority: 20,
    enabled: true
  });

  console.log(`${MODULE_NAME}: Attack penalty ${penalty} added for target ${targetActor.name} (moved ${distance.toFixed(2)}m)`);
}

async function applyDefensePenalty(testInstance) {
  if (!game.combat) return;

  const targetUuids = testInstance.data?.targetUuids || [];
  if (targetUuids.length === 0) return;

  const targetUuid = targetUuids[0];
  const target = await fromUuid(targetUuid);
  if (!target) return;

  const actor = target.actor || target;
  if (!actor) return;

  const distance = distanceTraveled.get(actor.id) || 0;
  const modifier = getDefenseModifier(distance);
  if (modifier === 0) return;

  if (!testInstance.data.pool) return;
  if (!testInstance.data.pool.changes) testInstance.data.pool.changes = [];

  testInstance.data.pool.changes.push({
    name: `Штраф за скорость защитника (${distance.toFixed(2)} м)`,
    value: modifier,
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    priority: 20,
    enabled: true
  });

  console.log(`${MODULE_NAME}: Defense penalty ${modifier} added for ${actor.name} (moved ${distance.toFixed(2)}m)`);
}

export function registerSpeedPenalties() {
  console.log(`${MODULE_NAME} | Registering speed penalties`);

  const tests = game.shadowrun5e?.tests;
  if (!tests) {
    console.error(`${MODULE_NAME}: Не удалось найти game.shadowrun5e.tests`);
    return;
  }

  // Attack tests intercept
  const attackTests = ['RangedAttackTest', 'MeleeAttackTest', 'ThrownAttackTest', 'SpellCastingTest'];
  for (let testName of attackTests) {
    const TestClass = tests[testName];
    if (!TestClass?.prototype) continue;

    const originalExecute = TestClass.prototype.execute;
    if (originalExecute) {
      TestClass.prototype.execute = async function(...args) {
        if (game.settings.get(MODULE_NAME, 'enableSpeedPenalties')) {
          try {
            await applyAttackPenalty(this);
          } catch (err) {
            console.error(`${MODULE_NAME}: Error applying attack speed penalty`, err);
          }
        }
        return originalExecute.apply(this, args);
      };
      console.log(`${MODULE_NAME}: Intercepted ${testName}.execute for Attack Speed Penalties`);
    }
  }

  // Defense tests intercept
  const defenseTests = ['PhysicalDefenseTest', 'CombatSpellDefenseTest', 'MatrixDefenseTest'];
  for (let testName of defenseTests) {
    const TestClass = tests[testName];
    if (!TestClass?.prototype) continue;

    const originalExecute = TestClass.prototype.execute;
    if (originalExecute) {
      TestClass.prototype.execute = async function(...args) {
        if (game.settings.get(MODULE_NAME, 'enableSpeedPenalties')) {
          try {
            await applyDefensePenalty(this);
          } catch (err) {
            console.error(`${MODULE_NAME}: Error applying defense speed modifier`, err);
          }
        }
        return originalExecute.apply(this, args);
      };
      console.log(`${MODULE_NAME}: Intercepted ${testName}.execute for Defense Speed Penalties`);
    }
  }

  // Track Token movement
  Hooks.on('updateToken', (token, update, options, userId) => {
    if (!game.settings.get(MODULE_NAME, 'enableSpeedPenalties')) return;
    if (!game.combat) return;
    if (update.x === undefined && update.y === undefined) return;

    const scene = game.scenes.get(token.parent?.id);
    if (!scene) return;

    const actor = token.actor;
    if (!actor) return;

    const oldX = token.x;
    const oldY = token.y;
    const newX = update.x ?? oldX;
    const newY = update.y ?? oldY;

    const dx = newX - oldX;
    const dy = newY - oldY;
    const distPx = Math.sqrt(dx*dx + dy*dy);

    const gridSize = scene.grid.size;
    const gridDistance = scene.grid.distance;
    const distMeters = distPx / gridSize * gridDistance;

    const actorId = actor.id;
    const current = distanceTraveled.get(actorId) || 0;
    distanceTraveled.set(actorId, current + distMeters);

    console.log(`${MODULE_NAME}: ${actor.name} moved by ${distMeters.toFixed(2)}m (total this turn: ${(current + distMeters).toFixed(2)}m)`);
  });

  // Reset distance on combat updates
  Hooks.on('updateCombat', (combat, update, options, userId) => {
    if (!game.settings.get(MODULE_NAME, 'enableSpeedPenalties')) return;
    if (!game.combat) return;

    if (update.turn !== undefined) {
      const currentCombatant = combat.combatant;
      if (currentCombatant && currentCombatant.actor) {
        const actorId = currentCombatant.actor.id;
        distanceTraveled.set(actorId, 0);
        console.log(`${MODULE_NAME}: Turn started for ${currentCombatant.actor.name}, speed distance reset.`);
      }
    }

    if (update.round !== undefined && update.round > 0) {
      distanceTraveled.clear();
      console.log(`${MODULE_NAME}: New round, cleared all speed distances.`);
    }
  });
}
