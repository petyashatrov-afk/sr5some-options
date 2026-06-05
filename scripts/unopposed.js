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

    // Hook Defense test failure to add unopposed damage bonus right after defense/dodge roll!
    if (PhysicalDefenseTest?.prototype) {
        const originalProcessFailure = PhysicalDefenseTest.prototype.processFailure;
        PhysicalDefenseTest.prototype.processFailure = async function() {
            await originalProcessFailure.call(this);

            if (game.settings.get(MODULE_NAME, 'enableUnopposed') && this.data.modifiedDamage) {
                const rawPool = getRawPoolValue(this.data.pool);
                if (rawPool < 0) {
                    const bonus = Math.floor(Math.abs(rawPool) / 2);
                    if (bonus > 0) {
                        // Apply bonus natively to modifiedDamage
                        this.data.modifiedDamage.value += bonus;
                        
                        // Add change entry so it's shown in the damage tooltip!
                        this.data.modifiedDamage.changes = this.data.modifiedDamage.changes || [];
                        
                        const label = game.i18n.localize('SR5_SOME_OPTIONS.Unopposed.TooltipLabel') || 'Беззащитность (RG6)';
                        this.data.modifiedDamage.changes.push({
                            name: label,
                            value: bonus,
                            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                            priority: 20,
                            enabled: true
                        });
                        
                        console.log(`${MODULE_NAME} | Added unopposed damage bonus +${bonus} (raw pool ${rawPool}) to defense modifiedDamage`);
                    }
                }
            }
        };
    }
}

export function registerUnopposedListeners() {
    // Render "Resist without defense" button on attack cards
    Hooks.on('renderChatMessage', (message, html, data) => {
        if (!game.settings.get(MODULE_NAME, 'enableUnopposed')) return;

        const jqHtml = $(html);

        const testData = message.getFlag('shadowrun5e', 'test');
        if (!testData?.data) return;

        const testType = testData.data.type;
        const isAttack = ['RangedAttackTest', 'MeleeAttackTest', 'ThrownAttackTest', 'SpellCastingTest'].includes(testType);

        if (isAttack && testData.data.opposed?.resist?.test) {
            let buttonArea = jqHtml.find('.card-buttons--actions').first();
            if (buttonArea.length === 0) {
                buttonArea = $('<div class="card-buttons card-buttons--actions"></div>');
                jqHtml.find('.chat-card').append(buttonArea);
            }

            if (jqHtml.find('.resist-unopposed-btn').length === 0) {
                const label = game.i18n.localize('SR5_SOME_OPTIONS.Unopposed.ButtonLabel') || 'Сопротивление без защиты';
                const btn = $(`
                    <div class="button resist-unopposed-btn" data-message-id="${message.id}" style="margin-top: 5px; background-color: rgba(204, 0, 0, 0.15); border: 1px solid #cc0000; cursor: pointer; display: block; text-align: center; font-weight: bold; border-radius: 4px; padding: 4px 8px; font-size: 13px; line-height: 1.4;">
                        <i class="fas fa-shield-alt"></i> ${label}
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

            const tooltipLabel = game.i18n.localize('SR5_SOME_OPTIONS.Unopposed.TooltipLabel') || 'Беззащитность (RG6)';
            if (bonus > 0) {
                damageData.changes.push({
                    name: tooltipLabel,
                    value: bonus,
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    priority: 20,
                    enabled: true
                });
            }

            // 3. Construct action roll and use TestCreator to correctly populate Body + Armor
            const action = game.shadowrun5e.data.createData('action_roll', {
                test: resistTestClsName,
                attribute: 'body',
                armor: true
            });

            const titleLabel = game.i18n.localize('SR5_SOME_OPTIONS.Unopposed.TitleLabel') || 'Сопротивление (Без защиты)';
            const testData = {
                title: titleLabel,
                previousMessageId: messageId,
                pool: game.shadowrun5e.data.createData('value_field', { label: 'SR5.DicePool' }),
                limit: game.shadowrun5e.data.createData('value_field', { label: 'SR5.Limit' }),
                threshold: game.shadowrun5e.data.createData('value_field', { label: 'SR5.Threshold' }),
                values: {},
                incomingDamage: damageData,
                modifiedDamage: foundry.utils.duplicate(damageData),
                targetUuids: [defender.uuid],
                targetActorsUuid: [defender.uuid]
            };

            const preparedData = game.shadowrun5e.test._prepareTestDataWithAction(action, defender, testData);

            const documents = { source: defender };
            const options = { showDialog: true, showMessage: true };

            const test = new resistTestCls(preparedData, documents, options);
            await test.execute();
        }
    });
}
