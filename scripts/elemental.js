const MODULE_NAME = 'sr5-some-options';

const LOCALE = {
    ru: {
        acid_effect_name: 'Кислота (УР {dv})',
        acid_armor_damage: 'Снижение брони (-{amount})',
        acid_applied: '{name} покрыт кислотой! Урон {dv}',
        acid_intensified: 'Кислота возрастает! {name} теперь получает {newDV} урона (было {oldDV})',
        acid_continues: '{name} продолжает растворяться кислотой! Получено {dv} урона, осталось {nextDV}',
        acid_burned_out: 'Кислота на {name} выгорела',
        acid_neutralized: '{name} очищен от кислоты с помощью {method}',
        acid_neutralize_desc: 'Кислота продолжает разъедать броню и наносить урон. Требуется нейтрализация.',
        acid_wash_off: 'Смыть водой',

        fire_burning: 'Горение (УР {dv})',
        fire_ignited: '{name} загорелся! Получает {dv} урона в конце каждого раунда',
        fire_auto_ignited: '{name} автоматически загорается! Получает {dv} урона в конце каждого раунда',
        fire_intensified: 'Пламя разгорается сильнее! {name} теперь получает {newDV} урона (было {oldDV})',
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
        cold_resist_prompt: 'Броня <b>{name}</b> подверглась воздействию экстремального холода (БП {ap}). Требуется проверка прочности!',
        cold_resist_button: 'Проверка Брони (Пул: {pool})',

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
        cold_resist_prompt: 'The armor of <b>{name}</b> has been exposed to extreme cold (AP {ap}). An armor resistance test is required!',
        cold_resist_button: 'Armor Resistance (Pool: {pool})',

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
    const keyMap = {
        acid_effect_name: 'SR5_SOME_OPTIONS.Elemental.AcidEffectName',
        acid_armor_damage: 'SR5_SOME_OPTIONS.Elemental.AcidArmorDamage',
        acid_applied: 'SR5_SOME_OPTIONS.Elemental.AcidApplied',
        acid_intensified: 'SR5_SOME_OPTIONS.Elemental.AcidIntensified',
        acid_continues: 'SR5_SOME_OPTIONS.Elemental.AcidContinues',
        acid_burned_out: 'SR5_SOME_OPTIONS.Elemental.AcidBurnedOut',
        acid_neutralized: 'SR5_SOME_OPTIONS.Elemental.AcidNeutralized',
        acid_neutralize_desc: 'SR5_SOME_OPTIONS.Elemental.AcidNeutralizeDesc',
        acid_wash_off: 'SR5_SOME_OPTIONS.Elemental.AcidWashOff',
        fire_burning: 'SR5_SOME_OPTIONS.Elemental.FireBurning',
        fire_ignited: 'SR5_SOME_OPTIONS.Elemental.FireIgnited',
        fire_auto_ignited: 'SR5_SOME_OPTIONS.Elemental.FireAutoIgnited',
        fire_intensified: 'SR5_SOME_OPTIONS.Elemental.FireIntensified',
        fire_continues: 'SR5_SOME_OPTIONS.Elemental.FireContinues',
        fire_not_ignited: 'SR5_SOME_OPTIONS.Elemental.FireNotIgnited',
        fire_extinguished: 'SR5_SOME_OPTIONS.Elemental.FireExtinguished',
        fire_partially_extinguished: 'SR5_SOME_OPTIONS.Elemental.FirePartiallyExtinguished',
        fire_extinguish_prompt: 'SR5_SOME_OPTIONS.Elemental.FireExtinguishPrompt',
        fire_smother: 'SR5_SOME_OPTIONS.Elemental.FireSmother',
        fire_logic_intuition: 'SR5_SOME_OPTIONS.Elemental.FireLogicIntuition',
        fire_manual_damage_button: 'SR5_SOME_OPTIONS.Elemental.FireManualDamageButton',
        cold_armor_broken: 'SR5_SOME_OPTIONS.Elemental.ColdArmorBroken',
        cold_armor_destroyed: 'SR5_SOME_OPTIONS.Elemental.ColdArmorDestroyed',
        cold_armor_critical_glitch: 'SR5_SOME_OPTIONS.Elemental.ColdArmorCriticalGlitch',
        cold_armor_held: 'SR5_SOME_OPTIONS.Elemental.ColdArmorHeld',
        cold_resist_prompt: 'SR5_SOME_OPTIONS.Elemental.ColdResistPrompt',
        cold_resist_button: 'SR5_SOME_OPTIONS.Elemental.ColdResistButton',
        electricity_shock_effect: 'SR5_SOME_OPTIONS.Elemental.ElectricityShockEffect',
        electricity_applied: 'SR5_SOME_OPTIONS.Elemental.ElectricityApplied',
        electricity_extended: 'SR5_SOME_OPTIONS.Elemental.ElectricityExtended',
        electricity_matrix_damage: 'SR5_SOME_OPTIONS.Elemental.ElectricityMatrixDamage',
        electricity_initiative_zero: 'SR5_SOME_OPTIONS.Elemental.ElectricityInitiativeZero',
        auto_fail_no_armor: 'SR5_SOME_OPTIONS.Elemental.AutoFailNoArmor',
        no_acid_effect: 'SR5_SOME_OPTIONS.Elemental.NoAcidEffect',
        fire_ignition_prompt_text: 'SR5_SOME_OPTIONS.Elemental.FireIgnitionPromptText',
        fire_ignition_button: 'SR5_SOME_OPTIONS.Elemental.FireIgnitionButton',
        fire_ignition_test_title: 'SR5_SOME_OPTIONS.Elemental.FireIgnitionTestTitle',
        cold_armor_test_title: 'SR5_SOME_OPTIONS.Elemental.ColdArmorTestTitle',
        extinguish_test_title: 'SR5_SOME_OPTIONS.Elemental.ExtinguishTestTitle'
    };

    const i18nKey = keyMap[key];
    if (i18nKey && game.i18n?.has(i18nKey)) {
        if (Object.keys(args).length === 0) {
            return game.i18n.localize(i18nKey);
        }
        return game.i18n.format(i18nKey, args);
    }

    const lang = game.i18n?.lang || 'en';
    const text = LOCALE[lang]?.[key] || LOCALE.ru[key] || key;
    if (Object.keys(args).length === 0) return text;
    return text.replace(/{(\w+)}/g, (_, k) => args[k] ?? `{${k}}`);
}

export const ELEMENTAL_CONFIG = {
    acid: { name: 'Кислота', icon: 'icons/svg/acid.svg', damageType: 'physical', defaultAP: 0 },
    cold: { name: 'Холод', icon: 'icons/svg/ice.svg', damageType: 'physical', defaultAP: -5 },
    electricity: { name: 'Электричество', icon: 'icons/svg/lightning.svg', damageType: 'stun', defaultAP: -5 },
    fire: { name: 'Огонь', icon: 'icons/svg/fire.svg', damageType: 'physical', defaultAP: -6 }
};

export const VALID_TARGET_TYPES = ['character', 'critter', 'vehicle', 'device', 'drone', 'spirit', 'sprite', 'ic'];

function getAttributeValue(actor, attrName) {
    return actor.system?.attributes?.[attrName]?.value ?? 3;
}

function getTotalArmor(actor) {
    if (typeof actor.getArmor === 'function') {
        const armor = actor.getArmor();
        return armor?.rating?.value ?? 0;
    }
    const armor = actor.system?.armor;
    if (!armor) return 0;
    return armor.value ?? 0;
}

function getFireResistance(actor) {
    const attributes = actor.system?.attributes;
    return attributes?.fire_resistance?.value ?? attributes?.fireResistance?.value ?? 0;
}

// Robust AP Extractor (supports both raw numbers and ModifiableValue structures)
function getRobustAP(damageData, context, defaultAP) {
    if (damageData?.ap != null) {
        if (typeof damageData.ap === 'number') return damageData.ap;
        if (typeof damageData.ap.value === 'number') return damageData.ap.value;
        if (typeof damageData.ap.base === 'number') return damageData.ap.base;
    }
    if (context?.ap != null) {
        if (typeof context.ap === 'number') return context.ap;
        if (typeof context.ap.value === 'number') return context.ap.value;
        if (typeof context.ap.base === 'number') return context.ap.base;
    }
    return defaultAP;
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
    console.log(`${MODULE_NAME} | Elemental damage sub-module loaded`);
}

// Progressively increases a single armor penalty effect using ADD -amount instead of OVERRIDE
async function reduceArmorRating(actor, amount, source) {
    const existing = actor.effects.find(e => e.flags?.elemental?.armorPenalty);
    
    if (existing) {
        // Find existing penalty change value
        const oldChange = existing.changes?.find(c => c.key === 'system.armor.value');
        const oldPenalty = Number(oldChange?.value) || 0; // e.g., -1
        const newPenalty = oldPenalty - amount; // e.g., -1 - 1 = -2
        
        try {
            await existing.update({
                name: l('acid_armor_damage', { amount: Math.abs(newPenalty) }),
                changes: [{
                    key: 'system.armor.value',
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: newPenalty
                }]
            });
            console.log(`${MODULE_NAME} | Updated existing armor penalty to ${newPenalty}`);
        } catch (e) {
            console.error(`${MODULE_NAME} | Error updating armor penalty effect`, e);
        }
    } else {
        // Create new armor penalty effect
        const penalty = -amount;
        const effectData = {
            name: l('acid_armor_damage', { amount: Math.abs(penalty) }),
            img: 'icons/svg/shield-broken.svg',
            icon: 'icons/svg/shield-broken.svg',
            flags: { elemental: { armorPenalty: true, source } },
            changes: [{
                key: 'system.armor.value',
                mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                value: penalty
            }],
            duration: { rounds: null }
        };

        try {
            await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
            console.log(`${MODULE_NAME} | Created new armor penalty effect (${penalty})`);
        } catch (e) {
            console.error(`${MODULE_NAME} | Error creating armor penalty effect`, e);
        }
    }
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
        img: 'icons/svg/shield-broken.svg',
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
    if (existing) {
        try {
            await existing.delete();
        } catch (e) {
            console.error(`${MODULE_NAME} | Error deleting old broken armor effect`, e);
        }
    }

    try {
        await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
    } catch (e) {
        console.error(`${MODULE_NAME} | Error creating broken armor effect`, e);
    }

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

export async function handleAcidDamage(actor, damageData, context) {
    const damageValue = damageData?.value ?? damageData ?? 0;
    const config = ELEMENTAL_CONFIG.acid;
    await reduceArmorRating(actor, 1, 'acid');

    const existing = findElementalEffect(actor, 'acid');
    if (existing) {
        const oldDV = existing.flags?.elemental?.baseDV || 0;
        if (damageValue > oldDV) {
            try {
                await existing.update({
                    'flags.elemental.baseDV': damageValue,
                    'flags.elemental.currentDV': damageValue,
                    'flags.elemental.armorReduced': (existing.flags?.elemental?.armorReduced || 0) + 1,
                    'flags.elemental.ap': getRobustAP(damageData, context, config.defaultAP)
                });
                ChatMessage.create({
                    content: l('acid_intensified', { name: actor.name, oldDV, newDV: damageValue }),
                    speaker: ChatMessage.getSpeaker({ actor })
                });
            } catch (e) {
                console.error(`${MODULE_NAME} | Error updating existing acid effect`, e);
            }
        }
        return;
    }

    const effectData = {
        name: l('acid_effect_name', { dv: damageValue }),
        img: config.icon,
        icon: config.icon,
        flags: {
            elemental: {
                type: 'acid',
                baseDV: damageValue,
                currentDV: damageValue,
                armorReduced: 1,
                ap: getRobustAP(damageData, context, config.defaultAP),
                sourceUuid: context?.sourceActorUuid
            }
        },
        changes: [],
        duration: { rounds: null }
    };

    try {
        await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
        console.log(`${MODULE_NAME} | Successfully created Acid effect (DV ${damageValue})`);
    } catch (e) {
        console.error(`${MODULE_NAME} | Error creating Acid effect`, e);
    }

    ChatMessage.create({
        content: l('acid_applied', { name: actor.name, dv: damageValue }),
        speaker: ChatMessage.getSpeaker({ actor })
    });

    createNeutralizePrompt(actor, 'acid');
}

// Fixed handleColdDamage with thorough diagnostic log to verify extracted AP
export async function handleColdDamage(actor, damageData, context) {
    const config = ELEMENTAL_CONFIG.cold;
    const armor = getTotalArmor(actor);
    const ap = getRobustAP(damageData, context, config.defaultAP);
    const dicePool = Math.max(0, armor + ap);

    console.log(`${MODULE_NAME} | handleColdDamage detail: actor=${actor.name}, armor=${armor}, ap=${ap}, dicePool=${dicePool}, raw AP:`, damageData?.ap, "context AP:", context?.ap);

    createColdResistPrompt(actor, dicePool, ap);
}

function createColdResistPrompt(actor, pool, ap) {
    const content = `
        <div class="elemental-prompt cold" style="border: 1px solid #2196f3; background-color: rgba(33, 150, 243, 0.05); padding: 8px; border-radius: 4px; margin-top: 5px;">
            <p>${l('cold_resist_prompt', { name: actor.name, ap: ap })}</p>
            <div class="card-buttons card-buttons--actions" style="margin-top: 8px;">
                <div class="button cold-resist-btn" 
                     data-actor-uuid="${actor.uuid}" 
                     data-pool="${pool}" 
                     data-ap="${ap}"
                     style="background-color: rgba(33, 150, 243, 0.15); border: 1px solid #2196f3; cursor: pointer; text-align: center; font-weight: bold; border-radius: 4px; padding: 4px 8px;">
                    <i class="fas fa-snowflake"></i> ${l('cold_resist_button', { pool: pool })}
                </div>
            </div>
        </div>
    `;

    ChatMessage.create({
        content,
        speaker: ChatMessage.getSpeaker({ actor })
    });
}

export async function handleElectricityDamage(actor, damageData, context) {
    const damageValue = damageData?.value ?? damageData ?? 0;
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
        try {
            const currentRounds = existing.duration?.rounds ?? 1;
            await existing.update({ 'duration.rounds': currentRounds + 1 });
            ChatMessage.create({
                content: l('electricity_extended', { name: actor.name, rounds: currentRounds + 1 }),
                speaker: ChatMessage.getSpeaker({ actor })
            });
        } catch (e) {
            console.error(`${MODULE_NAME} | Error updating electricity effect duration`, e);
        }
    } else {
        const effectData = {
            name: l('electricity_shock_effect'),
            img: config.icon,
            icon: config.icon,
            flags: { elemental: { type: 'electricity' } },
            changes: [
                { key: 'system.modifiers.global', mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: -1 },
                { key: 'system.initiative.mod', mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: -5 }
            ],
            duration: { rounds: 1 }
        };
        try {
            await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
            await reduceInitiative(actor, 5);
            console.log(`${MODULE_NAME} | Successfully created electricity effect`);
        } catch (e) {
            console.error(`${MODULE_NAME} | Error creating electricity effect`, e);
        }

        ChatMessage.create({
            content: l('electricity_applied', { name: actor.name }),
            speaker: ChatMessage.getSpeaker({ actor })
        });
    }
}

// Fixed handleFireDamage to read the exact AP natively from damageData using getRobustAP
export async function handleFireDamage(actor, damageData, context) {
    const config = ELEMENTAL_CONFIG.fire;
    const netHits = context?.netHits ?? 1; // Default to 1 if no context (safer ignition check)
    const ap = getRobustAP(damageData, context, config.defaultAP);

    const armor = getTotalArmor(actor);
    const fireResist = getFireResistance(actor);
    const dicePool = Math.max(0, armor + fireResist + ap);

    createFireIgnitionPrompt(actor, dicePool, netHits, ap);
}

function createFireIgnitionPrompt(actor, pool, netHits, ap) {
    const content = `
        <div class="elemental-prompt fire" style="border: 1px solid #f44336; background-color: rgba(244, 67, 54, 0.05); padding: 8px; border-radius: 4px; margin-top: 5px;">
            <p>${l('fire_ignition_prompt_text', { name: actor.name, threshold: netHits })}</p>
            <div class="card-buttons card-buttons--actions" style="margin-top: 8px;">
                <div class="button fire-ignition-btn" 
                     data-actor-uuid="${actor.uuid}" 
                     data-pool="${pool}" 
                     data-nethits="${netHits}" 
                     data-ap="${ap}"
                     style="background-color: rgba(244, 67, 54, 0.15); border: 1px solid #f44336; cursor: pointer; text-align: center; font-weight: bold; border-radius: 4px; padding: 4px 8px;">
                    <i class="fas fa-fire"></i> ${l('fire_ignition_button', { pool: pool, threshold: netHits })}
                </div>
            </div>
        </div>
    `;

    ChatMessage.create({
        content,
        speaker: ChatMessage.getSpeaker({ actor })
    });
}

async function applyBurningEffect(actor, initialDV, ap, reason) {
    const existing = findElementalEffect(actor, 'fire');
    if (existing) {
        const currentDV = existing.flags?.elemental?.currentDV || 0;
        if (initialDV > currentDV) {
            try {
                await existing.update({
                    'flags.elemental.currentDV': initialDV,
                    'flags.elemental.ap': ap
                });
                ChatMessage.create({
                    content: l('fire_intensified', { name: actor.name, oldDV: currentDV, newDV: initialDV }),
                    speaker: ChatMessage.getSpeaker({ actor })
                });
            } catch (e) {
                console.error(`${MODULE_NAME} | Error updating fire effect`, e);
            }
        }
        return;
    }

    const effectData = {
        name: l('fire_burning', { dv: initialDV }),
        img: ELEMENTAL_CONFIG.fire.icon,
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

    try {
        await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
        console.log(`${MODULE_NAME} | Successfully created Fire burning effect (DV ${initialDV})`);
    } catch (e) {
        console.error(`${MODULE_NAME} | Error creating Fire burning effect`, e);
    }

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
                <div class="button neutralize-action" data-actor-uuid="${actor.uuid}" data-action="water" style="background-color: rgba(76, 175, 80, 0.15); border: 1px solid #4caf50;">
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
                <div class="button extinguish-action" data-actor-uuid="${actor.uuid}" data-method="logic-intuition" style="flex: 1; min-width: 120px; background-color: rgba(33, 150, 243, 0.15); border: 1px solid #2196f3;">
                    <i class="fas fa-brain"></i> ${l('fire_logic_intuition')}
                </div>
                <div class="button extinguish-action" data-actor-uuid="${actor.uuid}" data-method="full" style="flex: 1; min-width: 120px; background-color: rgba(244, 67, 54, 0.15); border: 1px solid #f44336;">
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
            let currentDV = acidEffect.flags?.elemental?.currentDV;
            if (currentDV > 0) {
                const ap = acidEffect.flags?.elemental?.ap ?? ELEMENTAL_CONFIG.acid.defaultAP;
                
                // Acid Periodic Reminder with resistance roll request button
                const content = `
                    <div class="elemental-reminder acid" style="border: 1px solid #4caf50; background-color: rgba(76, 175, 80, 0.05); padding: 8px; border-radius: 4px; margin-top: 5px;">
                        <p><b>${actor.name}</b> продолжает страдать от кислоты (УР ${currentDV}, БП ${ap}).</p>
                        <div class="card-buttons card-buttons--actions" style="margin-top: 8px;">
                            <div class="button elemental-resist-btn" 
                                 data-actor-uuid="${actor.uuid}" 
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
                try {
                    await acidEffect.update({ 'flags.elemental.currentDV': currentDV });
                } catch (e) {
                    console.error(`${MODULE_NAME} | Error updating periodic acid DV`, e);
                }

                if (currentDV <= 0) {
                    try {
                        await acidEffect.delete();
                    } catch (e) {
                        console.error(`${MODULE_NAME} | Error deleting burned out acid effect`, e);
                    }
                    ChatMessage.create({
                        content: l('acid_burned_out', { name: actor.name }),
                        speaker: ChatMessage.getSpeaker({ actor })
                    });
                }
            }
        }

        const fireEffect = findElementalEffect(actor, 'fire');
        if (fireEffect) {
            let currentDV = fireEffect.flags?.elemental?.currentDV;
            const ap = fireEffect.flags?.elemental?.ap ?? ELEMENTAL_CONFIG.fire.defaultAP;
            
            // Fire Periodic Reminder with resistance roll request button
            const content = `
                <div class="elemental-reminder fire" style="border: 1px solid #f44336; background-color: rgba(244, 67, 54, 0.05); padding: 8px; border-radius: 4px; margin-top: 5px;">
                    <p><b>${actor.name}</b> продолжает гореть (УР ${currentDV}, БП ${ap}).</p>
                    <div class="card-buttons card-buttons--actions" style="margin-top: 8px;">
                        <div class="button elemental-resist-btn" 
                             data-actor-uuid="${actor.uuid}" 
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
            try {
                await fireEffect.update({
                    'flags.elemental.currentDV': newDV,
                    'flags.elemental.turnsBurning': (fireEffect.flags?.elemental?.turnsBurning || 0) + 1
                });
            } catch (e) {
                console.error(`${MODULE_NAME} | Error updating periodic fire DV`, e);
            }
        }
    }
}

export function registerElementalListeners() {
    // Acid Neutralize (using global delegation with actor-uuid support)
    $(document).on('click', '.neutralize-action', async (event) => {
        event.preventDefault();
        const button = $(event.currentTarget);
        const actorUuid = button.data('actor-uuid');
        if (!actorUuid) return;

        const actor = await fromUuid(actorUuid);
        if (!actor) return;

        const acidEffect = findElementalEffect(actor, 'acid');
        if (!acidEffect) {
            ui.notifications.warn(l('no_acid_effect'));
            return;
        }

        try {
            await acidEffect.delete();
            ChatMessage.create({
                content: l('acid_neutralized', { name: actor.name, method: l('acid_wash_off') }),
                speaker: ChatMessage.getSpeaker({ actor })
            });
        } catch (e) {
            console.error(`${MODULE_NAME} | Error deleting neutralized acid effect`, e);
        }
    });

    // Fire Extinguish (using global delegation with actor-uuid support)
    $(document).on('click', '.extinguish-action', async (event) => {
        event.preventDefault();
        const button = $(event.currentTarget);
        const actorUuid = button.data('actor-uuid');
        const method = button.data('method');
        if (!actorUuid) return;

        const actor = await fromUuid(actorUuid);
        if (!actor) return;

        const fireEffect = findElementalEffect(actor, 'fire');
        if (!fireEffect) return;

        if (method === 'full') {
            try {
                await fireEffect.delete();
                ChatMessage.create({
                    content: l('fire_extinguished', { name: actor.name }),
                    speaker: ChatMessage.getSpeaker({ actor })
                });
            } catch (e) {
                console.error(`${MODULE_NAME} | Error deleting extinguished fire effect`, e);
            }
            return;
        }

        if (method === 'logic-intuition') {
            const logic = getAttributeValue(actor, 'logic');
            const intuition = getAttributeValue(actor, 'intuition');
            const pool = logic + intuition;

            const testCreator = game.shadowrun5e?.test;
            if (!testCreator) return;

            const test = testCreator.fromPool({ pool: pool, threshold: 0 }, { showDialog: true });
            if (!test) return;

            // Set descriptive title!
            Object.defineProperty(test, 'title', {
                get: () => l('extinguish_test_title')
            });

            await test.execute();
            const hits = test.hits.value;
            const currentDV = fireEffect.flags?.elemental?.currentDV || 0;
            const newDV = Math.max(0, currentDV - hits);

            if (newDV <= 0) {
                try {
                    await fireEffect.delete();
                    ChatMessage.create({
                        content: l('fire_extinguished', { name: actor.name }),
                        speaker: ChatMessage.getSpeaker({ actor })
                    });
                } catch (e) {
                    console.error(`${MODULE_NAME} | Error deleting extinguished fire effect`, e);
                }
            } else {
                try {
                    await fireEffect.update({ 'flags.elemental.currentDV': newDV });
                    ChatMessage.create({
                        content: l('fire_partially_extinguished', { name: actor.name, oldDV: currentDV, newDV, hits }),
                        speaker: ChatMessage.getSpeaker({ actor })
                    });
                } catch (e) {
                    console.error(`${MODULE_NAME} | Error updating partially extinguished fire effect DV`, e);
                }
            }
        }
    });

    // Click handler for cold armor resistance prompt button! (resolves cold armor test properly)
    $(document).on('click', '.cold-resist-btn', async (event) => {
        event.preventDefault();
        const btn = $(event.currentTarget);
        const actorUuid = btn.data('actor-uuid');
        const pool = Number(btn.data('pool'));
        if (!actorUuid) return;

        const actor = await fromUuid(actorUuid);
        if (!actor) return;

        const testCreator = game.shadowrun5e?.test;
        if (!testCreator) return;

        const test = testCreator.fromPool({ pool: pool, threshold: 1 }, { showDialog: true });
        if (!test) return;

        // Set descriptive title!
        Object.defineProperty(test, 'title', {
            get: () => l('cold_armor_test_title')
        });

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
    });

    // Click handler for the custom Fire Ignition button (same style as others)
    $(document).on('click', '.fire-ignition-btn', async (event) => {
        event.preventDefault();
        const btn = $(event.currentTarget);
        const actorUuid = btn.data('actor-uuid');
        const pool = Number(btn.data('pool'));
        const netHits = Number(btn.data('nethits'));
        const ap = Number(btn.data('ap'));
        if (!actorUuid) return;

        const actor = await fromUuid(actorUuid);
        if (!actor) return;

        const testCreator = game.shadowrun5e?.test;
        if (!testCreator) return;

        const test = testCreator.fromPool({ pool: pool, threshold: netHits }, { showDialog: true });
        if (!test) return;

        // Set descriptive title!
        Object.defineProperty(test, 'title', {
            get: () => l('fire_ignition_test_title')
        });

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
    });

    // Click handler for our newly improved resistance button! (uses global delegation and fromUuid)
    $(document).on('click', '.elemental-resist-btn', async (event) => {
        event.preventDefault();
        const btn = $(event.currentTarget);
        const actorUuid = btn.data('actor-uuid');
        const element = btn.data('element');
        const dv = Number(btn.data('dv'));
        const ap = Number(btn.data('ap'));
        if (!actorUuid) return;

        const actor = await fromUuid(actorUuid);
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

        // Fully construct the action object of the test (critical fix for prepareActorModifiers error!)
        const action = game.shadowrun5e.data.createData('action_roll', {
            test: 'PhysicalResistTest',
            attribute: 'body',
            armor: true
        });

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

        // Leverage the native TestCreator._prepareTestDataWithAction to lookup Body attribute and add it to the pool
        const preparedData = game.shadowrun5e.test._prepareTestDataWithAction(action, actor, testData);

        // Crucial fix: Pass BOTH actor and source in documents so that this.actor is correctly populated!
        const documents = { actor: actor, source: actor };
        const options = { showDialog: true, showMessage: true };

        const test = new PhysicalResistTestCls(preparedData, documents, options);
        await test.execute();
    });
}
