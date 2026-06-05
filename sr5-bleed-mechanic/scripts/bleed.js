// sr5-bleed/scripts/bleed.js
const MODULE_NAME = 'sr5-bleed';
const BLEED_DAMAGE_PER_TICK_BASE = 1;
const LIVING_TYPES = ['character', 'critter'];

Hooks.once('ready', () => {
    console.log(`${MODULE_NAME}: Hooks ready triggered`);
    
    if (game.system.id !== 'shadowrun5e') {
        console.error(`${MODULE_NAME}: Система не Shadowrun 5e, модуль отключён.`);
        return;
    }

    const SR5Actor = game.shadowrun5e?.SR5Actor;
    if (!SR5Actor || !SR5Actor.prototype) {
        console.error(`${MODULE_NAME}: Не удалось найти SR5Actor.`);
        return;
    }

    // Перехватываем addDamage только для кровотечения
    const originalAddDamage = SR5Actor.prototype.addDamage;
    if (originalAddDamage) {
        SR5Actor.prototype.addDamage = async function(...args) {
            if (!LIVING_TYPES.includes(this.type)) return originalAddDamage.apply(this, args);
            
            console.log(`${MODULE_NAME}: addDamage вызван для ${this.name}`, args);
            const damageData = args[0];
            const isBleed = damageData?.source?.source === 'bleed';
            
            const result = await originalAddDamage.apply(this, args);
            
            // Кровотечение: только для физического урона >5 и не от самого кровотечения
            if (!isBleed && damageData?.value > 5 && damageData?.type?.value === 'physical') {
                console.log(`${MODULE_NAME}: Обнаружен физический урон ${damageData.value}, накладываем/усиливаем кровотечение.`);
                await applyOrUpgradeBleed(this, damageData.value);
            }
            return result;
        };
        console.log(`${MODULE_NAME}: Перехвачен addDamage`);
    } else {
        console.error(`${MODULE_NAME}: addDamage не найден`);
    }

    // Функция для кровотечения
    async function applyOrUpgradeBleed(actor, damageAmount) {
        const body = actor.system?.attributes?.body?.value || 3;
        const existing = actor.effects.find(e => e.flags?.bleed?.isBleed);
        
        if (existing) {
            // Усиление существующего кровотечения
            const oldFlags = existing.flags.bleed;
            const newDamagePerTick = oldFlags.damagePerTick + 1;
            await existing.update({
                'flags.bleed.damagePerTick': newDamagePerTick,
                'flags.bleed.counter': body,
                'flags.bleed.interval': body,
                'duration.rounds': 10 // продлеваем эффект
            });
            ChatMessage.create({
                content: `<b>${actor.name}</b>: кровотечение усилилось (урон за тик: ${oldFlags.damagePerTick} → ${newDamagePerTick}).`,
                speaker: { alias: 'Система кровотечения' }
            });
        } else {
            // Новое кровотечение
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
                speaker: { alias: 'Система кровотечения' }
            });
        }
    }

    // Периодический урон от кровотечения (раз в раунд)
    Hooks.on('updateCombat', async (combat, update, options, userId) => {
        if (update.round === undefined) return; // только при смене раунда
        
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
                    speaker: { alias: 'Система кровотечения' }
                });
            }
            
            await bleedEffect.update({ 'flags.bleed.counter': newCounter });
        }
    });

    console.log(`${MODULE_NAME}: Модуль инициализирован.`);
});