const MODULE_NAME = 'sr5-some-options';
const BLEED_DAMAGE_PER_TICK_BASE = 1;
export const LIVING_TYPES = ['character', 'critter'];

export function registerBleed() {
    console.log(`${MODULE_NAME} | Bleed sub-module loaded`);
}

// Helper to apply or upgrade bleed effect
export async function applyOrUpgradeBleed(actor, damageAmount) {
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

        const content = game.i18n.format('SR5_SOME_OPTIONS.Bleed.Intensified', { name: actor.name, old: oldFlags.damagePerTick, new: newDamagePerTick }) ||
                        `<b>${actor.name}</b>: кровотечение усилилось (урон за тик: ${oldFlags.damagePerTick} → ${newDamagePerTick}).`;

        ChatMessage.create({
            content: content,
            speaker: ChatMessage.getSpeaker({ actor })
        });
    } else {
        const effectName = game.i18n.format('SR5_SOME_OPTIONS.Bleed.EffectName', { amount: damageAmount }) || `Кровотечение (${damageAmount} урона)`;
        const effectData = {
            name: effectName,
            label: effectName,
            img: 'icons/svg/blood.svg',
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

        const content = game.i18n.format('SR5_SOME_OPTIONS.Bleed.Applied', { name: actor.name, body: body }) ||
                        `<b>${actor.name}</b>: начинает кровоточить! (урон каждые ${body} раундов по ${BLEED_DAMAGE_PER_TICK_BASE} ед.)`;

        ChatMessage.create({
            content: content,
            speaker: ChatMessage.getSpeaker({ actor })
        });
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

            const content = game.i18n.format('SR5_SOME_OPTIONS.Bleed.PeriodicDamage', { name: actor.name, damage: flags.damagePerTick }) ||
                            `<b>${actor.name}</b> получает ${flags.damagePerTick} физического урона от кровотечения.`;

            ChatMessage.create({
                content: content,
                speaker: ChatMessage.getSpeaker({ actor })
            });
        }
        
        await bleedEffect.update({ 'flags.bleed.counter': newCounter });
    }
}
