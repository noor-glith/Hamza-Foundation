/* Hamza Foundation Hospital: shared page logic. Hospital details live in js/data.js.
   Every feature checks that its elements exist, so the same file works on every page. */
const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);
const esc = s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- Mobile menu ---------- */
const menuBtn=$("#menu-btn"), nav=$("#main-nav");
if(menuBtn && nav){
  menuBtn.addEventListener("click",()=>{
    const open=menuBtn.getAttribute("aria-expanded")==="true";
    menuBtn.setAttribute("aria-expanded",String(!open));
    menuBtn.setAttribute("aria-label",open?"Open menu":"Close menu");
    nav.classList.toggle("open",!open);
  });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape" && nav.classList.contains("open")){ menuBtn.click(); menuBtn.focus(); } });
}

/* ---------- Google Maps links ---------- */
/* https://developers.google.com/maps/documentation/urls/get-started */
const Maps = {
  place: ()=>`https://www.google.com/maps/search/?api=1&query=${BRANCH.latitude},${BRANCH.longitude}`,
  directions: origin=>{
    let u=`https://www.google.com/maps/dir/?api=1&destination=${BRANCH.latitude},${BRANCH.longitude}&travelmode=driving`;
    if(origin) u+=`&origin=${origin.lat},${origin.lng}`;   // omitted → Maps uses the device's live location
    return u;
  },
  emergency: origin=> origin ? `https://www.google.com/maps/search/emergency+hospital/@${origin.lat},${origin.lng},14z` : `https://www.google.com/maps/search/emergency+hospital+near+me`
};
let origin=null;
function setLinks(){
  $$('[data-maps="directions"]').forEach(a=>a.href=Maps.directions(null));
  $$('[data-maps="result"]').forEach(a=>a.href=Maps.directions(origin));
  $$('[data-maps="place"]').forEach(a=>a.href=Maps.place());
  $$('[data-maps="emergency"]').forEach(a=>a.href=Maps.emergency(origin));
}

