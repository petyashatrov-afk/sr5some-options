const MODULE_NAME = 'sr5-some-options';
const BLEED_DAMAGE_PER_TICK_BASE = 1;
const LIVING_TYPES = ['character', 'critter'];

export function registerBleed() {
    console.log(`${MODULE_NAME} | Registering bleed mechanics`);

    const SR5Actor = game.shadowrun5e?.SR5Actor;
    if (!SR5Actor || !SR5Actor.prototype) {
        console.error(`${MODULE_NAME}: Не удалось найти SR5Actor.`);
        return;
    }

    // Intercept addDamage only for bleeding triggers
    const originalAddDamage = SR5Actor.prototype.addDamage;
    if (originalAddDamage) {
        SR5Actor.prototype.addDamage = async function(...args) {
            if (!game.settings.get(MODULE_NAME, 'enableBleed')) {
                return originalAddDamage.apply(this, args);
            }

            if (!LIVING_TYPES.includes(this.type)) return originalAddDamage.apply(this, args);
            
            const damageData = args[0];
            const isBleed = damageData?.source?.source === 'bleed';
            
            const result = await originalAddDamage.apply(this, args);
            
            // Physical damage > 5, not caused by bleeding itself
            if (!isBleed && damageData?.value > 5 && damageData?.type?.value === 'physical') {
                console.log(`${MODULE_NAME}: Physical damage ${damageData.value} received, applying bleed.`);
                await applyOrUpgradeBleed(this, damageData.value);
            }
            return result;
        };
        console.log(`${MODULE_NAME}: Intercepted addDamage for Bleed`);
    }

    // Helper to apply or upgrade bleed effect
    async function applyOrUpgradeBleed(actor, damageAmount) {
        const body = actor.system?.attributes?.body?.value || 3;
        const existing = actor.effects.find(e => e.flags?.bleed?.isBleed);
        
        if (existing) {
            const oldFlags = existing.flags.bleed;
            const newDamagePerTick = oldFlags.damagePerTick + 1;
            await existing.update({
                'flags.bleed.damagePerTick': newDamagePerTick,
                'flags.bleed.counter': body,
                'flags.bleed.interval': body,
                'duration.rounds': 10
            });
            ChatMessage.create({
                content: `<b>${actor.name}</b>: кровотечение усилилось (урон за тик: ${oldFlags.damagePerTick} → ${newDamagePerTick}).`,
                speaker: ChatMessage.getSpeaker({ actor })
            });
        } else {
            const effectData = {
                name: `Кровотечение (${damageAmount} урона)`,
                icon: 'icons/svg/blood.svg',
                flags: {
                    bleed: {
                        isBleed: true,
                        counter: body,
                        interval: body,
                        damagePerTick: BLEED_DAMAGE_PER_TICK_BASE
                    }
                },
                changes: [],
                duration: { rounds: 10 }
            };
            await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
            ChatMessage.create({
                content: `<b>${actor.name}</b>: начинает кровоточить! (урон каждые ${body} раундов по ${BLEED_DAMAGE_PER_TICK_BASE} ед.)`,
                speaker: ChatMessage.getSpeaker({ actor })
            });
        }
    }
}

// Periodic damage on combat round update
export async function processBleedPeriodic(combat, update, options, userId) {
    if (!game.settings.get(MODULE_NAME, 'enableBleed')) return;
    if (update.round === undefined) return; // only on round change
    
    console.log(`${MODULE_NAME}: Новый раунд ${update.round}, проверяем кровотечения.`);
    
    for (let combatant of combat.combatants) {
        const actor = combatant.actor;
        if (!actor) continue;
        
        const bleedEffect = actor.effects.find(e => e.flags?.bleed?.isBleed);
        if (!bleedEffect) continue;
        
        const flags = bleedEffect.flags.bleed;
        let newCounter = flags.counter - 1;
        
        if (newCounter <= 0) {
            console.log(`${MODULE_NAME}: ${actor.name} получает урон от кровотечения.`);
            const bleedDamage = {
                value: flags.damagePerTick,
                type: { value: 'physical' },
                source: { source: 'bleed' }
            };
            await actor.addDamage(bleedDamage);
            newCounter = flags.interval;
            ChatMessage.create({
                content: `<b>${actor.name}</b> получает ${flags.damagePerTick} физического урона от кровотечения.`,
                speaker: ChatMessage.getSpeaker({ actor })
            });
        }
        
        await bleedEffect.update({ 'flags.bleed.counter': newCounter });
    }
}
