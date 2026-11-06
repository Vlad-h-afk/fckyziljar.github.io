// Запуск сайта
(async()=>{
  DB.init();
  if(DB.on){cur=null;try{const u=await DB.restore();if(u){cur=u;await DB.loadPlayers()}}catch(e){console.error(e)}}
  nav();setCur(cur);
  document.getElementById("st").textContent=DB.on?"База данных: Supabase подключён ✓":"Демо-режим: ключ Supabase не вставлен (js/config.js), данные хранятся в браузере";
})();
