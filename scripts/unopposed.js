const MODULE_NAME = 'sr5-some-options';

function getRawPoolValue(poolField) {
    let val = poolField.base || 0;
    const changes = [...(poolField.changes || [])].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        if (!change.enabled) continue;
        if (change.name === 'SR5.EnforcedMinimum' || change.name === 'SR5.EnforcedMaximum') continue;
        
        switch (change.mode) {
            case CONST.ACTIVE_EFFECT_MODES.ADD:
            case CONST.ACTIVE_EFFECT_MODES.CUSTOM:
                val += change.value;
                break;
            case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
                val *= change.value;
                break;
            case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
                val = change.value;
                break;
            case CONST.ACTIVE_EFFECT_MODES.UPGRADE:
                if (val < change.value) val = change.value;
                break;
            case CONST.ACTIVE_EFFECT_MODES.DOWNGRADE:
                if (val > change.value) val = change.value;
                break;
        }
    }
    return Math.ceil(val);
}

function getSelectedActorsOrCharacter() {
    let actors = canvas.tokens?.controlled.map(t => t.actor).filter(Boolean);
    if (!actors || actors.length === 0) {
        if (game.user?.character) {
            actors = [game.user.character];
        } else {
            actors = [];
        }
    }
    return actors;
}

export function registerUnopposed() {
    console.log(`${MODULE_NAME} | Registering unopposed damage handlers`);

    const PhysicalDefenseTest = game.shadowrun5e?.tests?.PhysicalDefenseTest;
    const PhysicalResistTest = game.shadowrun5e?.tests?.PhysicalResistTest;

    // Intercept defense test to save raw negative pool bonus
    if (PhysicalDefenseTest?.prototype) {
        const originalCalculateBaseValues = PhysicalDefenseTest.prototype.calculateBaseValues;
        PhysicalDefenseTest.prototype.calculateBaseValues = function() {
            originalCalculateBaseValues.call(this);
            if (game.settings.get(MODULE_NAME, 'enableUnopposed')) {
                const rawPool = getRawPoolValue(this.data.pool);
                if (rawPool < 0) {
                    const bonus = Math.floor(Math.abs(rawPool) / 2);
                    if (bonus > 0) {
                        this.data.unopposedDamageBonus = bonus;
                        console.log(`${MODULE_NAME} | Negative defense pool raw value ${rawPool}, saving bonus +${bonus}`);
                    }
                }
            }
        };
    }

    // Intercept resist test to apply the negative pool bonus
    if (PhysicalResistTest?.prototype) {
        const originalResistCalculateBaseValues = PhysicalResistTest.prototype.calculateBaseValues;
        PhysicalResistTest.prototype.calculateBaseValues = function() {
            originalResistCalculateBaseValues.call(this);
            if (game.settings.get(MODULE_NAME, 'enableUnopposed')) {
                const bonus = this.data.unopposedDamageBonus || this.data.following?.unopposedDamageBonus;
                if (bonus && bonus > 0) {
                    this.data.incomingDamage.value += bonus;
                    this.data.modifiedDamage.value += bonus;
                    console.log(`${MODULE_NAME} | Applied unopposed damage bonus +${bonus} to resist test`);

                    ChatMessage.create({
                        content: `<b>Бонус за отрицательную защиту (беззащитность):</b> +${bonus} к урону.`,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor })
                    });
                }
            }
        };
    }
}

