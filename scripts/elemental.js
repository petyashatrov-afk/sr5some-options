const MODULE_NAME = 'sr5-some-options';

const LOCALE = {
    ru: {
        acid_effect_name: 'Кислота (УР {dv})',
        acid_armor_damage: 'Снижение брони (-{amount})',
        acid_applied: '{name} покрыт кислотой! Урон {dv}',
        acid_intensified: 'Кислота усиливается! {name} теперь получает {newDV} урона (было {oldDV})',
        acid_continues: '{name} продолжает гореть кислотой! Получено {dv} урона, осталось {nextDV}',
        acid_burned_out: 'Кислота на {name} выгорела',
        acid_neutralized: '{name} очищен от кислоты с помощью {method}',
        acid_neutralize_desc: 'Кислота продолжает разъедать броню и наносить урон. Требуется нейтрализация.',
        acid_wash_off: 'Смыть водой',

        fire_burning: 'Горение (УР {dv})',
        fire_ignited: '{name} загорелся! Получает {dv} урона в конце каждого раунда',
        fire_auto_ignited: '{name} автоматически загорается! Получает {dv} урона в конце каждого раунда',
        fire_intensified: 'Пламя усиливается! {name} теперь получает {newDV} урона (было {oldDV})',
        fire_continues: '{name} продолжает гореть! Получено {dv} урона, в следующий раз {nextDv}',
        fire_not_ignited: '{name} не загорелся (успехов: {hits})',
        fire_extinguished: '{name} потушил огонь',
        fire_partially_extinguished: '{name} частично потушил огонь! Урон снижен с {oldDV} до {newDV} (успехов: {hits})',
        fire_extinguish_prompt: '{name} горит! Что вы предпримете?',
        fire_smother: 'Сбить пламя (тушение без броска)',
        fire_logic_intuition: 'Логика+Интуиция (тест на тушение)',
        fire_manual_damage_button: 'Применить урон вручную',

        cold_armor_broken: 'Броня {name} уничтожена!',
        cold_armor_destroyed: 'Броня {name} разрушена безвозвратно!',
        cold_armor_critical_glitch: 'Критический сбой! Броня {name} разрушена и нанесла травмы!',
        cold_armor_held: '{name} устоял! Броня выдержала холод (успехов: {hits})',

        electricity_shock_effect: 'Электрошок',
        electricity_applied: '{name} парализован электрошоком!',
        electricity_extended: 'Эффект электрошока продлён на {rounds} раундов',
        electricity_matrix_damage: '{name} получает {physical} физического урона и {matrix} матричного урона от электричества',
        electricity_initiative_zero: '{name} теряет действие из-за электрошока!',

        auto_fail_no_armor: '{name} не имеет брони! Эффект применяется в полную силу',
        no_acid_effect: 'На цели нет эффекта кислоты'
    },
    en: {
        acid_effect_name: 'Acid (DV {dv})',
        acid_armor_damage: 'Armor Reduction (-{amount})',
        acid_applied: '{name} is covered in acid! DV {dv}',
        acid_intensified: 'Acid intensifies! {name} now takes {newDV} damage (was {oldDV})',
        acid_continues: '{name} continues to burn with acid! Received {dv} damage, next DV {nextDV}',
        acid_burned_out: 'Acid on {name} burned out',
        acid_neutralized: '{name} acid neutralized using {method}',
        acid_neutralize_desc: 'Acid continues to corrode armor and deal damage. Neutralization is required.',
        acid_wash_off: 'Wash off with water',

        fire_burning: 'Burning (DV {dv})',
        fire_ignited: '{name} caught fire! Takes {dv} damage at the end of each round',
        fire_auto_ignited: '{name} automatically catches fire! Takes {dv} damage at the end of each round',
        fire_intensified: 'The flames intensify! {name} now takes {newDV} damage (was {oldDV})',
        fire_continues: '{name} continues to burn! Received {dv} damage, next DV {nextDv}',
        fire_not_ignited: '{name} did not catch fire (hits: {hits})',
        fire_extinguished: '{name} extinguished the fire',
        fire_partially_extinguished: '{name} partially extinguished the fire! Damage reduced from {oldDV} to {newDV} (hits: {hits})',
        fire_extinguish_prompt: '{name} is burning! What do you do?',
        fire_smother: 'Smother the flames (no roll)',
        fire_logic_intuition: 'Logic+Intuition (extinguish test)',
        fire_manual_damage_button: 'Apply Damage',

        cold_armor_broken: 'Armor of {name} destroyed!',
        cold_armor_destroyed: 'Armor of {name} permanently destroyed!',
        cold_armor_critical_glitch: 'Critical glitch! Armor of {name} destroyed and caused injuries!',
        cold_armor_held: '{name} held out! Armor resisted cold (hits: {hits})',

        electricity_shock_effect: 'Electricity Shock',
        electricity_applied: '{name} is paralyzed by electricity shock!',
        electricity_extended: 'Electricity shock extended for {rounds} rounds',
        electricity_matrix_damage: '{name} takes {physical} physical damage and {matrix} matrix damage from electricity',
        electricity_initiative_zero: '{name} loses action due to electricity shock!',

        auto_fail_no_armor: '{name} has no armor! Effect applied in full',
        no_acid_effect: 'No acid effect on target'
    }
};

