// Слой работы с Supabase. Если ключ не вставлен, DB.on = false и сайт работает локально.
const DB={on:false,sb:null,loaded:false,
init(){const k=window.SUPABASE_URL+window.SUPABASE_ANON_KEY;if(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY&&!/YOUR|ВАШ/i.test(k)){DB.sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);DB.on=true}},
toU(r){return{id:r.id,n:r.name,role:r.role,email:r.email,phone:r.phone,team:r.team,lic:r.lic,region:r.region,child:r.child,photo:r.photo}},
async register(u){const{data,error}=await DB.sb.auth.signUp({email:u.email,password:u.pw});if(error)return{error:error.message};
 if(!data.session)return{error:"Supabase отправил письмо для подтверждения email. Подтвердите его (или отключите Confirm email в Authentication → Providers → Email) и затем войдите."};
 const row={id:data.user.id,name:u.n,role:u.role,email:u.email,phone:u.phone||null,team:u.team||null,lic:u.lic||null,region:u.region||null,child:u.child??null,photo:u.photo||null};
 const r=await DB.sb.from("kz_profiles").insert(row);if(r.error)return{error:r.error.message};return{user:DB.toU(row)}},
async login(email,pw){const{data,error}=await DB.sb.auth.signInWithPassword({email,password:pw});if(error)return{error:"Неверный email или пароль"};return DB.profile(data.user.id)},
async profile(id){const{data,error}=await DB.sb.from("kz_profiles").select("*").eq("id",id).single();if(error)return{error:"Профиль не найден: "+error.message};return{user:DB.toU(data)}},
async restore(){const{data}=await DB.sb.auth.getSession();if(!data.session)return null;const r=await DB.profile(data.session.user.id);return r.user||null},
async logout(){await DB.sb.auth.signOut()},
async saveProfile(u){await DB.sb.from("kz_profiles").update({name:u.n,role:u.role,phone:u.phone,team:u.team,lic:u.lic,region:u.region,child:u.child??null,photo:u.photo||null}).eq("id",u.id)},
row(p){return{name:p.n,team:p.t,pos:p.pos,skills:p.st,goals:p.g,assists:p.a,matches:p.m,attendance:p.att,age:p.age,height:p.h,weight:p.w,potential:p.pot}},
async loadPlayers(){const{data,error}=await DB.sb.from("kz_players").select("*").order("id");if(error||!data||!data.length)return;DB.loaded=true;P.length=0;data.forEach((r,i)=>P.push({id:i,dbId:r.id,n:r.name,t:r.team,pos:r.pos,st:r.skills,ovr:Math.round(r.skills.reduce((a,b)=>a+b,0)/7),g:r.goals,a:r.assists,m:r.matches,att:r.attendance,age:r.age,h:r.height,w:r.weight,pot:r.potential}))},
addPlayer(p){return DB.sb.from("kz_players").insert([DB.row(p)])},
seed(){return DB.sb.from("kz_players").insert(P.map(DB.row))}};
