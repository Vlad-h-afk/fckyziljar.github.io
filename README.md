# ФК «Кызылжар» — сайт академии

Структура: index.html, css/style.css, js/ (config, db, app, auth, main), supabase/schema.sql

## Подключение Supabase
1. Создайте проект на supabase.com.
2. SQL Editor -> вставьте supabase/schema.sql -> Run.
3. Project Settings -> API: скопируйте Project URL и anon public key в js/config.js.
4. Authentication -> Providers -> Email: отключите «Confirm email» (иначе после регистрации нужно подтвердить почту).
5. Откройте index.html. Зарегистрируйтесь как «Админ», на вкладке «База футболистов» нажмите «Загрузить демо-игроков в базу».

Без ключа сайт работает в демо-режиме (данные в браузере). Используйте только anon key, service_role в код вставлять нельзя.
Внимание: роль выбирается при регистрации самим пользователем. Для боевой версии ограничьте выбор «Админ» (например, назначайте роль вручную в таблице kz_profiles).
