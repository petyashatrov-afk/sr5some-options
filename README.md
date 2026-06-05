SR5 Combined Options & Mechanics (v14 Compatible)
An all-in-one combined and optimized options module for Shadowrun 5th Edition (SR5-FoundryVTT) on Foundry VTT v14.

This module unifies 5 essential house rules and game mechanics into a single module with convenient world settings toggles:

Bleeding (Bleed) (from Bullets & Bandages) — Automatically applies and upgrades bleeding physical damage ticks when taking more than 5 physical damage from a single attack.
Elemental Damage — Adds automatic status effects and 1-click resistance tests for Acid, Cold, Electricity, and Fire.
Size Modifiers (RG2) — Applies dice pool modifiers to attack tests based on the target metahuman's size (calculated from the sum of Body + Strength).
Speed Penalties (RG3) — Applies progressive penalties to attacks and defenses depending on the distance traveled by a token during its combat turn.
Defenselessness Bonus / Unopposed Damage (RG6) — If a defender's defense pool falls below 0 due to modifiers, every 2 negative dice grant a +1 убойность (damage value) bonus.
Key Improvements & Bug Fixes
1. Foundry VTT v14 Compatibility
All scripts have been fully refactored to modular ES standards and updated to support v14 ActiveEffect schemas, document collections, and hooks. Legacy fields (like label and icon in ActiveEffects) have been removed to completely prevent strict validation database crashes.

2. Defenselessness & Unopposed Damage Fixed (RG6)
The Problem: The old module attempted to read non-existent system properties (pool.mod and modifiers.value), which completely broke calculations. Moreover, if the target skipped defense completely (e.g. surprised or defenseless), the defense test was bypassed, resulting in zero bonus applied.
The Solution:
Overrides PhysicalDefenseTest base calculations to intercept raw negative defense pool values before they are capped at 0.
Automatically adds a "Resist Without Defense" button to attack cards. Clicking it runs an in-memory defense test of the defender with all situational penalties (wounds, FA fire modes, cover, speed), calculates the exact negative pool, adds the defenselessness bonus + attacker hits natively to the damage, and opens a fully prepared Body + Armor PhysicalResistTest dialog!
3. Native Elemental Resistance Buttons & Progressive Armor Corrosions
Progressive Armor Penalty (ADD Mode): Acid armor reduction now works progressively. Instead of creating multiple disjointed override effects, it uses a single active effect utilizing ADD -1, which seamlessly updates and scales up (e.g., -1 → -2 → -3) upon subsequent exposures.
1-Click Resist Button: Periodic element reminder cards in chat now feature beautiful, standard-styled "Roll Resist" buttons. Clicking them instantiates a native PhysicalResistTest which automatically Queries the actor's custom elemental resistances (fire resistance, acid armor protection, element immunities) and AP reductions, preparing a perfect native dice pool of Body + Armor!
4. Professional Localization (EN & RU)
Fully translated utilizing Foundry's native translation JSON packs (lang/en.json, lang/ru.json). All settings, buttons, tooltips, and chat cards adapt automatically to the user's selected language.

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