function l(key, args = {}) {
    const lang = game.i18n.lang || 'en';
    const text = LOCALE[lang]?.[key] || LOCALE.ru[key] || key;
    if (Object.keys(args).length === 0) return text;
    return text.replace(/{(\w+)}/g, (_, k) => args[k] ?? `{${k}}`);
}

const ELEMENTAL_CONFIG = {
    acid: { name: 'Кислота', icon: 'icons/svg/acid.svg', damageType: 'physical', defaultAP: 0 },
    cold: { name: 'Холод', icon: 'icons/svg/ice.svg', damageType: 'physical', defaultAP: -5 },
    electricity: { name: 'Электричество', icon: 'icons/svg/lightning.svg', damageType: 'stun', defaultAP: -5 },
    fire: { name: 'Огонь', icon: 'icons/svg/fire.svg', damageType: 'physical', defaultAP: -6 }
};

const VALID_TARGET_TYPES = ['character', 'critter', 'vehicle', 'device', 'drone', 'spirit', 'sprite', 'ic'];
const attackContextMap = new Map();

function getAttributeValue(actor, attrName) {
    return actor.system?.attributes?.[attrName]?.value ?? 3;
}

function getTotalArmor(actor) {
    const armor = actor.system?.armor;
    if (!armor) return 0;
    return (armor.value ?? 0) + (armor.mod ?? 0);
}

function getFireResistance(actor) {
    const attributes = actor.system?.attributes;
    return attributes?.fire_resistance?.value ?? attributes?.fireResistance?.value ?? 0;
}

function determineElementAP(element, testInstance) {
    switch(element) {
        case 'fire': {
            const force = testInstance.data?.force ?? testInstance.item?.system?.force?.value;
            if (force && force > 0) return -force;
            const weapon = testInstance.item;
            if (weapon?.system?.ap?.value) return weapon.system.ap.value;
            return ELEMENTAL_CONFIG.fire.defaultAP;
        }
        case 'acid': return ELEMENTAL_CONFIG.acid.defaultAP;
        case 'cold': return ELEMENTAL_CONFIG.cold.defaultAP;
        case 'electricity': return ELEMENTAL_CONFIG.electricity.defaultAP;
        default: return 0;
    }
}

function isElectronicTarget(actor) {
    return ['device', 'drone', 'vehicle'].includes(actor.type) ||
           (actor.type === 'character' && actor.system?.matrix?.persona);
}

function findElementalEffect(actor, elementType) {
    return actor.effects.find(e => e.flags?.elemental?.type === elementType);
}