/* ---------- Distance checker (Directions page) ---------- */
function distanceKm(a,b){const R=6371,r=d=>d*Math.PI/180,dLat=r(b.lat-a.lat),dLng=r(b.lng-a.lng);
  const h=Math.sin(dLat/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
const LOC_MSG={
  loading:"Finding your location…",
  denied:"We couldn't access your location. Enter your area manually to see the distance to the hospital.",
  unavailable:"Your device couldn't determine its location right now. Enter your area manually to see the distance to the hospital.",
  timeout:"Finding your location took too long. Try Use My Location again, or enter your area manually.",
  unsupported:"This browser doesn't support location access. Enter your area manually to see the distance to the hospital.",
  notfound:q=>`We couldn't find “${q}”. Try a Lahore area such as Gulberg, Model Town or DHA.`,
  empty:"Enter your area, or use your location."
};
function setStatus(kind,text){
  const el=$("#loc-status");
  const cls=kind==="loading"?"info":kind==="ok"?"ok":"err";
  el.className=`loc-status show ${cls}`;
  el.innerHTML=(kind==="loading"?'<span class="spinner" aria-hidden="true"></span>':
   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true" style="flex:none;margin-top:2px">${cls==="ok"?'<path d="M20 6L9 17l-5-5"/>':'<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5v.5"/>'}</svg>`)+`<span>${esc(text)}</span>`;
  const b=$("#use-location"); b.disabled=kind==="loading"; b.setAttribute("aria-busy",kind==="loading");
}
function showDistance(){
  const km=distanceKm(origin,{lat:BRANCH.latitude,lng:BRANCH.longitude});
  $("#dist-value").textContent=`${km.toFixed(1)} km away`;
  $("#dist-from").textContent=`Straight-line distance from ${origin.label}. Google Maps shows the road route.`;
  $("#dist-result").classList.add("show");
  setLinks();
}
function lookupArea(q){
  const s=q.toLowerCase().replace(/,?\s*lahore\b/g,"").replace(/[^\w\s]/g," ").replace(/\s+/g," ").trim();
  let best=null;
  for(const a of AREAS) for(const al of a.aliases) if(s===al||s.includes(al)) if(!best||al.length>best.len) best={a,len:al.length};
  return best&&best.a;
}
function useMyLocation(){
  if(!("geolocation" in navigator)){setStatus("err",LOC_MSG.unsupported);$("#q").focus();return;}
  setStatus("loading",LOC_MSG.loading);
  navigator.geolocation.getCurrentPosition(p=>{
    origin={lat:p.coords.latitude,lng:p.coords.longitude,label:"your current location",source:"gps"};
    setStatus("ok",`Location found${p.coords.accuracy?` (accurate to about ${Math.round(p.coords.accuracy)} m)`:""}.`);
    showDistance();
  },e=>{
    const k=e.code===1?"denied":e.code===3?"timeout":"unavailable";
    setStatus("err",LOC_MSG[k]); $("#q").focus();
  },{enableHighAccuracy:false,timeout:12000,maximumAge:120000});
}
if($("#search-form")){
  $("#area-list").innerHTML=AREAS.map(a=>`<option value="${a.name}, Lahore">`).join("");
  $("#search-form").addEventListener("submit",e=>{
    e.preventDefault();
    const q=$("#q").value.trim();
    if(!q){setStatus("err",LOC_MSG.empty);$("#q").focus();return;}
    const a=lookupArea(q);
    if(!a){setStatus("err",LOC_MSG.notfound(q));$("#q").focus();return;}
    origin={lat:a.lat,lng:a.lng,label:`${a.name}, Lahore`,source:"area"};
    setStatus("ok",`Showing distance from ${a.name}, Lahore.`);
    showDistance();
  });
  $("#q").addEventListener("input",e=>{$("#clear-q").hidden=!e.target.value;});
  $("#clear-q").addEventListener("click",()=>{$("#q").value="";$("#clear-q").hidden=true;$("#q").focus();});
  $("#use-location").addEventListener("click",useMyLocation);
}

/* ---------- Opening hours + live status (Pakistan time) ---------- */
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const to12=t=>{const [h,m]=t.split(":").map(Number);return `${((h+11)%12)+1}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;};
const toMin=t=>{const [h,m]=t.split(":").map(Number);return h*60+m;};
function nowPK(){
  const p=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Karachi",weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
  const g=t=>p.find(x=>x.type===t).value;
  return {day:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday")),min:Number(g("hour"))*60+Number(g("minute"))};
}
function renderHours(){
  const {day,min}=nowPK();
  const rows=[1,2,3,4,5,6,0].map(d=>{
    const h=BRANCH.hours[d];
    return `<tr class="${d===day?"today":""}"><th scope="row">${DAYS[d]}${d===day?'<span class="sr-only"> (today)</span>':""}</th><td>${h?`${to12(h[0])} to ${to12(h[1])}`:"Closed"}</td></tr>`;
  }).join("");
  $$(".js-hours").forEach(t=>t.innerHTML=rows);
  const today=BRANCH.hours[day];
  let open=false,label="Call for timings";
  if(today && min>=toMin(today[0]) && min<toMin(today[1])){open=true;label=`Morning OPD open now, until ${to12(today[1])}`;}
  else{
    for(let i=0;i<8;i++){const d=(day+i)%7,h=BRANCH.hours[d]; if(!h) continue;
      if(i===0 && min<toMin(h[0])){label=`Morning OPD opens today at ${to12(h[0])}`;break;}
      if(i>0){label=`Morning OPD opens ${i===1?"tomorrow":DAYS[d]} at ${to12(h[0])}`;break;}}
  }
  $$(".js-status").forEach(el=>{
    el.className=`status js-status ${open?"open":"closed"}`;
    el.innerHTML=`<span class="dot" aria-hidden="true"></span>${label}`;
  });
}
if($(".js-hours")||$(".js-status")){ renderHours(); setInterval(renderHours,60000); }

/* ---------- Contact form (opens the visitor's email app) ---------- */
const form=$("#contact-form");
if(form){
  form.addEventListener("submit",e=>{
    e.preventDefault();
    let firstBad=null;
    [["c-name","c-name-err"],["c-msg","c-msg-err"]].forEach(([id,err])=>{
      const f=$("#"+id), bad=!f.value.trim();
      f.setAttribute("aria-invalid",bad); $("#"+err).hidden=!bad;
      if(bad && !firstBad) firstBad=f;
    });
    if(firstBad){ firstBad.focus(); return; }
    const name=$("#c-name").value.trim(), phone=$("#c-phone").value.trim(), msg=$("#c-msg").value.trim();
    const body=`${msg}\n\nName: ${name}${phone?`\nPhone: ${phone}`:""}`;
    location.href=`mailto:${BRANCH.email}?subject=${encodeURIComponent("Message for Hamza Foundation Hospital, Samanabad")}&body=${encodeURIComponent(body)}`;
  });
}

setLinks();
