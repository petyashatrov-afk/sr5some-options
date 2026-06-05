// sr5-speed-penalties/scripts/speed-penalties.js
const MODULE_NAME = 'sr5-speed-penalties';

const SPEED_PENALTIES = [
  { max: 6, attack: 0, defense: 0 },
  { max: 12, attack: -1, defense: 0 },
  { max: 20, attack: -2, defense: -1 },
  { max: 30, attack: -3, defense: -2 },
  { max: 45, attack: -4, defense: -3 },
  { max: 70, attack: -5, defense: -4 },
  { max: Infinity, attack: -6, defense: -5 }
];

const distanceTraveled = new Map(); // actorId -> метры за текущий ход

Hooks.once('ready', () => {
  if (game.system.id !== 'shadowrun5e') {
    console.error(`${MODULE_NAME}: Система не Shadowrun 5e, модуль отключён.`);
    return;
  }

  const tests = game.shadowrun5e?.tests;
  if (!tests) {
    console.error(`${MODULE_NAME}: Не удалось найти game.shadowrun5e.tests`);
    return;
  }

  // --- Перехват тестов атаки ---
  const attackTests = [
    'RangedAttackTest',
    'MeleeAttackTest',
    'ThrownAttackTest',
    'SpellCastingTest'
  ];

  for (let testName of attackTests) {
    const TestClass = tests[testName];
    if (!TestClass?.prototype) continue;

    const originalExecute = TestClass.prototype.execute;
    if (originalExecute) {
      TestClass.prototype.execute = async function(...args) {
        await applyAttackPenalty(this);
        return originalExecute.apply(this, args);
      };
      console.log(`${MODULE_NAME}: Перехвачен ${testName}.execute`);
    }
  }

  // --- Перехват тестов защиты ---
  const defenseTests = [
    'PhysicalDefenseTest',
    'CombatSpellDefenseTest',
    'MatrixDefenseTest'
  ];

  for (let testName of defenseTests) {
    const TestClass = tests[testName];
    if (!TestClass?.prototype) continue;

    const originalExecute = TestClass.prototype.execute;
    if (originalExecute) {
      TestClass.prototype.execute = async function(...args) {
        await applyDefensePenalty(this);
        return originalExecute.apply(this, args);
      };
      console.log(`${MODULE_NAME}: Перехвачен ${testName}.execute`);
    }
  }

  // --- Отслеживание перемещения токенов ---
  Hooks.on('updateToken', (token, update, options, userId) => {
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

    console.log(`${MODULE_NAME}: ${actor.name} переместился на ${distMeters.toFixed(2)} м (всего за ход: ${(current + distMeters).toFixed(2)} м)`);
  });

  // --- Сброс расстояния в начале хода актёра ---
  Hooks.on('updateCombat', (combat, update, options, userId) => {
    if (!game.combat) return;

    // При смене хода (turn изменился)
    if (update.turn !== undefined) {
      const currentCombatant = combat.combatant;
      if (currentCombatant && currentCombatant.actor) {
        const actorId = currentCombatant.actor.id;
        distanceTraveled.set(actorId, 0);
        console.log(`${MODULE_NAME}: Начало хода ${currentCombatant.actor.name}, расстояние сброшено.`);
      }
    }

    // При старте нового раунда (на всякий случай)
    if (update.round !== undefined && update.round > 0) {
      distanceTraveled.clear();
      console.log(`${MODULE_NAME}: Новый раунд, все расстояния сброшены.`);
    }
  });

  console.log(`${MODULE_NAME}: Модуль инициализирован.`);
});

/**
 * Штраф к атаке (зависит от перемещения цели за её ход)
 */
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
  if (!testInstance.data.pool.mod) testInstance.data.pool.mod = [];

  testInstance.data.pool.mod.push({
    name: `Штраф за скорость цели (${distance.toFixed(2)} м)`,
    value: penalty
  });

  console.log(`${MODULE_NAME}: Атака: добавлен штраф ${penalty} для цели ${targetActor.name} (перемещение ${distance.toFixed(2)} м)`);
}

/**
 * Модификатор защиты (зависит от перемещения защищающегося за его ход)
 */
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
  if (!testInstance.data.pool.mod) testInstance.data.pool.mod = [];

  testInstance.data.pool.mod.push({
    name: `Штраф за скорость защитника (${distance.toFixed(2)} м)`,
    value: modifier
  });

  console.log(`${MODULE_NAME}: Защита: добавлен модификатор ${modifier} для ${actor.name} (перемещение ${distance.toFixed(2)} м)`);
}

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