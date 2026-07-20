# Звіт про сесію розробки — 2026-07-20

Детальна історія взаємодії з AI-асистентом (Claude Code) під час роботи над проєктом `automaze-todo`. Кожен розділ відповідає одному промпту користувача в хронологічному порядку.

---

## Промпт 1

**Запит користувача:** без тексту, прикріплені файли `README.md` та `docs/test-task-specification.md`.

**Дії асистента:**
- Прочитано `README.md` → файл порожній.
- Прочитано `docs/test-task-specification.md` → знайдено специфікацію тестового завдання (TODO-додаток: список задач, додавання/видалення, пошук, позначення виконаних, фільтр за статусом, пріоритет 1–10, сортування за пріоритетом).
- Спроба уточнити намір користувача через інтерактивне питання (`AskUserQuestion`) — **відхилено користувачем**.

**Результат:** без змін у коді. Уточнення відхилено, очікування наступного промпту.

---

## Промпт 2

**Запит користувача:** повторно прикріплені `docs/test-task-specification.md` та `CLAUDE.md`, без додаткового тексту.

**Дії асистента:**
- Прочитано `CLAUDE.md` (правила проєкту: стек, coding rules, workflow, вимоги до frontend/backend, тести).
- Досліджено файлову структуру `backend/` та `frontend/` (`components/`, `hooks/`, `lib/`, `types/`, `constants/`).
- Перевірено розмір усіх ключових файлів (`wc -c`) → з'ясовано, що весь backend (`models/task.py`, `schemas/task.py`, `routers/tasks.py`, `services/task_service.py`, `database/*`, `main.py`, `requirements.txt`, `pyproject.toml`, `.env`) та більшість frontend-файлів (усі компоненти в `components/task/`, `hooks/*`, `lib/api/tasks.ts`, `lib/utils.ts`, `types/task.ts`, `constants/task.ts`) — порожні (0 байт). Реалізації немає, є лише скелет тек.
- `frontend/app/page.tsx` містив лише заглушку (`<main>TODO App</main>`), `globals.css` — дефолтні стилі Tailwind з Next.js init.
- Підготовлено та представлено детальний план реалізації (backend: моделі/схеми/роутери/сервіси; frontend: типи/хуки/lib/компоненти), з двома відкритими питаннями до користувача (PostgreSQL одразу чи SQLite локально; з чого починати — backend чи frontend).

**Результат:** без змін у коді. План представлено, очікування рішення користувача (workflow-правило CLAUDE.md: "Explain the implementation plan" → "Wait if requirements are unclear").

---

## Промпт 3

**Запит користувача:** детальне технічне завдання — побудувати **лише layout сторінки** TODO-додатку (Next.js 16 App Router, React, TypeScript, Tailwind), без бізнес-логіки. Явні обмеження:
- Без бізнес-логіки, без `useState`, без API, без мок-даних.
- Чистий, сучасний, responsive layout; контейнер по центру, max-width ≈700px; семантичний HTML; охайні відступи й типографіка.
- Обов'язкові елементи: заголовок "TODO App"; поле пошуку; секція фільтра статусу (All/Done/Undone); select сортування за пріоритетом (Ascending/Descending); плейсхолдер порожнього списку задач; секція додавання задачі (текстове поле, select пріоритету 1–10, кнопка Add).
- Використати наявну структуру `components/task/`: `TaskList`, `TaskItem`, `TaskSearch`, `TaskFilters`, `TaskSort`, `TaskForm`, `PriorityBadge` — створити лише ті компоненти, що дійсно потрібні для цього layout.

**Дії асистента:**
1. Прочитано (перед записом) поточний вміст `TaskSearch.tsx`, `TaskFilters.tsx`, `TaskSort.tsx`, `TaskList.tsx`, `TaskForm.tsx` — усі порожні.
2. Створено статичну розмітку (усі — Server Components, без `"use client"`, без стану, без API, без мок-даних):
   - **`frontend/components/task/TaskSearch.tsx`** — `<label>` (visually-hidden) + `<input type="search">`.
   - **`frontend/components/task/TaskFilters.tsx`** — `<fieldset>` + `<legend>` (visually-hidden) із трьома кнопками-пілюлями (All/Done/Undone), стан "активний" позначено статично через `aria-pressed` на першій кнопці (без інтерактивності).
   - **`frontend/components/task/TaskSort.tsx`** — `<label>` + `<select>` з опціями Ascending/Descending.
   - **`frontend/components/task/TaskList.tsx`** — `<ul>` з одним `<li>`-плейсхолдером "No tasks yet. Add your first task below."
   - **`frontend/components/task/TaskForm.tsx`** — `<form>` з текстовим полем задачі, `<select>` пріоритету (опції 1–10, згенеровані статичним масивом), кнопкою `Add`.
   - `TaskItem` та `PriorityBadge` **навмисно не створювалися** — вони не використовуються, доки немає жодних задач для відображення (без мок-даних список порожній).
3. Оновлено **`frontend/app/page.tsx`**: замінено заглушку на композицію нових компонентів у центрованому контейнері (`max-w-175` ≈ 700px), з семантичними секціями (`<header>`, `<section aria-label="...">`).
4. Виправлено попередження лінтера IDE: `max-w-[700px]` → канонічний Tailwind-клас `max-w-175` (700px = 175 × 4px).
5. Перевірка якості коду:
   - `npx tsc --noEmit` — без помилок.
   - `npx eslint` на всіх змінених файлах — без помилок.

**Результат:** створено 5 нових файлів компонентів, оновлено `page.tsx`. Типізація та лінтинг проходять чисто.

---

## Промпт 4 (продовження після переривання)

**Запит користувача:** "Continue from where you left off." → потім "трапилася переривання виконання задачі, продовжити з місця зупину" (переривання під час запуску dev-сервера для візуальної перевірки).

**Дії асистента:**
- Перевірено лог `npm run dev` (Next.js/Turbopack) — сервер фактично піднявся успішно (`✓ Ready in 11.1s`, `http://localhost:3000`); попередній `curl` просто спрацював зарано, до готовності сервера.
- Повторний `curl -o /dev/null -w "%{http_code}"` → `200 OK`; перевірено вміст HTML-відповіді.
- Викликано skill **`run`** для візуальної перевірки через headless-браузер:
  - `chromium-cli` в середовищі відсутній.
  - Встановлено `playwright` (`npx playwright install chromium` — виявилося, Chromium вже був завантажений раніше в `%LOCALAPPDATA%\ms-playwright`).
  - Пакет `playwright` (Node-модуль) встановлено окремо в тимчасову теку scratchpad (`npm install playwright --no-save`), **не** в `frontend/node_modules`, щоб не чіпати залежності проєкту.
  - Написано одноразовий скрипт `screenshot.mjs`: відкриває сторінку у двох viewport'ах — desktop (1280×900) та mobile (390×844), робить скріншоти, перевіряє консоль на помилки.
  - Запущено скрипт → `done []` (жодних помилок у консолі браузера).
- Переглянуто обидва скріншоти:
  - **Desktop:** заголовок по центру, поле пошуку на всю ширину, фільтри у вигляді сегментованого контролу (All активний — темний фон), select сортування праворуч, плейсхолдер порожнього списку у пунктирній рамці, форма додавання в один рядок (текст + пріоритет + кнопка Add).
  - **Mobile:** усі елементи коректно стекуються вертикально, форма додавання — поля та кнопка Add на всю ширину.
  - Layout відповідає вимогам: центрування, max-width ≈700px, responsive, семантична розмітка, охайні відступи.

**Результат:** візуально підтверджено коректність layout на десктопі й мобільному; помилок консолі не виявлено.

---

## Промпт 5

**Запит користувача:** спроба зупинити dev-сервер (команда `netstat` + `taskkill`) — **відхилено користувачем** з питанням "що робить ця команда?".

**Дії асистента:** пояснено призначення команди (пошук PID процесу, що слухає порт 3000, і його примусове завершення через `taskkill /F`), без виконання дії.

---

## Промпт 6

**Запит користувача:** "так, зупинити" (підтвердження зупинки dev-сервера).

**Дії асистента:** виконано `taskkill /F` для процесу на порту 3000 → `SUCCESS: PID 15224 terminated`.

**Результат:** dev-сервер зупинено, порт 3000 звільнено.

---

## Промпт 7

**Запит користувача:** короткий підсумок виконаного (для чату).

**Дії асистента:** надано стислий summary змінених файлів та результатів перевірки (без нових змін у коді).

---

## Промпт 8

**Запит користувача:** детальний звіт по кожному промпту для звітності.

**Дії асистента:** створено цей документ — `docs/dev-report-2026-07-20.md`.

---

## Промпт 9 — Sprint 2: Static Task Rendering

**Запит користувача:** реалізувати Sprint 2 — замінити плейсхолдер порожнього списку на статичний список задач. Явні обмеження: усе ще презентаційний шар, без бізнес-логіки. Вимоги:

