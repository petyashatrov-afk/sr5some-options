const MODULE_NAME = 'sr5-some-options';

export function registerSettings() {
    game.settings.register(MODULE_NAME, 'enableBleed', {
        name: 'Включить механику кровотечения (Bullets & Bandages)',
        hint: 'Автоматически накладывает эффект кровотечения при получении более 5 ед. физического урона.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableElemental', {
        name: 'Включить элементальные эффекты',
        hint: 'Добавляет автоматические эффекты и проверки для кислоты, холода, электричества и огня.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableSizeModifiers', {
        name: 'Включить модификаторы размера (RG2)',
        hint: 'Добавляет модификаторы к броскам атаки на основе категории размера цели (суммы Тела и Силы).',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableSpeedPenalties', {
        name: 'Включить штрафы за скорость (RG3)',
        hint: 'Применяет штрафы к атакам и защите в зависимости от пройденного персонажем расстояния за ход.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableUnopposed', {
        name: 'Включить бонус беззащитности / Unopposed Damage (RG6)',
        hint: 'Если пул защиты опускается ниже 0, каждые 2 отрицательных кубика дают +1 к получаемому урону.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });
}