export function registerElemental() {
    console.log(`${MODULE_NAME} | Registering elemental damage handlers`);

    const SR5Actor = game.shadowrun5e?.SR5Actor;
    if (!SR5Actor?.prototype?.addDamage) {
        console.error(`${MODULE_NAME}: SR5Actor.addDamage не найден`);
        return;
    }

    const originalAddDamage = SR5Actor.prototype.addDamage;
    SR5Actor.prototype.addDamage = async function(damageData, type, options) {
        if (!game.settings.get(MODULE_NAME, 'enableElemental')) {
            return originalAddDamage.call(this, damageData, type, options);
        }

        if (damageData?.source?.startsWith?.('elemental-') || damageData?.isPeriodic) {
            return originalAddDamage.call(this, damageData, type, options);
        }

        const element = damageData?.element?.value;
        if (!element || !ELEMENTAL_CONFIG[element]) {
            return originalAddDamage.call(this, damageData, type, options);
        }

        if (!VALID_TARGET_TYPES.includes(this.type)) {
            return originalAddDamage.call(this, damageData, type, options);
        }

        const context = attackContextMap.get(this.uuid);
        console.debug(`${MODULE_NAME}: Handling initial ${element} damage for ${this.name}`, { damage: damageData.value, context });

        const result = await originalAddDamage.call(this, damageData, type, options);

        if (damageData.value > 0) {
            try {
                switch(element) {
                    case 'acid':
                        await handleAcidDamage(this, damageData.value, context);
                        break;
                    case 'cold':
                        await handleColdDamage(this, damageData.value, context);
                        break;
                    case 'electricity':
                        await handleElectricityDamage(this, damageData.value, context);
                        break;
                    case 'fire':
                        await handleFireDamage(this, damageData.value, context);
                        break;
                }
            } catch (err) {
                console.error(`${MODULE_NAME}: Error applying ${element} effect`, err);
            }
        }

        attackContextMap.delete(this.uuid);
        return result;
    };

    // Save attack context
    Hooks.on('sr5_afterTestComplete', (test) => {
        if (!game.settings.get(MODULE_NAME, 'enableElemental')) return;

        const attackTestNames = ['RangedAttackTest', 'MeleeAttackTest', 'SpellCastingTest'];
        if (!attackTestNames.includes(test.constructor.name)) return;

        const element = test.data?.damage?.element?.value;
        if (!element || !ELEMENTAL_CONFIG[element]) return;

        const context = {
            element,
            netHits: test.netHits?.value ?? 0,
            damageValue: test.data.damage.value,
            ap: determineElementAP(element, test),
            sourceActorUuid: test.actor?.uuid,
            timestamp: Date.now()
        };

        for (const target of test.targets) {
            const targetActor = target.actor || target;
            if (!targetActor?.uuid) continue;
            attackContextMap.set(targetActor.uuid, context);
            setTimeout(() => attackContextMap.delete(targetActor.uuid), 300000);
        }
    });
}

async function reduceArmorRating(actor, amount, source) {
    const currentArmor = actor.system?.armor?.value ?? 0;
    const newArmor = Math.max(0, currentArmor - amount);

    const effectData = {
        name: l('acid_armor_damage', { amount }),
        icon: 'icons/svg/shield-broken.svg',
        flags: { elemental: { armorPenalty: true, source } },
        changes: [{
            key: 'system.armor.value',
            mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
            value: newArmor
        }],
        duration: { rounds: null }
    };

    const existing = actor.effects.find(e => e.flags?.elemental?.armorPenalty && e.flags?.elemental?.source === source);
    if (existing) await existing.delete();

    await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}

async function breakArmor(actor, severity) {
    const messages = {
        broken: l('cold_armor_broken', { name: actor.name }),
        irreparable: l('cold_armor_destroyed', { name: actor.name }),
        'critical-glitch': l('cold_armor_critical_glitch', { name: actor.name }),
        destroyed: l('cold_armor_destroyed', { name: actor.name })
    };

    await actor.update({ 'system.armor.value': 0 });

    const effectData = {
        name: messages[severity] || messages.broken,
        icon: 'icons/svg/shield-broken.svg',
        flags: { elemental: { brokenArmor: true, severity } },
        changes: [{
            key: 'system.armor.value',
            mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
            value: 0
        }],
        duration: { rounds: null }
    };

    const existing = actor.effects.find(e => e.flags?.elemental?.brokenArmor);
    if (existing) await existing.delete();

    await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);

    ChatMessage.create({
        content: messages[severity] || messages.broken,
        speaker: ChatMessage.getSpeaker({ actor })
    });
}

async function reduceInitiative(actor, amount) {
    const currentInit = actor.system?.initiative?.value ?? 0;
    const newInit = Math.max(0, currentInit - amount);
    await actor.update({ 'system.initiative.value': newInit });
    if (newInit === 0) {
        ChatMessage.create({
            content: l('electricity_initiative_zero', { name: actor.name }),
            speaker: ChatMessage.getSpeaker({ actor })
        });
    }
}

