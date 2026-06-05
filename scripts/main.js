import { registerSettings } from './settings.js';
import { processBleedPeriodic, applyOrUpgradeBleed, LIVING_TYPES } from './bleed.js';
import { processElementalPeriodic, registerElementalListeners, handleAcidDamage, handleColdDamage, handleElectricityDamage, handleFireDamage, ELEMENTAL_CONFIG, VALID_TARGET_TYPES } from './elemental.js';
import { registerSizeModifiers } from './size-modifiers.js';
import { registerSpeedPenalties } from './speed-penalties.js';
import { registerUnopposed, registerUnopposedListeners } from './unopposed.js';

const MODULE_NAME = 'sr5-some-options';

// Single, unified monkey patch on SR5Actor.prototype.addDamage
// This guarantees that bleed and elemental triggers are executed in correct order,
// with zero chaining issues or race conditions.
function registerUnifiedAddDamage() {
    const SR5Actor = game.shadowrun5e?.SR5Actor;
    if (!SR5Actor || !SR5Actor.prototype) {
        console.error(`${MODULE_NAME} | SR5Actor not found!`);
        return;
    }

    const originalAddDamage = SR5Actor.prototype.addDamage;
    if (originalAddDamage) {
        SR5Actor.prototype.addDamage = async function(damageData, ...extraArgs) {
            console.log(`${MODULE_NAME} | addDamage intercepted for ${this.name}`, damageData);

            // 1. Run the original system damage application
            const result = await originalAddDamage.call(this, damageData, ...extraArgs);

            // 2. Process Bleed trigger (Post-damage)
            if (game.settings.get(MODULE_NAME, 'enableBleed') && LIVING_TYPES.includes(this.type)) {
                const sourceStr = typeof damageData?.source === 'string' ? damageData.source : (damageData?.source?.source || '');
                const isBleed = sourceStr === 'bleed';
                
                if (!isBleed && damageData?.value > 5 && damageData?.type?.value === 'physical') {
                    console.log(`${MODULE_NAME} | Applying bleed due to physical damage ${damageData.value}`);
                    await applyOrUpgradeBleed(this, damageData.value);
                }
            }

            // 3. Process Elemental trigger (Post-damage)
            if (game.settings.get(MODULE_NAME, 'enableElemental') && VALID_TARGET_TYPES.includes(this.type)) {
                const sourceStr = typeof damageData?.source === 'string' ? damageData.source : (damageData?.source?.source || '');
                const isPeriodicOrElemental = sourceStr.startsWith('elemental-') || sourceStr === 'bleed' || damageData?.isPeriodic;
                
                if (!isPeriodicOrElemental) {
                    const element = damageData?.element?.value;
                    if (element && ELEMENTAL_CONFIG[element] && damageData.value > 0) {
                        console.log(`${MODULE_NAME} | Applying elemental effect for element: ${element}`);
                        try {
                            switch(element) {
                                case 'acid':
                                    await handleAcidDamage(this, damageData.value);
                                    break;
                                case 'cold':
                                    await handleColdDamage(this, damageData.value);
                                    break;
                                case 'electricity':
                                    await handleElectricityDamage(this, damageData.value);
                                    break;
                                case 'fire':
                                    await handleFireDamage(this, damageData.value);
                                    break;
                            }
                        } catch (err) {
                            console.error(`${MODULE_NAME} | Error applying element ${element}`, err);
                        }
                    }
                }
            }

            return result;
        };
        console.log(`${MODULE_NAME} | Unified addDamage hook registered successfully`);
    } else {
        console.error(`${MODULE_NAME} | SR5Actor.prototype.addDamage not found!`);
    }
}

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

    // Register our unified addDamage override
    registerUnifiedAddDamage();

    // Register size modifiers and speed penalties
    registerSizeModifiers();
    registerSpeedPenalties();

    // Register unopposed hooks
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