export function registerUnopposedListeners() {
    // Render button on attack cards to skip defense
    Hooks.on('renderChatMessage', (message, html, data) => {
        if (!game.settings.get(MODULE_NAME, 'enableUnopposed')) return;

        const testData = message.getFlag('shadowrun5e', 'test');
        if (!testData?.data) return;

        const testType = testData.data.type;
        const isAttack = ['RangedAttackTest', 'MeleeAttackTest', 'ThrownAttackTest', 'SpellCastingTest'].includes(testType);

        if (isAttack && testData.data.opposed?.resist?.test) {
            let buttonArea = html.find('.card-buttons--actions').first();
            if (buttonArea.length === 0) {
                buttonArea = $('<div class="card-buttons card-buttons--actions"></div>');
                html.find('.chat-card').append(buttonArea);
            }

            if (html.find('.resist-unopposed-btn').length === 0) {
                const btn = $(`
                    <div class="button resist-unopposed-btn" data-message-id="${message.id}" style="margin-top: 5px; background-color: rgba(204, 0, 0, 0.15); border: 1px solid #cc0000; cursor: pointer; display: block; text-align: center; font-weight: bold; border-radius: 4px; padding: 4px 8px;">
                        <i class="fas fa-shield-alt"></i> Сопротивление без защиты
                    </div>
                `);
                buttonArea.append(btn);
            }
        }
    });

    // Handle clicks on the custom "Resist without defense" button
    $(document).on('click', '.resist-unopposed-btn', async (event) => {
        event.preventDefault();
        const btn = $(event.currentTarget);
        const messageId = btn.data('message-id');
        const message = game.messages.get(messageId);
        if (!message) return;

        const testMessageData = message.getFlag('shadowrun5e', 'test');
        if (!testMessageData?.data) return;

        const attackTestData = testMessageData.data;

        // Get selected targets
        const targets = getSelectedActorsOrCharacter();
        if (targets.length === 0) {
            ui.notifications.warn("Необходимо выбрать токен цели!");
            return;
        }

        const resistTestClsName = attackTestData.opposed.resist.test || 'PhysicalResistTest';
        const resistTestCls = game.shadowrun5e.tests[resistTestClsName];

        for (const defender of targets) {
            // 1. Calculate defense pool in-memory to find negative bonus
            const defenseTestClsName = attackTestData.opposed.test || 'PhysicalDefenseTest';
            const defenseTestCls = game.shadowrun5e.tests[defenseTestClsName];
            
            let bonus = 0;
            if (defenseTestCls) {
                try {
                    const defenseTestData = await defenseTestCls._getOpposedActionTestData(attackTestData, defender, messageId);
                    const defenseTest = new defenseTestCls(defenseTestData, { source: defender });
                    await defenseTest._prepareExecution();
                    const rawPool = getRawPoolValue(defenseTest.data.pool);
                    if (rawPool < 0) {
                        bonus = Math.floor(Math.abs(rawPool) / 2);
                    }
                } catch (e) {
                    console.error(`${MODULE_NAME} | Error calculating in-memory defense pool`, e);
                }
            }

            // 2. Prepare incoming damage (attacker's hits vs 0 defender hits)
            const attackerHits = attackTestData.values.hits?.value ?? 0;
            const incomingDamage = attackTestData.damage;

            const damageData = game.shadowrun5e.data.createData('damage');
            damageData.base = incomingDamage.value;
            damageData.value = incomingDamage.value;
            damageData.type.base = incomingDamage.type.value;
            damageData.type.value = incomingDamage.type.value;
            damageData.ap.base = incomingDamage.ap.value;
            damageData.ap.value = incomingDamage.ap.value;
            damageData.element.base = incomingDamage.element.value;
            damageData.element.value = incomingDamage.element.value;
            damageData.biofeedback = incomingDamage.biofeedback;
            damageData.normal_weapon = incomingDamage.normal_weapon;

            // Add attacker's hits as net hits modification
            damageData.changes = damageData.changes || [];
            damageData.changes.push({
                name: 'SR5.Attacker',
                value: attackerHits,
                mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                priority: 20,
                enabled: true
            });

            // 3. Prepare resist test data
            const title = game.i18n.localize(resistTestCls.label) + " (Без защиты)";
            const testData = {
                title,
                previousMessageId: messageId,
                pool: game.shadowrun5e.data.createData('value_field', { label: 'SR5.DicePool' }),
                limit: game.shadowrun5e.data.createData('value_field', { label: 'SR5.Limit' }),
                threshold: game.shadowrun5e.data.createData('value_field', { label: 'SR5.Threshold' }),
                values: {},
                incomingDamage: damageData,
                modifiedDamage: foundry.utils.duplicate(damageData),
                targetUuids: [defender.uuid],
                targetActorsUuid: [defender.uuid],
                unopposedDamageBonus: bonus
            };

            const documents = { source: defender };
            const options = { showDialog: true, showMessage: true };

            const test = new resistTestCls(testData, documents, options);
            await test.execute();
        }
    });
}
