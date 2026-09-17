/* ============================================================
   1. i18n Core System
   ============================================================ */
const I18N = {
 es:{
  "nav.platform":"Plataforma","nav.how":"Cómo funciona","nav.solutions":"Soluciones","nav.trace":"Trazabilidad",
  "nav.login":"Iniciar sesión","nav.demo":"Ir a la Web App",
  "rail.start":"Inicio","rail.mon":"Monitoreo","rail.alerts":"Alertas","rail.feat":"Capturas","rail.team":"Equipo","rail.stories":"Historias","rail.testi":"Testimonios","rail.data":"Datos","rail.end":"Entrega",
  "hero.kicker":"Plataforma de transporte médico",
  "hero.title":"Todo lo que<br>ocurre<br>durante un<br>transporte, <span class=\"grad\">en<br>un solo lugar</span>.",
  "hero.sub":"Una plataforma para monitorear transportes médicos, detectar incidencias y mantener cada envío bajo control.",
  "hero.cta1":"Abrir la Web App","hero.cta2":"Iniciar sesión"
 },
 en:{
  "nav.platform":"Platform","nav.how":"How it works","nav.solutions":"Solutions","nav.trace":"Traceability",
  "nav.login":"Log in","nav.demo":"Open the Web App",
  "rail.start":"Start","rail.mon":"Monitoring","rail.alerts":"Alerts","rail.feat":"Features","rail.team":"Team","rail.stories":"Stories","rail.testi":"Testimonials","rail.data":"Data","rail.end":"Delivery",
  "hero.kicker":"Medical transport platform",
  "hero.title":"<span class=\"hl-line\">Everything</span><span class=\"hl-line\">happening during</span><span class=\"hl-line\">a medical</span><span class=\"hl-line\">transport, <span class=\"grad\">in one place</span>.</span>",
  "hero.sub":"A platform to monitor medical transports, catch incidents early and keep every shipment under control.",
  "hero.cta1":"Open the Web App","hero.cta2":"Log in"
 }
};
const TITLES={es:"Medical SmartBox — Monitoreo y trazabilidad del transporte médico",
              en:"Medical SmartBox — Monitoring and traceability for medical transport"};

let LANG="es";

function applyLang(lang){
  LANG=lang;
  const d=I18N[lang];
  if(d){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const k=el.getAttribute("data-i18n");
      if(d[k]) el.innerHTML=d[k];
    });
  }
  document.documentElement.lang=lang;
  document.title=TITLES[lang] || document.title;
  document.querySelectorAll(".js-lang").forEach(t=>{
    t.dataset.lang=lang;
    t.setAttribute("aria-checked", String(lang==="en"));
  });
  try{localStorage.setItem("msb-lang",lang);}catch(e){}
}

document.querySelectorAll(".js-lang").forEach(t=>{
  t.addEventListener("click",()=>applyLang(t.dataset.lang==="es"?"en":"es"));
  t.addEventListener("keydown",e=>{
    if(e.key==="ArrowRight") applyLang("en");
    if(e.key==="ArrowLeft") applyLang("es");
  });
});

/* ============================================================
   2. Route rail & Nav Scroll Progress
   ============================================================ */
const railItems=[...document.querySelectorAll(".rr-item")];
const railFill=document.getElementById("railFill");
const targets=railItems.map(a=>document.querySelector(a.getAttribute("href")));
const nav=document.getElementById("nav");

function onScroll(){
  if(nav) nav.classList.toggle("is-stuck",window.scrollY>10);
  const doc=document.documentElement;
  const pct=doc.scrollTop/(doc.scrollHeight-doc.clientHeight||1);
  const rail=document.getElementById("rail");
  if(railFill && rail) railFill.style.height=(pct*(rail.offsetHeight-12))+"px";

  let active=0;
  targets.forEach((t,i)=>{
    if(t && t.getBoundingClientRect().top<=window.innerHeight*0.42) active=i;
  });
  railItems.forEach((a,i)=>{
    a.setAttribute("aria-current",String(i===active));
    a.classList.toggle("passed",i<active);
  });
}
window.addEventListener("scroll",onScroll,{passive:true});
window.addEventListener("resize",onScroll);
onScroll();

/* ============================================================
   3. Mobile Drawer Handler
   ============================================================ */
const burger=document.getElementById("burger"), drawer=document.getElementById("drawer");
if(burger && drawer){
  const closeDrawer=()=>{drawer.dataset.open="false";burger.setAttribute("aria-expanded","false");};
  burger.addEventListener("click",e=>{
    e.stopPropagation();
    const open=drawer.dataset.open==="true";
    drawer.dataset.open=String(!open);
    burger.setAttribute("aria-expanded",String(!open));
  });
  drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeDrawer));
  document.addEventListener("keydown",e=>{if(e.key==="Escape") closeDrawer();});
}

let startLang="en";
try{startLang=localStorage.getItem("msb-lang")||"en";}catch(e){}
applyLang(startLang);