async function handleAcidDamage(actor, damageValue, context) {
    const config = ELEMENTAL_CONFIG.acid;
    await reduceArmorRating(actor, 1, 'acid');

    const existing = findElementalEffect(actor, 'acid');
    if (existing) {
        const oldDV = existing.flags.elemental.baseDV;
        if (damageValue > oldDV) {
            await existing.update({
                'flags.elemental.baseDV': damageValue,
                'flags.elemental.currentDV': damageValue,
                'flags.elemental.armorReduced': existing.flags.elemental.armorReduced + 1,
                'flags.elemental.ap': context?.ap ?? config.defaultAP
            });
            ChatMessage.create({
                content: l('acid_intensified', { name: actor.name, oldDV, newDV: damageValue }),
                speaker: ChatMessage.getSpeaker({ actor })
            });
        }
        return;
    }

    const effectData = {
        name: l('acid_effect_name', { dv: damageValue }),
        icon: config.icon,
        flags: {
            elemental: {
                type: 'acid',
                baseDV: damageValue,
                currentDV: damageValue,
                armorReduced: 1,
                ap: context?.ap ?? config.defaultAP,
                sourceUuid: context?.sourceActorUuid
            }
        },
        changes: [],
        duration: { rounds: null }
    };

    await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);

    ChatMessage.create({
        content: l('acid_applied', { name: actor.name, dv: damageValue }),
        speaker: ChatMessage.getSpeaker({ actor })
    });

    createNeutralizePrompt(actor, 'acid');
}

async function handleColdDamage(actor, damageValue, context) {
    const config = ELEMENTAL_CONFIG.cold;
    const armor = getTotalArmor(actor);
    const ap = context?.ap ?? config.defaultAP;
    const dicePool = Math.max(0, armor + ap);

    const testCreator = game.shadowrun5e?.test;
    if (!testCreator) return;

    const test = await testCreator.fromPool({ pool: dicePool, threshold: 1 }, { showDialog: true });
    if (!test) {
        await breakArmor(actor, 'destroyed');
        return;
    }

    await test.execute();
    const hits = test.hits.value;

    if (hits === 0) {
        const glitch = test.data.values.glitches.value;
        if (glitch?.critical) {
            await breakArmor(actor, 'critical-glitch');
        } else if (glitch?.value) {
            await breakArmor(actor, 'irreparable');
        } else {
            await breakArmor(actor, 'broken');
        }
    } else {
        ChatMessage.create({
            content: l('cold_armor_held', { name: actor.name, hits }),
            speaker: ChatMessage.getSpeaker({ actor })
        });
    }
}

async function handleElectricityDamage(actor, damageValue, context) {
    const config = ELEMENTAL_CONFIG.electricity;
    const isElectronic = isElectronicTarget(actor);

    if (isElectronic) {
        const matrixDamage = Math.floor(damageValue / 2);
        if (matrixDamage > 0) {
            await actor.addDamage({
                value: matrixDamage,
                type: { value: 'matrix' },
                source: 'electricity-shock',
                isPeriodic: true
            }, 'matrix');
            ChatMessage.create({
                content: l('electricity_matrix_damage', { name: actor.name, physical: damageValue, matrix: matrixDamage }),
                speaker: ChatMessage.getSpeaker({ actor })
            });
        }
        return;
    }

    const existing = findElementalEffect(actor, 'electricity');
    if (existing) {
        const currentRounds = existing.duration.rounds ?? 1;
        await existing.update({ 'duration.rounds': currentRounds + 1 });
        ChatMessage.create({
            content: l('electricity_extended', { name: actor.name, rounds: currentRounds + 1 }),
            speaker: ChatMessage.getSpeaker({ actor })
        });
    } else {
        const effectData = {
            name: l('electricity_shock_effect'),
            icon: config.icon,
            flags: { elemental: { type: 'electricity' } },
            changes: [
                { key: 'system.modifiers.global', mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: -1 },
                { key: 'system.initiative.mod', mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: -5 }
            ],
            duration: { rounds: 1 }
        };
        await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
        await reduceInitiative(actor, 5);
        ChatMessage.create({
            content: l('electricity_applied', { name: actor.name }),
            speaker: ChatMessage.getSpeaker({ actor })
        });
    }
}