- Створити відсутні компоненти `TaskItem` та `PriorityBadge`.
- Визначити модель `Task` у `types/task.ts` (`id`, `title`, `completed`, `priority`, `createdAt`, `updatedAt`) із коректними TypeScript-типами.
- Створити невеликий статичний масив (3–5 задач), дані мають існувати **лише** всередині `app/page.tsx`. Без `useState`, хуків, API, context, мок-сервісу, `localStorage` — дані тимчасові, будуть видалені в наступному спринті.
- `TaskList`: приймати `tasks` через props, рендерити `TaskItem`, зберігати наявний плейсхолдер для порожнього масиву.
- `TaskItem`: чекбокс виконання (disabled), назва задачі, `PriorityBadge`, кнопка Delete-плейсхолдер (disabled); без `"use client"`.
- `PriorityBadge`: колір за діапазоном пріоритету (1–3 зелений, 4–7 жовтий, 8–10 червоний), пріоритет — через props.
- Доступність: семантичний HTML, чекбокси й кнопки disabled, лейбли залишаються доступними.
- Стилі: не змінювати існуючий дизайн, не додавати нові залежності.

**Дії асистента:**

1. Прочитано (перед записом) поточний вміст `TaskItem.tsx`, `PriorityBadge.tsx`, `types/task.ts`, `TaskList.tsx`, `page.tsx`, `constants/task.ts` — усі task-специфічні файли, крім `TaskList.tsx`/`page.tsx`, порожні.
2. **`frontend/types/task.ts`** — додано `type Priority = 1 | 2 | ... | 10` (union замість `number` для суворішої типізації) та `interface Task` з полями `id`, `title`, `completed`, `priority: Priority`, `createdAt`, `updatedAt` (ISO-рядки).
3. **`frontend/components/task/PriorityBadge.tsx`** — створено: приймає `priority: Priority` через props, колір визначається helper-функцією `getPriorityStyles` (green/yellow/red за діапазоном), без дублювання умов.
4. **`frontend/components/task/TaskItem.tsx`** — створено: Server Component (без `"use client"`); `<li>` з disabled+readOnly чекбоксом (readOnly — щоб уникнути React-попередження про контрольований інпут без `onChange`), прихованим `<label htmlFor>` (клас `.visually-hidden`, консистентно з `TaskSearch`/`TaskFilters`), назвою задачі (закреслення через Tailwind, якщо `completed`), `PriorityBadge`, та disabled-кнопкою `Delete` з `aria-label`, що включає назву задачі.
5. **`frontend/components/task/TaskList.tsx`** — оновлено: тепер приймає `tasks: Task[]` через props; якщо масив порожній — рендерить попередній плейсхолдер без змін; інакше — `<ul>` з `TaskItem` для кожної задачі (`key={task.id}`).
6. **`frontend/app/page.tsx`** — додано статичний масив `tasks: Task[]` (4 задачі з різними пріоритетами й станами `completed`) безпосередньо у файлі, з коментарем, що дані тимчасові; масив переданий у `<TaskList tasks={tasks} />`.
7. `TaskForm`, `TaskSearch`, `TaskFilters`, `TaskSort`, `constants/task.ts` — не чіпались (поза скоупом спринту).
8. Перевірка якості коду:
   - `npx tsc --noEmit` — без помилок.
   - `npx eslint` на всіх змінених файлах — без помилок.
9. Візуальна перевірка через `npm run dev` + Playwright-скріншоти (desktop 1280×900, mobile 390×844, повторно встановлений раніше пакет `playwright` у scratchpad-теці): підтверджено кольори бейджів (зелений/жовтий/червоний), закреслення виконаної задачі, disabled-стан чекбоксів і кнопок Delete, збережений існуючий layout; консоль браузера без помилок.
10. Dev-сервер зупинено (`taskkill /F` за PID процесу на порту 3000).

**Результат:** створено 2 нових файли (`PriorityBadge.tsx`, `TaskItem.tsx`), оновлено 3 файли (`types/task.ts`, `TaskList.tsx`, `page.tsx`). Типізація, лінтинг та візуальна перевірка — без зауважень.

---

## Промпт 10

**Запит користувача:** додати детальний звіт по Sprint 2 у `docs/dev-report-2026-07-20.md`.

**Дії асистента:** дописано розділи "Промпт 9" (Sprint 2) та розділ 10, оновлено підсумкові таблиці нижче окремо по спринтах.

---

## Промпт 11 — Sprint 3: Local Task Management

**Запит користувача:** реалізувати Sprint 3 — замінити статичний рендеринг на локальний стан. Додаток має повністю працювати на клієнті, без інтеграції з бекендом і без `localStorage`. Вимоги:

- Перетворити сторінку на Client Component **лише якщо це необхідно**; решту компонентів лишити Server Components, де можливо.
- Використати `useState` для списку задач, ініціалізований наявними статичними задачами.
- **Add Task**: заголовок обов'язковий, тримінг пробілів, ігнорування порожніх заголовків, пріоритет із select, унікальні `id`, автоматичні `createdAt`/`updatedAt`, нова задача додається в кінець списку, форма скидається після успішного створення.
- **Toggle Complete**: клік по чекбоксу перемикає `completed` і оновлює `updatedAt`.
- **Delete Task**: видалення миттєве, без діалогу підтвердження.
- Розподіл відповідальності: `TaskForm` не володіє станом задач, лише емітить "create task"; `TaskList` — суто презентаційний; `TaskItem` — презентаційний, емітить toggle/delete; `Page` — володіє станом задач.
- Доступність збережена; UI, дизайн і залежності — без змін.

**Дії асистента:**

1. **`frontend/components/task/TaskForm.tsx`** — переписано: некерована форма (`FormData` в `onSubmit`, без власного `useState`), тримінг заголовка й ранній вихід при порожньому значенні (`required` на `<input>` як перший рівень захисту від HTML5-валідації + JS-перевірка пробільних заголовків), приймає `onAddTask(title, priority)` через props, викликає `form.reset()` лише після успішного виклику `onAddTask`.
2. **`frontend/components/task/TaskItem.tsx`** — прибрано `disabled`/`readOnly` з чекбоксу, додано `onChange={() => onToggleComplete(task.id)}`; кнопка Delete тепер активна з `onClick={() => onDelete(task.id)}`; компонент приймає `onToggleComplete`/`onDelete` через props, власного стану не має.
3. **`frontend/components/task/TaskList.tsx`** — прокидає `onToggleComplete`/`onDelete` у кожен `TaskItem`, сам лишається чисто презентаційним (жодної бізнес-логіки).
4. **`frontend/app/page.tsx`** — додано директиву `"use client"` (єдина точка входу в клієнтський рендеринг); статичний масив перейменовано на `initialTasks` (початковий стан замість тимчасових даних для показу); додано `useState<Task[]>(initialTasks)` та три обробники:
   - `handleAddTask(title, priority)` — генерує `id` через `crypto.randomUUID()`, `createdAt`/`updatedAt` через `new Date().toISOString()`, додає задачу в кінець масиву;
   - `handleToggleComplete(id)` — `.map()` з інверсією `completed` та оновленням `updatedAt` лише для задачі з відповідним `id`;
   - `handleDeleteTask(id)` — `.filter()` за `id`.
5. `TaskForm`/`TaskList`/`TaskItem` **не отримали власної директиви `"use client"`** — вони імпортуються й рендеряться лише всередині клієнтського `page.tsx`, тому автоматично потрапляють у клієнтський бандл без потреби дублювати директиву (мінімізація `"use client"` виконана буквально).
6. Архітектурне рішення щодо "no unnecessary re-renders": форма лишена некерованою (не підняла `title`/`priority` у стан сторінки), щоб введення тексту в полі не спричиняло ре-рендер `TaskList`/`TaskItem` при кожному натисканні клавіші.
7. Перевірка якості коду:
   - `npx tsc --noEmit` — без помилок.
   - `npx eslint` на всіх змінених файлах — без помилок.
8. Функціональна перевірка через `npm run dev` + Playwright-скрипт (без `chromium-cli`, пакет `playwright` уже був встановлений раніше в scratchpad-теці):
   - додавання задачі " Buy groceries " з пріоритетом 8 → в списку з'явився обрізаний заголовок "Buy groceries", поле форми очистилось (`titleValueAfterAdd === ""`);
   - спроба надіслати заголовок із самих пробілів → кількість задач не змінилась (`5` до і після);
   - toggle чекбоксу нової задачі → `isChecked === true`, візуально закреслення застосувалось;
   - видалення нової задачі → задача зникла зі списку (`stillExistsAfterDelete === 0`);
   - консоль браузера без помилок (`errors: []`).
9. Dev-сервер зупинено (`taskkill /F` за PID процесу на порту 3000).

**Результат:** оновлено 4 файли (`page.tsx`, `TaskForm.tsx`, `TaskItem.tsx`, `TaskList.tsx`). Add/Toggle/Delete повністю функціональні на клієнті, без бекенду й `localStorage`; типізація, лінтинг і функціональна перевірка — без зауважень.

---

## Промпт 12

**Запит користувача:** додати детальний звіт по Sprint 3 у `docs/dev-report-2026-07-20.md`.

**Дії асистента:** дописано розділи "Промпт 11" (Sprint 3) та розділ 12, додано підсумкову таблицю й перевірки якості для Sprint 3.

---

