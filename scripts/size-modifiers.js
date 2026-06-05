const MODULE_NAME = 'sr5-some-options';

const SIZE_THRESHOLDS = [
  { max: 4, category: 'small', mod: -1 },      // Небольшой
  { max: 10, category: 'medium', mod: 0 },     // Средний
  { max: 15, category: 'bulky', mod: +1 },     // Объемный
  { max: Infinity, category: 'large', mod: +2 } // Большой
];

const LIVING_TYPES = ['character', 'critter'];

function getSizeCategory(total) {
  for (let level of SIZE_THRESHOLDS) {
    if (total <= level.max) {
      return { category: level.category, mod: level.mod };
    }
  }
  return null;
}

async function applySizeModifier(testInstance) {
  const targetUuids = testInstance.data?.targetUuids || [];
  if (targetUuids.length === 0) return;

  const targetUuid = targetUuids[0];
  const target = await fromUuid(targetUuid);
  if (!target) return;

  const targetActor = target.actor || target;
  if (!targetActor) return;

  if (!LIVING_TYPES.includes(targetActor.type)) return;

  const body = targetActor.system?.attributes?.body?.value;
  const strength = targetActor.system?.attributes?.strength?.value;
  if (body === undefined || strength === undefined) return;

  const total = body + strength;
  const sizeInfo = getSizeCategory(total);
  if (!sizeInfo) return;

  const modifier = sizeInfo.mod;
  if (modifier === 0) return;

  if (!testInstance.data.pool) return;
  if (!testInstance.data.pool.changes) testInstance.data.pool.changes = [];

  const label = game.i18n.format('SR5_SOME_OPTIONS.Size.ModifierLabel', { category: sizeInfo.category }) || `Размер цели (${sizeInfo.category})`;

  testInstance.data.pool.changes.push({
    name: label,
    value: modifier,
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    priority: 20,
    enabled: true
  });

  console.log(`${MODULE_NAME}: Added size modifier ${modifier} for target (Body+Str=${total})`);
}

export function registerSizeModifiers() {
  console.log(`${MODULE_NAME} | Registering size modifiers`);

  const tests = game.shadowrun5e?.tests;
  if (!tests) {
    console.error(`${MODULE_NAME}: Не удалось найти game.shadowrun5e.tests`);
    return;
  }

  const attackTests = [
    'RangedAttackTest',
    'MeleeAttackTest',
    'ThrownAttackTest',
    'SpellCastingTest'
  ];

  for (let testName of attackTests) {
    const TestClass = tests[testName];
    if (!TestClass || !TestClass.prototype) continue;

    const originalExecute = TestClass.prototype.execute;
    if (originalExecute) {
      TestClass.prototype.execute = async function(...args) {
        if (game.settings.get(MODULE_NAME, 'enableSizeModifiers')) {
          try {
            await applySizeModifier(this);
          } catch (err) {
            console.error(`${MODULE_NAME}: Error applying size modifier`, err);
          }
        }
        return originalExecute.apply(this, args);
      };
      console.log(`${MODULE_NAME}: Intercepted ${testName}.execute for Size Modifiers`);
    }
  }
}
