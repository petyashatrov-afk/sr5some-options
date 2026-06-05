import { registerSettings } from './settings.js';
import { registerBleed, processBleedPeriodic } from './bleed.js';
import { registerElemental, processElementalPeriodic, registerElementalListeners } from './elemental.js';
import { registerSizeModifiers } from './size-modifiers.js';
import { registerSpeedPenalties } from './speed-penalties.js';
import { registerUnopposed, registerUnopposedListeners } from './unopposed.js';

const MODULE_NAME = 'sr5-some-options';

Hooks.once('init', () => {
    console.log(`${MODULE_NAME} | Initializing Combined Options module`);
    registerSettings();
});

Hooks.once('ready', () => {
    console.log(`${MODULE_NAME} | Ready hook triggered`);

    if (game.system.id !== 'shadowrun5e') {
        console.warn(`${MODULE_NAME} | System is not Shadowrun 5e, disabling module functionality.`);
        return;
    }

    // Register each option sub-mechanic
    registerBleed();
    registerElemental();
    registerSizeModifiers();
    registerSpeedPenalties();
    registerUnopposed();

    // Register event/chat listeners
    registerElementalListeners();
    registerUnopposedListeners();

    console.log(`${MODULE_NAME} | Module fully loaded and initialized`);
});

Hooks.on('updateCombat', async (combat, update, options, userId) => {
    // Process round-based periodic checks
    await processBleedPeriodic(combat, update, options, userId);
    await processElementalPeriodic(combat, update, options, userId);
});
