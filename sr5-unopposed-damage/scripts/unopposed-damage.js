// sr5-unopposed-damage/scripts/unopposed-damage.js
const MODULE_NAME = 'sr5-unopposed-damage';
const bonusByMessageId = new Map(); // messageId -> bonus

Hooks.once('ready', () => {
  if (game.system.id !== 'shadowrun5e') {
    console.error(`${MODULE_NAME}: Система не Shadowrun 5e, модуль отключён.`);
    return;
  }

  const tests = game.shadowrun5e?.tests;
  if (!tests) {
    console.error(`${MODULE_NAME}: Не удалось найти game.shadowrun5e.tests`);
    return;
  }

  // --- Перехват PhysicalDefenseTest для сохранения бонуса ---
  const DefenseTest = tests['PhysicalDefenseTest'];
  if (DefenseTest?.prototype) {
    const originalDefenseExecute = DefenseTest.prototype.execute;
    if (originalDefenseExecute) {
      DefenseTest.prototype.execute = async function(...args) {
        const targetUuids = this.data?.targetUuids || [];
        const targetUuid = targetUuids[0];
        let targetActor = null;
        if (targetUuid) {
          const target = await fromUuid(targetUuid);
          targetActor = target?.actor || target;
        }

        // Выполняем оригинальный тест
        const result = await originalDefenseExecute.apply(this, args);

        // После выполнения берём modifiers.value и считаем totalPool
        let preModSum = 0;
        if (this.data?.pool?.mod && Array.isArray(this.data.pool.mod)) {
          preModSum = this.data.pool.mod.reduce((sum, mod) => sum + (mod.value || 0), 0);
        }
        let modifiersValue = this.data?.modifiers?.value;
        if (modifiersValue === undefined) {
          return result;
        }
        const totalPool = preModSum + modifiersValue;
        console.log(`${MODULE_NAME}: totalPool = ${totalPool} для цели ${targetActor?.name}`);

        if (totalPool < 0 && targetActor) {
          const bonus = Math.floor(Math.abs(totalPool) / 2);
          if (bonus > 0) {
            // Сохраняем бонус по ID сообщения этого теста
            const messageId = this.data?.messageUuid || this.messageUuid;
            if (messageId) {
              bonusByMessageId.set(messageId, bonus);
              console.log(`${MODULE_NAME}: Для цели ${targetActor.name} сохранён бонус +${bonus} по messageId ${messageId}`);
            }
          }
        }

        return result;
      };
      console.log(`${MODULE_NAME}: Перехвачен PhysicalDefenseTest.execute`);
    }
  }

  // --- Перехват PhysicalResistTest для добавления бонуса к modifiedDamage ---
  const ResistTest = tests['PhysicalResistTest'];
  if (ResistTest?.prototype) {
    const originalResistExecute = ResistTest.prototype.execute;
    if (originalResistExecute) {
      ResistTest.prototype.execute = async function(...args) {
        // Получаем ID предыдущего сообщения (защиты)
        const previousMessageId = this.data?.previousMessageId;
        console.log(`${MODULE_NAME}: previousMessageId = ${previousMessageId}`);
        console.log(`${MODULE_NAME}: все ключи this.data:`, Object.keys(this.data || {}));

        // Функция для проверки и применения бонуса
        const applyBonus = () => {
          if (previousMessageId && bonusByMessageId.has(previousMessageId)) {
            const bonus = bonusByMessageId.get(previousMessageId);
            bonusByMessageId.delete(previousMessageId);
            console.log(`${MODULE_NAME}: Найден бонус ${bonus} для сообщения ${previousMessageId}`);

            if (this.data?.modifiedDamage) {
              const oldDamage = this.data.modifiedDamage.value || 0;
              this.data.modifiedDamage.value = oldDamage + bonus;
              console.log(`${MODULE_NAME}: Добавлен бонус +${bonus} к modifiedDamage (было ${oldDamage}, стало ${this.data.modifiedDamage.value})`);

              ChatMessage.create({
                content: `<b>Бонус за беззащитность:</b> +${bonus} к урону.`,
                speaker: { alias: 'Система RG6' }
              });
            }
            return true;
          }
          return false;
        };

        // Пробуем применить бонус сразу
        if (!applyBonus()) {
          console.log(`${MODULE_NAME}: Бонус не найден сразу, пробуем через 100 мс...`);
          // Если не нашли, пробуем через небольшую задержку
          await new Promise(resolve => setTimeout(resolve, 100));
          applyBonus();
        }

        return originalResistExecute.apply(this, args);
      };
      console.log(`${MODULE_NAME}: Перехвачен PhysicalResistTest.execute`);
    }
  }

  console.log(`${MODULE_NAME}: Модуль инициализирован.`);
});