async function handleFireDamage(actor, damageValue, context) {
    const config = ELEMENTAL_CONFIG.fire;
    const netHits = context?.netHits ?? 0;
    const ap = context?.ap ?? config.defaultAP;

    const armor = getTotalArmor(actor);
    const fireResist = getFireResistance(actor);
    const dicePool = Math.max(0, armor + fireResist + ap);

    const testCreator = game.shadowrun5e?.test;
    if (!testCreator) return;

    const test = await testCreator.fromPool({ pool: dicePool, threshold: netHits }, { showDialog: true });
    if (!test) {
        await applyBurningEffect(actor, 3, ap, 'player-cancelled');
        return;
    }

    await test.execute();
    const hits = test.hits.value;

    if (hits < netHits) {
        await applyBurningEffect(actor, 3, ap, 'failed-test');
    } else {
        ChatMessage.create({
            content: l('fire_not_ignited', { name: actor.name, hits }),
            speaker: ChatMessage.getSpeaker({ actor })
        });
    }
}

async function applyBurningEffect(actor, initialDV, ap, reason) {
    const existing = findElementalEffect(actor, 'fire');
    if (existing) {
        const currentDV = existing.flags.elemental.currentDV;
        if (initialDV > currentDV) {
            await existing.update({
                'flags.elemental.currentDV': initialDV,
                'duration.rounds': null,
                'flags.elemental.ap': ap
            });
            ChatMessage.create({
                content: l('fire_intensified', { name: actor.name, oldDV: currentDV, newDV: initialDV }),
                speaker: ChatMessage.getSpeaker({ actor })
            });
        }
        return;
    }

    const effectData = {
        name: l('fire_burning', { dv: initialDV }),
        icon: ELEMENTAL_CONFIG.fire.icon,
        flags: {
            elemental: {
                type: 'fire',
                baseDV: initialDV,
                currentDV: initialDV,
                turnsBurning: 0,
                ap: ap
            }
        },
        changes: [],
        duration: { rounds: null }
    };

    await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);

    ChatMessage.create({
        content: l('fire_ignited', { name: actor.name, dv: initialDV }),
        speaker: ChatMessage.getSpeaker({ actor })
    });

    createExtinguishPrompt(actor);
}

function createNeutralizePrompt(actor, elementType) {
    if (elementType !== 'acid') return;

    const content = `
        <div class="elemental-prompt acid">
            <p>${l('acid_neutralize_desc')}</p>
            <div class="card-buttons card-buttons--actions">
                <div class="button neutralize-action" data-actor-id="${actor.id}" data-action="water" style="background-color: rgba(76, 175, 80, 0.15); border: 1px solid #4caf50;">
                    <i class="fas fa-tint"></i> ${l('acid_wash_off')}
                </div>
            </div>
        </div>
    `;

    ChatMessage.create({
        content,
        speaker: ChatMessage.getSpeaker({ actor }),
        flags: { [MODULE_NAME]: { type: 'neutralize-prompt', actorId: actor.id, element: elementType } }
    });
}

function createExtinguishPrompt(actor) {
    const content = `
        <div class="elemental-prompt fire">
            <p>${l('fire_extinguish_prompt', { name: actor.name })}</p>
            <div class="card-buttons card-buttons--actions" style="display: flex; gap: 4px; flex-wrap: wrap;">
                <div class="button extinguish-action" data-actor-id="${actor.id}" data-method="logic-intuition" style="flex: 1; min-width: 120px; background-color: rgba(33, 150, 243, 0.15); border: 1px solid #2196f3;">
                    <i class="fas fa-brain"></i> ${l('fire_logic_intuition')}
                </div>
                <div class="button extinguish-action" data-actor-id="${actor.id}" data-method="full" style="flex: 1; min-width: 120px; background-color: rgba(244, 67, 54, 0.15); border: 1px solid #f44336;">
                    <i class="fas fa-fire-extinguisher"></i> ${l('fire_smother')}
                </div>
            </div>
        </div>
    `;

    ChatMessage.create({
        content,
        speaker: ChatMessage.getSpeaker({ actor }),
        flags: { [MODULE_NAME]: { type: 'extinguish-prompt', actorId: actor.id } }
    });
}