## Промпт 13 — Sprint 4: Search, Filter and Sorting

**Запит користувача:** реалізувати Sprint 4 — завершити всю фронтенд-функціональність (пошук, фільтр за статусом, сортування за пріоритетом), додаток лишається повністю клієнтським, без інтеграції з бекендом і без `localStorage`. Вимоги:

- **Пошук**: регістронезалежний пошук за назвою задачі, оновлює видимий список під час введення, з тримінгом пробілів перед фільтрацією.
- **Фільтр статусу**: All / Done / Undone, лише один активний одночасно, дефолт — All.
- **Сортування за пріоритетом**: Ascending / Descending, впливає лише на видимі задачі, без мутації оригінального стану.
- **Похідні дані**: не зберігати відфільтрований список у стані — обчислювати похідне значення (`useMemo`, лише якщо це реально покращує читабельність).
- Розподіл відповідальності: `TaskSearch`/`TaskFilters`/`TaskSort` — контрольовані компоненти, що лише емітять значення; `TaskList` — суто презентаційний; `Page` — володіє всім станом і обчислює видимі задачі.
- **Порожній стан**: якщо пошук/фільтр не дав результатів — показати наявний плейсхолдер (без нового повідомлення).
- UI, дизайн і залежності — без змін; існуючі Add/Delete/Toggle мають продовжувати працювати.

**Дії асистента:**

1. **`frontend/types/task.ts`** — додано `StatusFilter = "all" | "done" | "undone"` та `SortOrder = "asc" | "desc"`.
2. **`frontend/components/task/TaskSearch.tsx`** — перетворено на контрольований компонент: приймає `value: string`, `onChange: (value: string) => void`; `<input>` тепер керований (`value`/`onChange`), без власного стану.
3. **`frontend/components/task/TaskFilters.tsx`** — перетворено на контрольований компонент: приймає `value: StatusFilter`, `onChange: (value: StatusFilter) => void`; список фільтрів переписано як масив `{ label, value }`, активна кнопка визначається порівнянням `value === filter.value` (замість статичного `index === 0` з попереднього спринту), клік викликає `onChange(filter.value)`.
4. **`frontend/components/task/TaskSort.tsx`** — перетворено на контрольований компонент: приймає `value: SortOrder`, `onChange: (value: SortOrder) => void`; `<select>` тепер керований.
5. **`frontend/app/page.tsx`**:
   - додано `useState` для `search` (`string`), `statusFilter` (`StatusFilter`, дефолт `"all"`), `sortOrder` (`SortOrder`, дефолт `"asc"`);
   - додано похідне значення `visibleTasks` через `useMemo` (залежності: `tasks`, `search`, `statusFilter`, `sortOrder`) — спочатку `.filter()` за тримленим/lowercase пошуком і статусом, потім `.sort()` результату фільтрації за пріоритетом; оскільки `.filter()` завжди повертає новий масив, `.sort()` над ним не мутує оригінальний стан `tasks`, тож зайва копія (`[...filtered]`) не знадобилась;
   - `TaskSearch`/`TaskFilters`/`TaskSort` отримали `value`/`onChange={setSearch|setStatusFilter|setSortOrder}` напряму (сеттери `useState` стабільні між рендерами, тому обгортати в `useCallback` не було потреби);
   - у `TaskList` тепер передається `visibleTasks` замість повного `tasks`; `handleAddTask`/`handleToggleComplete`/`handleDeleteTask` продовжують працювати з повним масивом `tasks`.
6. `TaskList`/`TaskItem` не змінювались — вони й так презентаційні, `visibleTasks` для них виглядає як звичайний `tasks`; наявний плейсхолдер порожнього списку спрацьовує автоматично, коли `visibleTasks.length === 0`, незалежно від причини (немає задач узагалі чи пошук/фільтр нічого не знайшов) — саме так, як вимагалося.
7. Перевірка якості коду:
   - `npx tsc --noEmit` — без помилок.
   - `npx eslint` на всіх змінених файлах — без помилок.
8. Функціональна перевірка через `npm run dev` + Playwright-скрипт:
   - пошук `"  auth  "` (з пробілами) → видима лише "Implement authentication";
   - фільтр Done → видима лише виконана задача; фільтр Undone → 3 невиконані задачі;
   - сортування Descending → порядок пріоритетів 9 → 6 → 4 → 2; сортування Ascending → 2 → 4 → 6 → 9;
   - пошук без збігів (`"zzzzz"`) → показано наявний плейсхолдер "No tasks yet. Add your first task below.";
   - регресійна перевірка Add/Toggle/Delete на новій задачі — усе відпрацювало як і в Sprint 3;
   - консоль браузера без помилок (`errors: []`).
9. Dev-сервер зупинено (`taskkill /F` за PID процесу на порту 3000).

**Результат:** оновлено 4 файли (`types/task.ts`, `TaskSearch.tsx`, `TaskFilters.tsx`, `TaskSort.tsx`) та `page.tsx`. Пошук, фільтр і сортування повністю функціональні на клієнті через похідні дані (`useMemo`), без збереження відфільтрованого списку в стані; типізація, лінтинг і функціональна перевірка — без зауважень.

---

## Промпт 14

**Запит користувача:** додати детальний звіт по Sprint 4 у `docs/dev-report-2026-07-20.md`.

**Дії асистента:** дописано розділи "Промпт 13" (Sprint 4) та розділ 14, додано підсумкову таблицю й перевірки якості для Sprint 4.

---

## Промпт 15 — Sprint 5: Backend Foundation

**Запит користувача:** реалізувати Sprint 5 — створити архітектуру бекенду (FastAPI, SQLAlchemy 2.x, Pydantic, Alembic), без реалізації CRUD і без інтеграції з фронтендом. Вимоги:

- Налаштувати FastAPI, CORS для локальної розробки фронтенду.
- Налаштувати SQLAlchemy 2.x із SQLite для розробки, з можливістю легкого переходу на PostgreSQL через змінну середовища.
- ORM-модель `Task` (`id`, `title`, `completed`, `priority`, `created_at`, `updated_at`).
- Pydantic-схеми `TaskCreate`, `TaskUpdate`, `TaskResponse`.
- Сесія БД через dependency injection.
- Порожній роутер `/api/tasks`, що повертає `501 Not Implemented`, доки CRUD не реалізовано.
- `GET /health` → `{"status": "ok"}`.
- Налаштувати Alembic і згенерувати початкову міграцію.
- Не реалізовувати CRUD, не підключати фронтенд; тонкі роутери, бізнес-логіка поза роутерами, готовність до PostgreSQL.

**Дії асистента:**

