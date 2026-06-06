const MODULE_NAME = 'sr5-some-options';

export function registerSettings() {
    game.settings.register(MODULE_NAME, 'enableBleed', {
        name: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableBleedName') || 'Enable Bleed Mechanic (Bullets & Bandages)',
        hint: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableBleedHint') || 'Automatically applies/upgrades bleeding effect when taking more than 5 physical damage.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableElemental', {
        name: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableElementalName') || 'Enable Elemental Effects',
        hint: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableElementalHint') || 'Adds automatic effects and resistance tests for acid, cold, electricity, and fire.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableSizeModifiers', {
        name: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableSizeModifiersName') || 'Enable Size Modifiers (RG2)',
        hint: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableSizeModifiersHint') || 'Applies dice pool modifiers to attack tests based on the target metahuman\'s size (Body + Strength).',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableSpeedPenalties', {
        name: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableSpeedPenaltiesName') || 'Enable Speed Penalties (RG3)',
        hint: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableSpeedPenaltiesHint') || 'Applies speed-based penalties to attack and defense tests depending on distance traveled.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_NAME, 'enableUnopposed', {
        name: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableUnopposedName') || 'Enable Unopposed Damage Bonus (RG6)',
        hint: game.i18n.localize('SR5_SOME_OPTIONS.Settings.EnableUnopposedHint') || 'If defense pool falls below 0, every 2 negative dice grant +1 damage bonus.',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });
}