export async function processElementalPeriodic(combat, update) {
    if (!game.settings.get(MODULE_NAME, 'enableElemental')) return;
    if (update.round === undefined) return;

    for (const combatant of combat.combatants) {
        const actor = combatant.actor;
        if (!actor) continue;

        const acidEffect = findElementalEffect(actor, 'acid');
        if (acidEffect) {
            let currentDV = acidEffect.flags.elemental.currentDV;
            if (currentDV > 0) {
                const ap = acidEffect.flags.elemental.ap ?? ELEMENTAL_CONFIG.acid.defaultAP;
                
                // Acid Periodic Reminder with resistance roll request button
                const content = `
                    <div class="elemental-reminder acid" style="border: 1px solid #4caf50; background-color: rgba(76, 175, 80, 0.05); padding: 8px; border-radius: 4px; margin-top: 5px;">
                        <p><b>${actor.name}</b> продолжает страдать от кислоты (УР ${currentDV}, БП ${ap}).</p>
                        <div class="card-buttons card-buttons--actions" style="margin-top: 8px;">
                            <div class="button elemental-resist-btn" 
                                 data-actor-id="${actor.id}" 
                                 data-element="acid" 
                                 data-dv="${currentDV}" 
                                 data-ap="${ap}"
                                 style="background-color: rgba(76, 175, 80, 0.15); border: 1px solid #4caf50;">
                                <i class="fas fa-shield-alt"></i> Сопротивление Кислоте (УР ${currentDV})
                            </div>
                        </div>
                    </div>
                `;
                
                ChatMessage.create({
                    content,
                    speaker: ChatMessage.getSpeaker({ actor }),
                    flags: { [MODULE_NAME]: { type: 'periodic-reminder', actorId: actor.id, element: 'acid', dv: currentDV, ap } }
                });

                // Reduce armor and decay DV
                await reduceArmorRating(actor, 1, 'acid-periodic');
                currentDV -= 1;
                await acidEffect.update({ 'flags.elemental.currentDV': currentDV });

                if (currentDV <= 0) {
                    await acidEffect.delete();
                    ChatMessage.create({
                        content: l('acid_burned_out', { name: actor.name }),
                        speaker: ChatMessage.getSpeaker({ actor })
                    });
                }
            }
        }

        const fireEffect = findElementalEffect(actor, 'fire');
        if (fireEffect) {
            let currentDV = fireEffect.flags.elemental.currentDV;
            const ap = fireEffect.flags.elemental.ap ?? ELEMENTAL_CONFIG.fire.defaultAP;
            
            // Fire Periodic Reminder with resistance roll request button
            const content = `
                <div class="elemental-reminder fire" style="border: 1px solid #f44336; background-color: rgba(244, 67, 54, 0.05); padding: 8px; border-radius: 4px; margin-top: 5px;">
                    <p><b>${actor.name}</b> продолжает гореть (УР ${currentDV}, БП ${ap}).</p>
                    <div class="card-buttons card-buttons--actions" style="margin-top: 8px;">
                        <div class="button elemental-resist-btn" 
                             data-actor-id="${actor.id}" 
                             data-element="fire" 
                             data-dv="${currentDV}" 
                             data-ap="${ap}"
                             style="background-color: rgba(244, 67, 54, 0.15); border: 1px solid #f44336;">
                            <i class="fas fa-shield-alt"></i> Сопротивление Огню (УР ${currentDV})
                        </div>
                    </div>
                </div>
            `;
            
            ChatMessage.create({
                content,
                speaker: ChatMessage.getSpeaker({ actor }),
                flags: { [MODULE_NAME]: { type: 'periodic-reminder', actorId: actor.id, element: 'fire', dv: currentDV, ap } }
            });

            // Increase fire intensity for next round
            const newDV = currentDV + 1;
            await fireEffect.update({
                'flags.elemental.currentDV': newDV,
                'flags.elemental.turnsBurning': (fireEffect.flags.elemental.turnsBurning || 0) + 1
            });
        }
    }
}

