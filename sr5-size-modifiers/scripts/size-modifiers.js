// sr5-size-modifiers/scripts/size-modifiers.js
const MODULE_NAME = 'sr5-size-modifiers';

// Пороги суммы Тела+Силы для категорий размера (металюди)
const SIZE_THRESHOLDS = [
  { max: 4, category: 'small', mod: -1 },      // Небольшой
  { max: 10, category: 'medium', mod: 0 },     // Средний
  { max: 15, category: 'bulky', mod: +1 },     // Объемный
  { max: Infinity, category: 'large', mod: +2 } // Большой
];

// Только эти типы актёров обрабатываем
const LIVING_TYPES = ['character', 'critter'];

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

  // Список тестов атаки, к которым применяем модификатор
  const attackTests = [
    'RangedAttackTest',
    'MeleeAttackTest',
    'ThrownAttackTest',
    'SpellCastingTest' // если заклинания тоже атакуют
  ];

  for (let testName of attackTests) {
    const TestClass = tests[testName];
    if (!TestClass || !TestClass.prototype) continue;

    // Перехватываем метод execute
    const originalExecute = TestClass.prototype.execute;
    if (originalExecute) {
      TestClass.prototype.execute = async function(...args) {
        await applySizeModifier(this);
        return originalExecute.apply(this, args);
      };
      console.log(`${MODULE_NAME}: Перехвачен ${testName}.execute`);
    }
  }

  console.log(`${MODULE_NAME}: Модуль инициализирован.`);
});

/**
 * Извлекает размер цели и добавляет модификатор к пулу атаки
 * @param {object} testInstance - экземпляр теста (например, RangedAttackTest)
 */
async function applySizeModifier(testInstance) {
  const targetUuids = testInstance.data?.targetUuids || [];
  if (targetUuids.length === 0) return;

  const targetUuid = targetUuids[0]; // первая цель (для простоты)
  const target = await fromUuid(targetUuid);
  if (!target) return;

  const targetActor = target.actor || target;
  if (!targetActor) return;

  // Только живые типы
  if (!LIVING_TYPES.includes(targetActor.type)) return;

  // Вычисляем размер по Body+Strength
  const body = targetActor.system?.attributes?.body?.value;
  const strength = targetActor.system?.attributes?.strength?.value;
  if (body === undefined || strength === undefined) return;

  const total = body + strength;
  const sizeInfo = getSizeCategory(total);
  if (!sizeInfo) return;

  const modifier = sizeInfo.mod;
  if (modifier === 0) return; // для среднего ничего не добавляем

  // Добавляем модификатор к пулу
  if (!testInstance.data.pool) return;
  if (!testInstance.data.pool.mod) testInstance.data.pool.mod = [];

  testInstance.data.pool.mod.push({
    name: `Размер цели (${sizeInfo.category})`,
    value: modifier
  });

  console.log(`${MODULE_NAME}: Добавлен модификатор ${modifier} для цели (Body+Str=${total})`);
}

/**
 * Определяет категорию размера по сумме Тела и Силы.
 * @param {number} total - сумма Body+Strength
 * @returns {object|null} { category: string, mod: number }
 */
function getSizeCategory(total) {
  for (let level of SIZE_THRESHOLDS) {
    if (total <= level.max) {
      return { category: level.category, mod: level.mod };
    }
  }
  return null; // не должно случиться
}