1. **Виявлено відсутність Python** на машині (лише заглушка-alias Windows Store, без реального інтерпретатора) — без нього неможливо встановити FastAPI/SQLAlchemy/Alembic чи реально перевірити запуск сервера, міграцію, типізацію. Уточнено в користувача через `AskUserQuestion`, обрано варіант **"Встановити Python через winget"**.
2. Встановлено **Python 3.12.10** через `winget install Python.Python.3.12`; створено віртуальне середовище `backend/.venv`.
3. **`backend/requirements.txt`** — заповнено runtime-залежностями (`fastapi`, `uvicorn[standard]`, `sqlalchemy>=2.0`, `pydantic`, `pydantic-settings`, `alembic`) з мінімальними версійними межами (без жорсткого пінінгу, щоб pip сам розв'язав сумісні версії).
4. **`backend/requirements-dev.txt`** (новий) — `-r requirements.txt` + `mypy`, `ruff` для перевірок типізації й лінтингу.
5. Створено пакетні маркери `__init__.py` в `app/`, `app/database/`, `app/models/`, `app/routers/`, `app/schemas/`, `app/services/` (в оригінальному скелеті були відсутні).
6. **`backend/app/config.py`** (новий) — `Settings` на базі `pydantic-settings`, читає `.env`: `database_url` (дефолт `sqlite:///./app.db`) та `cors_origins`; `get_settings()` з `@lru_cache`.
7. **`backend/app/database/database.py`** — `Base(DeclarativeBase)` (SQLAlchemy 2.0-стиль), `engine = create_engine(settings.database_url, connect_args=...)`, де `connect_args={"check_same_thread": False}` застосовується лише для SQLite (визначається за префіксом URL) — при переході на Postgres цей костиль автоматично зникає.
8. **`backend/app/database/session.py`** — `SessionLocal` (`sessionmaker`) та `get_db()` — генератор-залежність із `try/finally: db.close()`.
9. **`backend/app/models/task.py`** — ORM-модель `Task` через `Mapped`/`mapped_column` (SQLAlchemy 2.0-стиль, не старий `Column(...)`): `id` (PK), `title`, `completed` (default `False`), `priority`, `created_at`/`updated_at` (`server_default=func.now()`, `onupdate=func.now()` для другого).
10. **`backend/app/schemas/task.py`** — `TaskBase` (спільні поля з валідацією: `title` 1–255 символів, `priority` 1–10), `TaskCreate` (успадковує `TaskBase`), `TaskUpdate` (усі поля опціональні), `TaskResponse` (додає `id`/`completed`/`created_at`/`updated_at`, `model_config = ConfigDict(from_attributes=True)` для серіалізації з ORM).
11. **`backend/app/routers/tasks.py`** — тонкий роутер з префіксом `/api/tasks`: `GET`/`POST` делегують спільному хелперу `_not_implemented()`, що кидає `HTTPException(501)` — без дублювання логіки, без звернення до сесії/моделі.
12. **`backend/app/main.py`** — `FastAPI(title=...)`, `CORSMiddleware` (origins з `settings.cors_origins`), підключення роутера `tasks`, ендпоінт `GET /health` → `{"status": "ok"}`.
13. **`backend/.env`** та **`backend/.env.example`** (новий) — `DATABASE_URL=sqlite:///./app.db`, `CORS_ORIGINS=["http://localhost:3000"]`.
14. **`backend/.gitignore`** (новий) — `.venv/`, `__pycache__/`, `*.pyc`, `.mypy_cache/`, `.ruff_cache/`, `*.db`, `.env` (за прикладом уже наявного `frontend/.gitignore`, який теж ігнорує env-файли).
15. Налаштовано **Alembic**: `alembic init alembic`; у згенерованому `alembic/env.py` додано імпорт `Base` і моделі `Task` (реєструє її в `Base.metadata`), `target_metadata = Base.metadata`, та перевизначення `config.set_main_option("sqlalchemy.url", settings.database_url)` — URL міграцій завжди береться з тих самих налаштувань застосунку, тож перемикання на Postgres через `.env` працює однаково і для рантайму, і для міграцій.
16. Згенеровано початкову міграцію: `alembic revision --autogenerate -m "create tasks table"` → коректно виявила нову таблицю `tasks` з усіма полями.
17. **`backend/pyproject.toml`** — заповнено конфігурацією `[tool.mypy]` (`strict = true`) та `[tool.ruff]` (`line-length = 100`, вибрані правила `E, F, I, UP`, виключено автогенеровану `alembic/versions` з лінтингу).
18. **`backend/README.md`** — оновлено з плейсхолдера "FastAPI will be here" на інструкції setup/run/migrate/checks.
19. Функціональна перевірка:
    - `alembic upgrade head` → створено `app.db`, перевірено через `sqlite3`, що таблиця `tasks` існує з усіма очікуваними колонками;
    - `uvicorn app.main:app` → `GET /health` → `200 {"status":"ok"}`; `GET`/`POST /api/tasks` → `501 {"detail":"Task endpoints are not implemented yet."}`; CORS preflight (`OPTIONS` з `Origin: http://localhost:3000`) → `200`, коректні `access-control-*` заголовки;
    - `mypy app` (strict) → без помилок; `ruff check app alembic` → без помилок (після виправлення порядку імпортів у `env.py` та виключення `alembic/versions`);
    - dev-сервер зупинено (`taskkill /F` за PID процесу на порту 8000).
20. `backend/app/services/task_service.py` **навмисно лишився порожнім** — CRUD/бізнес-логіка ще не реалізовані, за явною вимогою спринту.

**Результат:** створено архітектурний фундамент бекенду — FastAPI застосунок стартує, `/health` і `/api/tasks` (GET/POST → 501) працюють, CORS налаштований, SQLite-міграція застосована й перевірена, конфігурація готова до переходу на PostgreSQL через `DATABASE_URL`. `mypy` (strict) і `ruff` — без зауважень. CRUD і інтеграція з фронтендом — поза скоупом цього спринту.

---

## Промпт 16

**Запит користувача:** додати детальний звіт по Sprint 5 у `docs/dev-report-2026-07-20.md`.

**Дії асистента:** дописано розділи "Промпт 15" (Sprint 5) та розділ 16, додано підсумкову таблицю й перевірки якості для Sprint 5.

---

## Промпт 17 — Sprint 6: Backend CRUD Implementation

**Запит користувача:** реалізувати повний CRUD для задач на бекенді (лише в `backend/`, frontend не змінювати), не змінюючи наявну архітектуру (FastAPI, SQLAlchemy 2.x, Pydantic, Alembic, Service Layer, DI). Вимоги:

- `GET /api/tasks` → `List[TaskResponse]`, сортування `created_at DESC`.
- `POST /api/tasks` → приймає `TaskCreate`, повертає `TaskResponse`; `completed` за замовчуванням `False`; `created_at`/`updated_at` автоматично.
- `PATCH /api/tasks/{id}` → часткове оновлення (`title`/`completed`/`priority`, лише передані поля); `updated_at` оновлюється автоматично.
- `DELETE /api/tasks/{id}` → `204 No Content`.
- Якщо задача не існує — `404 Not Found` з повідомленням `"Task not found."`, без дублювання коду обробки помилок.
- Уся бізнес-логіка — в `app/services/task_service.py`; роутери максимально тонкі (лише приймають запит, викликають сервіс, повертають відповідь); `Depends(get_db)`, без глобальних `Session`.
- **Не використовувати**: Repository Pattern, Generic CRUD, BaseService, нові бібліотеки, зайві абстракції.
- Не реалізовувати: frontend, React Query, fetch/axios, API client, інтеграцію frontend/backend, loading state, optimistic update.
- Після завершення: `mypy app`, `ruff check app alembic` без помилок; функціональна перевірка всіх ендпоінтів і стану SQLite; зупинити dev-сервер.

**Дії асистента:**

1. Перед початком повторно ознайомлено з `CLAUDE.md` та `docs/test-task-specification.md` (як було явно попрошено на початку промпту).
2. Перевірено наявні `app/schemas/task.py` та `app/models/task.py` із Sprint 5 — `TaskCreate`, `TaskUpdate` (усі поля опціональні), `TaskResponse` та ORM-модель `Task` вже повністю відповідають вимогам цього спринту; **змін не знадобилось**.
3. **`backend/app/services/task_service.py`** (був порожнім із Sprint 5) — реалізовано бізнес-логіку:
   - `get_tasks(db)` — `select(Task).order_by(Task.created_at.desc())`, повертає список;
   - `create_task(db, task_in)` — створює `Task` з `completed=False`, `db.add`/`commit`/`refresh`;
   - `_get_task_or_404(db, task_id)` — приватний хелпер, `db.get(Task, task_id)`, кидає `HTTPException(404, "Task not found.")` якщо не знайдено — **єдине місце** цієї перевірки, використовується і в `update_task`, і в `delete_task` (без дублювання коду обробки помилок, як вимагалося);
   - `update_task(db, task_id, task_in)` — бере задачу через `_get_task_or_404`, застосовує лише передані поля через `task_in.model_dump(exclude_unset=True)` (Pydantic v2 коректно розрізняє "поле не передане" від "поле передане як `False`/`None`), комітить; `updated_at` оновлюється автоматично через `onupdate=func.now()` моделі (SQLAlchemy застосовує це при будь-якому `UPDATE` рядка, без додаткового коду);
   - `delete_task(db, task_id)` — бере задачу через `_get_task_or_404`, `db.delete`/`commit`.
4. **`backend/app/routers/tasks.py`** — замінено плейсхолдер 501 на тонкі ендпоінти:
   - `GET ""` (response_model=`list[TaskResponse]`) → `task_service.get_tasks(db)`;
   - `POST ""` (response_model=`TaskResponse`, `status_code=201`) → `task_service.create_task(db, task_in)`;
   - `PATCH "/{task_id}"` (response_model=`TaskResponse`) → `task_service.update_task(db, task_id, task_in)`;
   - `DELETE "/{task_id}"` (`status_code=204`) → `task_service.delete_task(db, task_id)`.
   Жодна функція роутера не містить бізнес-логіки чи прямих звернень до `Session`/моделі окрім виклику сервісу — уся робота з `Session` — через `Depends(get_db)`.
5. Не додавалось: Repository Pattern, Generic CRUD, BaseService, нові бібліотеки чи абстракції — саме так, як вимагалося.
6. Перевірка якості коду:
   - `mypy app` (strict) — без помилок;
   - `ruff check app alembic` — без помилок.
7. Функціональна перевірка:
   - видалено тестовий `app.db` із Sprint 5, повторно застосовано `alembic upgrade head` (чиста БД);
   - запущено `uvicorn app.main:app`; написано Python-скрипт (`requests`) для повного проходу сценарію: `GET /health` → `200 {"status":"ok"}`; `GET /api/tasks` (порожня БД) → `200 []`; `POST /api/tasks` → `201`, `completed=false`, `created_at`/`updated_at` виставлені автоматично й рівні одне одному на момент створення; після `POST` → `GET` повертає нову задачу (вимога №10); створено другу задачу й перевірено сортування — `GET` повертає `[2, 1]` (новіша перша, тобто `created_at DESC` підтверджено); `PATCH` title → `200`, заголовок змінився; `PATCH` completed → `200`, `completed=true`; `PATCH` priority → `200`, `priority=9`; після трьох PATCH `updated_at` відрізняється від `created_at` (автоматичне оновлення підтверджено); `PATCH` неіснуючої задачі (`999999`) → `404 {"detail":"Task not found."}`; `DELETE` неіснуючої задачі → `404` з тим самим повідомленням; `DELETE` існуючої задачі → `204`; після `DELETE` задача більше не повертається в `GET` (вимога №11);
   - пряма перевірка через `sqlite3`: після видалення обох тестових задач таблиця `tasks` порожня — підтверджено, що записи реально створюються/оновлюються/видаляються саме у файлі SQLite;
   - лог uvicorn перевірено — жодних помилок, лише очікувані коди відповідей (`200`, `201`, `204`, `404`);
   - dev-сервер зупинено (`taskkill /F` за PID процесу на порту 8000).
8. Frontend не чіпався (typecheck фронтенду не запускався — не вимагалося, оскільки зміни в цьому спринті не торкаються `frontend/`).

**Результат:** повний CRUD для задач реалізовано на бекенді — усі 11 сценаріїв з чек-листа (health, list, create, три варіанти PATCH, delete, 404 на PATCH/DELETE неіснуючої задачі, узгодженість GET після create/delete) пройдені успішно; бізнес-логіка повністю в `task_service.py`, роутери тонкі; `mypy` (strict) і `ruff` — без зауважень; жодних нових залежностей чи абстракцій не додано.

---

## Промпт 18

**Запит користувача:** додати детальний звіт по Sprint 6 у `docs/dev-report-2026-07-20.md`.

**Дії асистента:** дописано розділи "Промпт 17" (Sprint 6) та розділ 18, додано підсумкову таблицю й перевірки якості для Sprint 6.

---

## Промпт 19 — Sprint 7: Frontend ↔ Backend Integration

**Запит користувача:** інтегрувати існуючий React/Next.js frontend з уже готовим FastAPI backend (Sprint 6), не змінюючи архітектуру бекенду, не додаючи нових бібліотек і не переписуючи UI — лише замінити локальні дані на реальний API. Вимоги:

- При відкритті сторінки виконати `GET /api/tasks`; поки відповідь не отримана — показувати текст `Loading...`.
- При створенні/toggle completed/видаленні — відповідний запит (`POST`/`PATCH`/`DELETE`), а після успішної відповіді — повторний `GET` для оновлення списку; **без optimistic update**.
- Search/Filter/Sorting мають продовжувати працювати без змін поверх масиву, отриманого з API (не переносити на бекенд).
- Не змінювати `TaskItem`, `PriorityBadge`, `TaskList`, `TaskSearch`, `TaskFilters`, `TaskSort` без необхідності.
- Створити `frontend/lib/api.ts` з `getTasks()`/`createTask()`/`updateTask()`/`deleteTask()` — у компонентах не повинно бути прямих `fetch`.
- URL бекенду — через `NEXT_PUBLIC_API_URL` у `.env.local`, без хардкодженого `localhost` у коді.
- Не використовувати React Query, Axios, SWR, Redux, Context, Zustand, Repository, нові бібліотеки, optimistic update.
- Після завершення: `npx tsc --noEmit`, `npx eslint`, ручна перевірка всіх сценаріїв, підтвердити роботу з реальною SQLite через FastAPI, а не з локальним `useState`.

**Дії асистента:**

1. Перед стартом обов'язково повторно прочитано `CLAUDE.md` та `docs/test-task-specification.md` (за явною вказівкою на початку промпту) — підтверджено, що вони не змінювались.
2. Перевірено наявну порожню заглушку **`frontend/lib/api/tasks.ts`** (з початкового скелета) — оскільки промпт явно вимагав інший, плаский шлях `frontend/lib/api.ts`, порожній файл-заглушку видалено разом із тепер порожньою текою `lib/api/`, щоб не лишати два конфліктні місця для API-логіки.
3. **`frontend/lib/api.ts`** (новий) — єдина точка звернення до бекенду:
   - `API_BASE_URL = process.env.NEXT_PUBLIC_API_URL` (без жодного хардкодженого `localhost` в коді);
   - приватний тип `ApiTask` (форма відповіді бекенду: `id: number`, `created_at`/`updated_at` snake_case) та `mapApiTaskToTask()`, що конвертує його у вже наявний фронтовий `Task` (`id: string` через `String(id)`, `createdAt`/`updatedAt` camelCase, `priority as Priority`) — завдяки цій мапінг-функції жоден із презентаційних компонентів і сам тип `Task` у `types/task.ts` **не довелось змінювати**;
   - спільний приватний хелпер `request<T>()` — обгортка над `fetch` із перевіркою `response.ok` (кидає `Error` при невдалому статусі) та коректною обробкою `204 No Content`;
   - `getTasks()`, `createTask(title, priority)`, `updateTask(id, updates)` (частковий `Partial<{title, completed, priority}>`, відповідає формі `PATCH`), `deleteTask(id)`.
4. **`frontend/.env.local`** (новий) — `NEXT_PUBLIC_API_URL=http://localhost:8000` (гітігнориться вже наявним патерном `.env*` у `frontend/.gitignore`).
5. **`frontend/app/page.tsx`**:
   - прибрано статичний масив `initialTasks` — `tasks` тепер стартує з `[]` і наповнюється реальними даними;
   - додано `isLoading` (default `true`) та `useEffect` з `getTasks()` при монтуванні (з прапорцем `isMounted`, щоб уникнути оновлення стану після демонтажу); `isLoading` знімається у `.finally()` незалежно від успіху/невдачі запиту;
   - секція `<section aria-label="Tasks">` тепер умовно рендерить `<p>Loading...</p>` замість `<TaskList>`, доки `isLoading === true`; решта UI (пошук/фільтри/сортування/форма) лишається завжди видимою — жодного редизайну сторінки;
   - `handleAddTask`/`handleToggleComplete`/`handleDeleteTask` стали `async`: кожен викликає відповідну функцію з `lib/api.ts`, а після її завершення — спільний `refreshTasks()` (`getTasks()` + `setTasks`) — **жодного локального оновлення масиву `tasks` до підтвердження від сервера**, тобто без optimistic update;
   - `visibleTasks` (`useMemo` з Sprint 4) залишився **без жодних змін** — і далі обчислюється з локального `tasks`, просто тепер це дані з API, а не статичний масив; search/filter/sort продовжують працювати суто на клієнті.
6. Типи пропсів `TaskForm`/`TaskItem` (`(id: string) => void` тощо) виявились сумісні з новими `async`-обробниками без жодних правок — TypeScript і ESLint (`eslint-config-next`) не вимагають зміни сигнатур для функцій, що повертають `Promise<void>` там, де очікується `void`; перевірено фактичним прогоном `tsc`/`eslint` (без помилок), тому `TaskItem`, `PriorityBadge`, `TaskList`, `TaskSearch`, `TaskFilters`, `TaskSort` **не редагувались** — саме як вимагалося.
7. Перевірка якості коду:
   - `npx tsc --noEmit` — без помилок;
   - `npx eslint app/page.tsx lib/api.ts` — без помилок.
8. Функціональна перевірка (backend + frontend одночасно):
   - перезапущено `backend` (чиста SQLite через `alembic upgrade head`), через `curl` засіяно 4 задачі (ті самі назви/пріоритети, що були в статичних даних попередніх спринтів) — підтверджує, що дані тепер живуть на бекенді, а не в коді фронтенду;
   - запущено `npm run dev`, написано Playwright-скрипт для повного сценарію: побачено проміжний текст `Loading...` одразу після навігації; після завантаження — 4 задачі з бекенду; створення задачі через форму → `POST` → рефетч → нова задача з'явилась у списку на коректній позиції за сортуванням;
   - **toggle без optimistic update підтверджено emпірично**: перша спроба через `locator.check()` впала з помилкою Playwright "Clicking the checkbox did not change its state", бо чекбокс — контрольований інпут і одразу після кліку "відкочується" назад (стан ще не оновлено, запит `PATCH` в польоті) — замінено на `.click()` з очікуванням; після завершення `PATCH`+рефетчу чекбокс коректно став `checked`, закреслення застосувалось;
   - search "auth" → лише "Implement authentication"; filter Done → лише позначена задача; sort Descending → коректний порядок за пріоритетом;
   - delete → `DELETE` → рефетч → задача зникла зі списку;
   - **hard reload сторінки** після видалення тестової задачі → список відповідає поточному стану бекенду (4 початкові задачі) — прямий доказ, що дані читаються з SQLite через FastAPI при кожному завантаженні, а не зберігаються локально в `useState` між сесіями;
   - лог `uvicorn` перевірено — коректні `OPTIONS` (CORS preflight) + `GET`/`POST`/`PATCH`/`DELETE`, жодних помилок; консоль браузера — без помилок за весь сценарій;
   - обидва dev-сервери (frontend :3000, backend :8000) зупинено (`taskkill /F`).
9. Не реалізовувалось (за явною вимогою): React Query, Axios, SWR, Redux, Context, Zustand, Repository, нові бібліотеки, optimistic update, зміна архітектури бекенду.

**Результат:** frontend повністю інтегровано з реальним FastAPI + SQLite бекендом — завантаження, створення, toggle, видалення, пошук, фільтр і сортування працюють через живий API без optimistic update; жодних нових бібліотек чи змін архітектури. `tsc`/`eslint` — без помилок; функціональна перевірка (включно з hard reload) підтверджує, що джерело правди — бекенд, а не локальний React-стан.

---

## Промпт 20

**Запит користувача:** додати детальний звіт по Sprint 7 у `docs/dev-report-2026-07-20.md`.

**Дії асистента:** дописано розділи "Промпт 19" (Sprint 7) та розділ 20, додано підсумкову таблицю й перевірки якості для Sprint 7.

---

## Промпт 21 — Sprint 8: Production Readiness

**Запит користувача:** привести проєкт у production-ready стан **без** додавання нового функціоналу, зміни бізнес-логіки чи архітектури, без нових бібліотек, без переписування працюючого коду. Вимоги:

1. Повністю оновити `README.md` (frontend і backend за потреби): опис проєкту, стек, структура директорій, інструкції запуску (backend/frontend), встановлення залежностей, Alembic, SQLite, environment variables, lint/typecheck/dev server.
2. Перевірити актуальність усіх `.env.example` — без зайвих змінних.
3. Прибрати мертвий код, непотрібні файли, старі заглушки, закоментований код, невикористані імпорти, тимчасові хелпери — не чіпаючи робочу архітектуру.
4. `npx tsc --noEmit` без помилок.
5. `npx eslint .` без warning/error.
6. `mypy app` та `ruff check app alembic` без помилок.
7. Повне ручне тестування: GET/POST/PATCH/DELETE, Loading, Search, Filter, Sort, Hard Reload, 404, Health, SQLite.
8. Перевірити git: без випадкових змін, debug-файлів, `*.db`, `__pycache__`, `.pytest_cache`, `.mypy_cache`.
9. Короткий звіт наприкінці; зупинити всі dev-сервери.
   Явно заборонено: зміна UI, новий функціонал, PostgreSQL, React Query, Docker, CI/CD, авторизація, pagination, тестові фреймворки.

**Дії асистента:**

1. Перед стартом повторно прочитано `CLAUDE.md` та `docs/test-task-specification.md` (за явною вказівкою) — підтверджено, що не змінювались.
2. **Аудит мертвого коду** — систематично перевірено весь `frontend/` (виключно `node_modules`/`.next`) і `backend/app`+`alembic` на предмет TODO/FIXME/`console.log`/закоментованого коду — **нічого не знайдено** (єдиний збіг "TODO" — текст заголовка сторінки "TODO App", не коментар). Окремо перевірено кожен файл на розмір і через `grep` — виявлено 6 порожніх (0 байт) файлів-заглушок зі стартового скелета, які жодного разу не використовувались і не імпортувались за всі 7 попередніх спринтів (підтверджено пошуком імпортів/посилань по всьому `frontend/`):
   - `frontend/components/task/EmptyState.tsx`, `Loading.tsx` (замість них — інлайн-розмітка прямо в `TaskList.tsx` і `page.tsx`);
   - `frontend/constants/task.ts` (жодних констант так і не знадобилось);
   - `frontend/hooks/useTasks.ts`, `useDebounce.ts` (стан завжди тримався прямо в `page.tsx`, дебаунс пошуку не реалізовувався);
   - `frontend/lib/utils.ts` (жодна утиліта не знадобилась).
   Усі шість видалено разом із тепер порожніми текам `constants/` і `hooks/`. Робочі файли (компоненти, `lib/api.ts`, `types/task.ts`, весь backend) — не чіпались.
3. **Перевірка `.env.example`**:
   - `backend/.env.example` (`DATABASE_URL`, `CORS_ORIGINS`) звірено з полями `Settings` у `app/config.py` — точний збіг, без зайвих чи відсутніх змінних;
   - у `frontend/` `.env.example` **не існувало** (лише гітігнорений `.env.local` зі Sprint 7) — створено `frontend/.env.example` (`NEXT_PUBLIC_API_URL=http://localhost:8000`), додано виняток `!.env.example` до `frontend/.gitignore` (поруч із коментарем "can opt-in for committing if needed", що вже був у файлі) — за аналогією з тим, як це вже зроблено для `backend/.env.example` у Sprint 5.
4. **`README.md` (корінь, був порожній)** — написано повністю: опис проєкту, стек (frontend/backend окремо), ASCII-дерево структури директорій, quick start у два кроки (backend: venv/install/`.env`/`alembic upgrade head`/`uvicorn`; frontend: `npm install`/`.env.local`/`npm run dev`), таблиці environment variables для обох частин, розділ Database & Migrations, розділ Checks (typecheck+lint для обох), таблиця API-ендпоінтів, список Features.
5. **`backend/README.md`** — виправлено застарілий опис ендпоінтів (лишався "`GET`/`POST /api/tasks` → `501 Not Implemented` (CRUD not implemented yet)" зі Sprint 5, хоча CRUD реалізовано ще в Sprint 6) на актуальний перелік `GET`/`POST`/`PATCH`/`DELETE` з кодами відповідей.
6. **`frontend/README.md`** — замінено дефолтний boilerplate `create-next-app` (посилання на "Learn Next.js", "Deploy on Vercel" тощо) на проєктно-специфічний: посилання на кореневий README, setup (`npm install` + `.env.example` → `.env.local`), run, checks.
7. Виправлено попередження markdown-лінтера в новому кореневому `README.md` (`MD036` — emphasis замість заголовка: `**Frontend**`/`**Backend**` → `### Frontend`/`### Backend` і аналогічно для розділів env vars та checks; `MD040` — додано мову `text` до fenced-блоку з ASCII-деревом).
8. Перевірка якості коду (після видалень і оновлень документації):
   - `npx tsc --noEmit` (frontend) — без помилок;
   - `npx eslint .` (frontend, увесь проєкт, а не лише змінені файли) — без помилок/warning;
   - `mypy app` (strict, backend) — без помилок;
   - `ruff check app alembic` (backend) — без помилок.
9. **Повне ручне тестування** (backend `uvicorn` :8000 + frontend `npm run dev` :3000 одночасно, чиста SQLite через `alembic upgrade head`):
   - **Health**: `GET /health` → `200 {"status":"ok"}`;
   - **404**: `PATCH`/`DELETE` неіснуючої задачі (`id=999`) → `404 {"detail":"Task not found."}` в обох випадках (перевірено напряму через `curl`);
   - засіяно 4 задачі через `curl POST`, підтверджено через `GET /api/tasks`;
   - у браузері (Playwright): видно проміжний **Loading...**; після завантаження — 4 задачі з бекенду; **POST** через форму → нова задача з'явилась на коректній позиції; **PATCH** (toggle) → чекбокс став `checked` після рефетчу; **Search** "sprint 8" → лише нова задача; **Filter** Done → лише позначена задача; **Sort** desc/asc → коректний порядок за пріоритетом в обох напрямках; **DELETE** → задача зникла зі списку;
   - **Hard Reload** сторінки після видалення → список відповідає поточному стану бекенду (4 початкові задачі, без слідів видаленої) — підтверджує, що джерело даних — SQLite через FastAPI;
   - **SQLite**: пряма перевірка через `sqlite3` — у таблиці `tasks` рівно 4 рядки з очікуваними `id`/`title`/`completed`/`priority`, збігаються з тим, що показав UI;
   - логи `uvicorn` і `next dev` перевірено на слово "error"/"traceback" — нічого не знайдено; консоль браузера за весь сценарій — без помилок (`errors: []`);
   - обидва dev-сервери зупинено (`taskkill /F` за PID на портах 3000 та 8000).
10. **Git-аудит**: `git status --porcelain` для всього репозиторію показав рівно очікувані зміни — оновлення трьох README, оновлення `dev-report-2026-07-20.md`, оновлення `frontend/.gitignore`, видалення 6 файлів-заглушок, новий `frontend/.env.example`. Жодних `*.db`, `__pycache__`, `.mypy_cache`, `.ruff_cache`, `.pytest_cache`, `.venv` чи інших debug/тимчасових файлів у статусі — підтверджено, що `.gitignore` (backend, з Sprint 5) і стандартний `frontend/.gitignore` (create-next-app) коректно їх покривають.
11. Не реалізовувалось (за явною вимогою): зміна UI, новий функціонал, PostgreSQL, React Query, Docker, CI/CD, авторизація, pagination, тестові фреймворки.

**Результат:** проєкт приведено у production-ready стан без зміни бізнес-логіки чи архітектури — повна документація (3 README), чисті `.env.example` для обох частин, видалено 6 мертвих файлів-заглушок, усі перевірки (`tsc`, `eslint`, `mypy` strict, `ruff`) проходять чисто, повне ручне тестування (включно з Hard Reload, 404, Health, прямою перевіркою SQLite) підтверджує коректну роботу всього застосунку; `git status` — чистий, без сторонніх артефактів.

---

## Промпт 22 (поточний)

**Запит користувача:** додати детальний звіт по Sprint 8 у `docs/dev-report-2026-07-20.md`.

**Дії асистента:** дописано розділ "Промпт 21" (Sprint 8) та розділ 22, додано підсумкову таблицю й перевірки якості для Sprint 8.

---

## Підсумковий список змінених/створених файлів — Sprint 1 (Static Layout)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `frontend/components/task/TaskSearch.tsx` | створено | Поле пошуку задач |
| `frontend/components/task/TaskFilters.tsx` | створено | Фільтр статусу All/Done/Undone |
| `frontend/components/task/TaskSort.tsx` | створено | Сортування за пріоритетом Ascending/Descending |
| `frontend/components/task/TaskList.tsx` | створено | Плейсхолдер порожнього списку задач |
| `frontend/components/task/TaskForm.tsx` | створено | Форма додавання задачі (текст, пріоритет 1–10, кнопка Add) |
| `frontend/app/page.tsx` | оновлено | Композиція компонентів у центрований responsive layout |

**Не створювались (свідомо, за вимогою "лише необхідні компоненти"):** `TaskItem`, `PriorityBadge` — не потрібні без даних задач.

**Бізнес-логіка, `"use client"`, `useState`, API-виклики, мок-дані:** не додавались — відповідно до явної вимоги промпту 3.

### Перевірки якості — Sprint 1

- `npx tsc --noEmit` — пройдено без помилок.
- `npx eslint` (змінені файли) — пройдено без помилок.
- Візуальна перевірка через Playwright-скріншоти (desktop 1280×900, mobile 390×844) — layout коректний, консоль браузера без помилок.

---

## Підсумковий список змінених/створених файлів — Sprint 2 (Static Task Rendering)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `frontend/types/task.ts` | оновлено | `Priority` (union `1`–`10`) та `Task` (`id`, `title`, `completed`, `priority`, `createdAt`, `updatedAt`) |
| `frontend/components/task/PriorityBadge.tsx` | створено | Кольоровий бейдж пріоритету (green 1–3 / yellow 4–7 / red 8–10) |
| `frontend/components/task/TaskItem.tsx` | створено | Рядок задачі: disabled-чекбокс, назва, `PriorityBadge`, disabled-кнопка Delete |
| `frontend/components/task/TaskList.tsx` | оновлено | Приймає `tasks: Task[]` через props, рендерить `TaskItem[]`, зберігає плейсхолдер для порожнього масиву |
| `frontend/app/page.tsx` | оновлено | Статичний масив із 4 задач (тимчасовий, лише в цьому файлі), переданий у `TaskList` |

**Не додавались (за явною вимогою):** `useState`, хуки, API, context, мок-сервіс, `localStorage`.

**`constants/task.ts`, `TaskForm.tsx`, `TaskSearch.tsx`, `TaskFilters.tsx`, `TaskSort.tsx`:** не змінювались — поза скоупом Sprint 2.

### Перевірки якості — Sprint 2

- `npx tsc --noEmit` — пройдено без помилок.
- `npx eslint` (змінені файли) — пройдено без помилок.
- Візуальна перевірка через Playwright-скріншоти (desktop 1280×900, mobile 390×844) — кольори бейджів за діапазонами, закреслення виконаної задачі, disabled-елементи коректні; layout не змінився; консоль браузера без помилок.

---

## Підсумковий список змінених/створених файлів — Sprint 3 (Local Task Management)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `frontend/app/page.tsx` | оновлено | Додано `"use client"`, `useState<Task[]>`, обробники `handleAddTask`/`handleToggleComplete`/`handleDeleteTask` |
| `frontend/components/task/TaskForm.tsx` | оновлено | Некерована форма з `onSubmit`, тримінг і валідація заголовка, виклик `onAddTask(title, priority)`, `form.reset()` після успіху |
| `frontend/components/task/TaskItem.tsx` | оновлено | Активний чекбокс (`onChange`) і кнопка Delete (`onClick`), емітують `onToggleComplete`/`onDelete` |
| `frontend/components/task/TaskList.tsx` | оновлено | Прокидає `onToggleComplete`/`onDelete` у `TaskItem`, лишається презентаційним |

**Директива `"use client"` додана лише в `page.tsx`:** `TaskForm`, `TaskList`, `TaskItem` не отримали власної директиви — вони рендеряться лише всередині клієнтського дерева `page.tsx` і автоматично потрапляють у клієнтський бандл.

**Не додавались (за явною вимогою):** інтеграція з бекендом, `localStorage`, нові залежності.

**`constants/task.ts`, `types/task.ts`, `PriorityBadge.tsx`, `TaskSearch.tsx`, `TaskFilters.tsx`, `TaskSort.tsx`:** не змінювались — поза скоупом Sprint 3.

### Перевірки якості — Sprint 3

- `npx tsc --noEmit` — пройдено без помилок.
- `npx eslint` (змінені файли) — пройдено без помилок.
- Функціональна перевірка через Playwright-скрипт (`npm run dev` + сценарій дій): додавання задачі з обрізанням пробілів і скиданням форми, ігнорування пробільного заголовка (кількість задач не змінилась), toggle чекбоксу (закреслення й `checked` застосувались), видалення задачі (зникла зі списку); консоль браузера без помилок.

---

## Підсумковий список змінених/створених файлів — Sprint 4 (Search, Filter and Sorting)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `frontend/types/task.ts` | оновлено | Додано `StatusFilter` (`"all" \| "done" \| "undone"`) та `SortOrder` (`"asc" \| "desc"`) |
| `frontend/components/task/TaskSearch.tsx` | оновлено | Контрольований інпут: `value`/`onChange` через props |
| `frontend/components/task/TaskFilters.tsx` | оновлено | Контрольований компонент: активний фільтр визначається порівнянням `value`, клік емітить `onChange` |
| `frontend/components/task/TaskSort.tsx` | оновлено | Контрольований select: `value`/`onChange` через props |
| `frontend/app/page.tsx` | оновлено | Додано стан `search`/`statusFilter`/`sortOrder`, похідне значення `visibleTasks` через `useMemo` (фільтр за пошуком/статусом + сортування без мутації `tasks`) |

**Похідні дані, а не стан:** `visibleTasks` обчислюється через `useMemo` з `tasks`/`search`/`statusFilter`/`sortOrder` і ніде не зберігається окремим `useState` — відфільтрований/відсортований список завжди похідний від джерела правди (`tasks`).

**Не додавались (за явною вимогою):** інтеграція з бекендом, `localStorage`, нові залежності, новий текст для порожнього стану (перевикористано наявний плейсхолдер).

**`TaskList.tsx`, `TaskItem.tsx`, `TaskForm.tsx`, `PriorityBadge.tsx`, `constants/task.ts`:** не змінювались — поза скоупом Sprint 4 (лишаються презентаційними/незалежними від пошуку-фільтра-сортування).

### Перевірки якості — Sprint 4

- `npx tsc --noEmit` — пройдено без помилок.
- `npx eslint` (змінені файли) — пройдено без помилок.
- Функціональна перевірка через Playwright-скрипт (`npm run dev` + сценарій дій): пошук з тримінгом пробілів знаходить точний збіг; фільтри Done/Undone показують коректні підмножини; сортування Ascending/Descending дає правильний порядок за пріоритетом; пошук без збігів показує наявний плейсхолдер; регресійна перевірка Add/Toggle/Delete — усе працює; консоль браузера без помилок.

---

## Підсумковий список змінених/створених файлів — Sprint 5 (Backend Foundation)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `backend/app/__init__.py`, `database/__init__.py`, `models/__init__.py`, `routers/__init__.py`, `schemas/__init__.py`, `services/__init__.py` | створено | Пакетні маркери (порожні) |
| `backend/app/config.py` | створено | `Settings` (pydantic-settings): `DATABASE_URL`, `CORS_ORIGINS` з `.env` |
| `backend/app/database/database.py` | оновлено | `Base` (SQLAlchemy 2.0 `DeclarativeBase`), `engine` з умовним `connect_args` для SQLite |
| `backend/app/database/session.py` | оновлено | `SessionLocal`, `get_db()` — генератор-залежність |
| `backend/app/models/task.py` | оновлено | ORM-модель `Task` (`Mapped`/`mapped_column`): `id`, `title`, `completed`, `priority`, `created_at`, `updated_at` |
| `backend/app/schemas/task.py` | оновлено | Pydantic-схеми `TaskCreate`, `TaskUpdate`, `TaskResponse` |
| `backend/app/routers/tasks.py` | оновлено | Порожній роутер `/api/tasks` (GET/POST → 501) |
| `backend/app/main.py` | оновлено | FastAPI app, CORS-middleware, `/health`, підключення роутера |
| `backend/alembic.ini`, `backend/alembic/` (env.py, script.py.mako, versions/…) | створено | Конфігурація Alembic + перша міграція `create tasks table` |
| `backend/requirements.txt` | оновлено | `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `pydantic`, `pydantic-settings`, `alembic` |
| `backend/requirements-dev.txt` | створено | Runtime + dev-залежності (`mypy`, `ruff`) |
| `backend/pyproject.toml` | оновлено | Конфігурація `[tool.mypy]` (strict) та `[tool.ruff]` |
| `backend/.env` | оновлено | `DATABASE_URL=sqlite:///./app.db`, `CORS_ORIGINS=["http://localhost:3000"]` |
| `backend/.env.example` | створено | Приклад env-файлу для нових розробників |
| `backend/.gitignore` | створено | Ігнорування `.venv`, `__pycache__`, кешів, `*.db`, `.env` |
| `backend/README.md` | оновлено | Інструкції setup/run/migrate/checks |

**Не чіпалось (навмисно, за вимогою "no CRUD yet"):** `backend/app/services/task_service.py` лишився порожнім.

**Готовність до PostgreSQL:** `DATABASE_URL` в `.env` — єдине місце перемикання (рантайм і Alembic-міграції беруть URL з тих самих `Settings`); SQLite-специфічний `connect_args` застосовується лише за префіксом URL.

**Не реалізовувалось (за явною вимогою):** CRUD-логіка в `task_service.py`/роутері, інтеграція з фронтендом.

### Перевірки якості — Sprint 5

- `mypy app` (strict) — пройдено без помилок.
- `ruff check app alembic` — пройдено без помилок (`alembic/versions` виключено з лінтингу як автогенерований код).
- Функціональна перевірка: `alembic upgrade head` створює `app.db` з таблицею `tasks` (перевірено через `sqlite3`); `uvicorn app.main:app` — `GET /health` → `200 {"status":"ok"}`, `GET`/`POST /api/tasks` → `501`, CORS preflight з `Origin: http://localhost:3000` → дозволено з коректними заголовками.

---

## Підсумковий список змінених/створених файлів — Sprint 6 (Backend CRUD Implementation)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `backend/app/services/task_service.py` | оновлено | `get_tasks`, `create_task`, `update_task`, `delete_task`, приватний `_get_task_or_404` (єдине місце обробки 404) |
| `backend/app/routers/tasks.py` | оновлено | Замінено 501-плейсхолдер на тонкі ендпоінти `GET`/`POST` `/api/tasks`, `PATCH`/`DELETE` `/api/tasks/{id}` |

**Без змін (уже відповідали вимогам зі Sprint 5):** `backend/app/schemas/task.py`, `backend/app/models/task.py`, `backend/app/database/*`, `backend/app/config.py`, `backend/app/main.py`, Alembic-конфігурація.

**Не додавались (за явною вимогою):** Repository Pattern, Generic CRUD, BaseService, нові бібліотеки, зайві абстракції, будь-який frontend-код (React Query, fetch/axios, API client, loading state, optimistic update).

**Розподіл відповідальності:** уся бізнес-логіка (пошук, застосування часткових оновлень, перевірка існування) — у `task_service.py`; роутери лише приймають запит, викликають сервіс і повертають відповідь, без прямих звернень до `Session`/моделі.

### Перевірки якості — Sprint 6

- `mypy app` (strict) — пройдено без помилок.
- `ruff check app alembic` — пройдено без помилок.
- Функціональна перевірка через Python-скрипт (`requests`) проти живого `uvicorn`, усі 11 сценаріїв з чек-листа: `GET /health` → `200`; `GET /api/tasks` на порожній БД → `200 []`; `POST` → `201`, `completed=false`, `created_at`/`updated_at` виставлені автоматично; `GET` після `POST` повертає нову задачу; сортування `created_at DESC` підтверджено (новіша задача першою); `PATCH` title/completed/priority — кожен окремо застосовується коректно, `updated_at` оновлюється автоматично (відрізняється від `created_at`); `PATCH` і `DELETE` неіснуючої задачі (`id=999999`) → `404 {"detail":"Task not found."}` в обох випадках; `DELETE` існуючої задачі → `204`, після чого `GET` більше не повертає цю задачу.
- Пряма перевірка через `sqlite3`: після видалення тестових задач таблиця `tasks` порожня — підтверджено, що create/update/delete реально відбуваються у файлі БД, а не лише в ORM-сесії.
- Лог `uvicorn` перевірено — жодних неочікуваних помилок, лише коректні коди відповідей (`200`, `201`, `204`, `404`); dev-сервер зупинено після перевірки.

---

## Підсумковий список змінених/створених файлів — Sprint 7 (Frontend ↔ Backend Integration)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `frontend/lib/api.ts` | створено | `getTasks`, `createTask`, `updateTask`, `deleteTask` — звернення до `NEXT_PUBLIC_API_URL`, мапінг snake_case ↔ camelCase |
| `frontend/lib/api/tasks.ts` | видалено | Порожня застаріла заглушка, замінена на плаский `lib/api.ts` (точний шлях з вимог спринту) |
| `frontend/app/page.tsx` | оновлено | Прибрано статичний `initialTasks`; додано `isLoading` + `useEffect` для `GET` при монтуванні; `handleAddTask`/`handleToggleComplete`/`handleDeleteTask` — `async`, викликають API + `refreshTasks()`, без optimistic update; `Loading...` замість `TaskList` під час першого завантаження |
| `frontend/.env.local` | створено | `NEXT_PUBLIC_API_URL=http://localhost:8000` |

**Не змінювались (за явною вимогою):** `TaskItem`, `PriorityBadge`, `TaskList`, `TaskSearch`, `TaskFilters`, `TaskSort`, `types/task.ts` — усі типи пропсів лишились сумісні з асинхронними обробниками без правок.

**Не додавались (за явною вимогою):** React Query, Axios, SWR, Redux, Context, Zustand, Repository Pattern, нові бібліотеки, optimistic update; архітектура бекенду не змінювалась.

**Search/Filter/Sort:** без змін у логіці — `useMemo` з Sprint 4 і далі обчислює `visibleTasks` з локального `tasks`, який тепер наповнюється з API замість статичного масиву.

### Перевірки якості — Sprint 7

- `npx tsc --noEmit` — пройдено без помилок.
- `npx eslint app/page.tsx lib/api.ts` — пройдено без помилок.
- Функціональна перевірка через Playwright проти живого `backend` (FastAPI + SQLite) і `frontend` (`npm run dev`) одночасно: видно проміжний текст `Loading...`; після завантаження — задачі з реальної БД; створення через форму → `POST` → рефетч → нова задача в списку; toggle completed → підтверджено відсутність optimistic update (чекбокс візуально "відкочується" одразу після кліку, стає `checked` лише після `PATCH`+рефетчу); search/filter/sort працюють коректно поверх даних з API; delete → задача зникає; **hard reload сторінки** після видалення показує стан, що відповідає бекенду (а не кешованому React-стану) — прямий доказ інтеграції з реальною SQLite через FastAPI; лог `uvicorn` — коректні `OPTIONS`(CORS)/`GET`/`POST`/`PATCH`/`DELETE`, консоль браузера без помилок; обидва dev-сервери зупинено.

---

## Підсумковий список змінених/створених файлів — Sprint 8 (Production Readiness)

| Файл | Тип зміни | Опис |
| --- | --- | --- |
| `README.md` (корінь) | створено | Опис проєкту, стек, структура директорій, quick start, env vars, Alembic, checks, API-таблиця, features |
| `backend/README.md` | оновлено | Застарілий "501 Not Implemented" замінено на актуальний перелік GET/POST/PATCH/DELETE |
| `frontend/README.md` | оновлено | Дефолтний `create-next-app` boilerplate замінено на проєктно-специфічні setup/run/checks |
| `frontend/.gitignore` | оновлено | Додано `!.env.example` (виняток із широкого `.env*`) |
| `frontend/.env.example` | створено | Документує `NEXT_PUBLIC_API_URL` |
| `frontend/components/task/EmptyState.tsx`, `Loading.tsx` | видалено | Порожні невикористані заглушки зі стартового скелета |
| `frontend/constants/task.ts` | видалено | Порожня невикористана заглушка |
| `frontend/hooks/useTasks.ts`, `useDebounce.ts` | видалено | Порожні невикористані заглушки |
| `frontend/lib/utils.ts` | видалено | Порожня невикористана заглушка |

**Не чіпалось (за явною вимогою):** увесь робочий код — компоненти, `lib/api.ts`, `types/task.ts`, весь `backend/app`, бізнес-логіка, архітектура.

**Не додавалось (за явною вимогою):** новий функціонал, зміна UI, PostgreSQL, React Query, Docker, CI/CD, авторизація, pagination, тестові фреймворки.

**`backend/.env.example`:** перевірено на актуальність (звірено з полями `Settings`) — без змін, уже точно відповідав `DATABASE_URL`/`CORS_ORIGINS`.

### Перевірки якості — Sprint 8

- `npx tsc --noEmit` (frontend) — пройдено без помилок.
- `npx eslint .` (увесь frontend-проєкт) — пройдено без помилок/warning.
- `mypy app` (strict, backend) — пройдено без помилок.
- `ruff check app alembic` (backend) — пройдено без помилок.
- Повне ручне тестування: Health (`200`), 404 на PATCH/DELETE неіснуючої задачі (`curl`), GET/POST/PATCH/DELETE через реальний UI (Playwright), Loading-стан, Search, Filter, Sort (asc/desc), **Hard Reload** (список відповідає стану бекенду, а не кешу), пряма перевірка SQLite через `sqlite3` (4 рядки, збігаються з UI) — усе пройдено; логи `uvicorn`/`next dev` та консоль браузера без помилок.
- `git status --porcelain` (увесь репозиторій) — лише очікувані зміни (README×3, dev-report, `.gitignore`, видалення 6 заглушок, новий `.env.example`); жодних `*.db`, `__pycache__`, `.mypy_cache`, `.ruff_cache`, `.pytest_cache`, `.venv` чи інших debug-артефактів.
