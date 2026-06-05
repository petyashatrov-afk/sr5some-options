SR5 Combined Options & Mechanics (v14 Compatible)
An all-in-one combined and optimized options module for Shadowrun 5th Edition (SR5-FoundryVTT) on Foundry VTT v14.

This module unifies 5 essential house rules and game mechanics into a single module with convenient world settings toggles:

Bleeding (Bleed) (from Bullets & Bandages) — Automatically applies and upgrades bleeding physical damage ticks when taking more than 5 physical damage from a single attack.

Elemental Damage — Adds automatic status effects and 1-click resistance tests for Acid, Cold, Electricity, and Fire.
Size Modifiers (RG2) — Applies dice pool modifiers to attack tests based on the target metahuman's size (calculated from the sum of Body + Strength).

Speed Penalties (RG3) — Applies progressive penalties to attacks and defenses depending on the distance traveled by a token during its combat turn.
Defenselessness Bonus / Unopposed Damage (RG6) — If a defender's defense pool falls below 0 due to modifiers, every 2 negative dice grant a +1 DV (damage value) bonus.



SR5 Combined Options & Mechanics (Совместим с v14)
Объединенный и улучшенный модуль механик для системы Shadowrun 5e (SR5-FoundryVTT) в Foundry VTT v14.

Этот модуль собирает в себе 5 механик с удобными переключателями в настройках мира:

Кровотечение (Bleed) (из Bullets & Bandages) — Автоматически накладывает/усиливает кровотечение при получении более 5 ед. физического урона за раз.
Элементальный урон (Elemental Damage) — Добавляет автоматическое горение, воздействие кислоты, электрошок и холод с быстрыми бросками сопротивления.
Модификаторы размера цели (Size Modifiers, RG2) — Накладывает модификаторы на броски атаки в зависимости от суммы параметров Тела и Силы цели.
Штрафы за скорость (Speed Penalties, RG3) — Применяет штрафы к атакам и защите в зависимости от расстояния, пройденного токеном за текущий проход инициативы.
Бонус за беззащитность / Unopposed Damage (RG6) — Если пул защиты падает ниже 0, каждые 2 отрицательных кубика пула дают +1 к получаемому урону.
Основные улучшения и исправления
1. Совместимость с Foundry VTT v14
Все скрипты переписаны под модульный ES-стандарт, обновлены методы работы с ActiveEffects и хуками. Все устаревшие свойства (вроде label и icon в ActiveEffects) удалены, чтобы предотвратить сбои строгой валидации базы данных в v14.

2. Полное исправление Бонуса за беззащитность (Unopposed Damage / RG6)
Проблема: Старый модуль читал несуществующие свойства (pool.mod и modifiers.value) и не работал. Также он не умел обрабатывать ситуации, когда цель не делает проверку защиты (беззащитна), из-за чего бонус улетал в пустоту.
Решение:
Перехватывает завершение броска защиты, вычисляя отрицательный пул уклонения до сброса в 0.
На карту атаки добавлена кнопка «Сопротивление без защиты». При клике на нее в памяти рассчитывается уклонение цели со всеми штрафами (ранения, укрытие, режим стрельбы FA -9), излишек кубов конвертируется в бонус беззащитности, урон модифицируется на успехи атаки + бонус, и открывается готовый диалог нативного броска Тело + Броня.
3. Интерактивные кнопки элементов и накапливание разъедания брони
Постепенное снижение брони (ADD): Вместо создания кучи разрозненных эффектов OVERRIDE, кислота теперь накладывает ровно один накапливающийся эффект в режиме ADD -1, который плавно увеличивается (например, -1 → -2 → -3) при каждом тике.
Кнопки в 1 клик: Периодические тики кислоты или горения в чате снабжены нативными кнопками «Сопротивление». Клик по ним нативно создает бросок PhysicalResistTest, который автоматически считывает огнестойкость, защиту от кислоты, иммунитеты и AP элемента, готовя верный пул кубов Тело + Броня!
4. Профессиональная локализация (EN & RU)
Модуль полностью переведен на английский и русский языки через нативные словари JSON (lang/en.json, lang/ru.json). Все настройки, кнопки и лог адаптируются под язык пользователя.