export function registerElementalListeners() {
    Hooks.on('renderChatMessage', (message, html, data) => {
        if (!game.settings.get(MODULE_NAME, 'enableElemental')) return;

        // Acid Neutralize
        html.find('.neutralize-action').on('click', async (event) => {
            event.preventDefault();
            const button = $(event.currentTarget);
            const actorId = button.data('actor-id');

            const actor = game.actors.get(actorId);
            if (!actor) return;

            const acidEffect = findElementalEffect(actor, 'acid');
            if (!acidEffect) {
                ui.notifications.warn(l('no_acid_effect'));
                return;
            }

            await acidEffect.delete();
            ChatMessage.create({
                content: l('acid_neutralized', { name: actor.name, method: l('acid_wash_off') }),
                speaker: ChatMessage.getSpeaker({ actor })
            });
        });

        // Fire Extinguish
        html.find('.extinguish-action').on('click', async (event) => {
            event.preventDefault();
            const button = $(event.currentTarget);
            const actorId = button.data('actor-id');
            const method = button.data('method');

            const actor = game.actors.get(actorId);
            if (!actor) return;

            const fireEffect = findElementalEffect(actor, 'fire');
            if (!fireEffect) return;

            if (method === 'full') {
                await fireEffect.delete();
                ChatMessage.create({
                    content: l('fire_extinguished', { name: actor.name }),
                    speaker: ChatMessage.getSpeaker({ actor })
                });
                return;
            }

            if (method === 'logic-intuition') {
                const logic = getAttributeValue(actor, 'logic');
                const intuition = getAttributeValue(actor, 'intuition');
                const pool = logic + intuition;

                const testCreator = game.shadowrun5e?.test;
                if (!testCreator) return;

                const test = await testCreator.fromPool({ pool, threshold: 0 }, { showDialog: true });
                if (!test) return;

                await test.execute();
                const hits = test.hits.value;
                const currentDV = fireEffect.flags.elemental.currentDV;
                const newDV = Math.max(0, currentDV - hits);

                if (newDV <= 0) {
                    await fireEffect.delete();
                    ChatMessage.create({
                        content: l('fire_extinguished', { name: actor.name }),
                        speaker: ChatMessage.getSpeaker({ actor })
                    });
                } else {
                    await fireEffect.update({ 'flags.elemental.currentDV': newDV });
                    ChatMessage.create({
                        content: l('fire_partially_extinguished', { name: actor.name, oldDV: currentDV, newDV, hits }),
                        speaker: ChatMessage.getSpeaker({ actor })
                    });
                }
            }
        });

        // Click handler for our newly improved resistance button!
        html.find('.elemental-resist-btn').on('click', async (event) => {
            event.preventDefault();
            const btn = $(event.currentTarget);
            const actorId = btn.data('actor-id');
            const element = btn.data('element');
            const dv = Number(btn.data('dv'));
            const ap = Number(btn.data('ap'));

            const actor = game.actors.get(actorId);
            if (!actor) return;

            const PhysicalResistTestCls = game.shadowrun5e.tests.PhysicalResistTest;

            const damageData = game.shadowrun5e.data.createData('damage');
            damageData.base = dv;
            damageData.value = dv;
            damageData.type.base = 'physical';
            damageData.type.value = 'physical';
            damageData.ap.base = ap;
            damageData.ap.value = ap;
            damageData.element.base = element;
            damageData.element.value = element;

            const testData = {
                title: `Сопротивление периодическому урону от ${element === 'fire' ? 'Огня' : 'Кислоты'}`,
                pool: game.shadowrun5e.data.createData('value_field', { label: 'SR5.DicePool' }),
                limit: game.shadowrun5e.data.createData('value_field', { label: 'SR5.Limit' }),
                threshold: game.shadowrun5e.data.createData('value_field', { label: 'SR5.Threshold' }),
                values: {},
                incomingDamage: damageData,
                modifiedDamage: foundry.utils.duplicate(damageData),
                targetUuids: [actor.uuid],
                targetActorsUuid: [actor.uuid]
            };

            const documents = { source: actor };
            const options = { showDialog: true, showMessage: true };

            const test = new PhysicalResistTestCls(testData, documents, options);
            await test.execute();
        });
    });
}
