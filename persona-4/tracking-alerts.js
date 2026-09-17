/* ============================================================
   Timeline & Fleet Interaction System
   ============================================================ */
const EVENTS={
 es:[
  {t:"Preparado en almacén",d:"El envío se acondicionó a 4 °C y se asignó el SmartBox SB-0182.",time:"08:10",loc:"Almacén Lima",temp:"4.0 °C"},
  {t:"Recogido por el vehículo",d:"Carga verificada: 18.4 kg. Puerta cerrada y precintada al salir.",time:"08:42",loc:"Almacén Lima",temp:"4.1 °C"},
  {t:"En tránsito",d:"Salida a Panamericana Sur. Lecturas cada 60 segundos desde el SmartBox.",time:"10:05",loc:"Km 312",temp:"4.2 °C"},
  {t:"Llegando a Arequipa",d:"El vehículo entró al perímetro de destino. Se notificó al centro receptor.",time:"14:12",loc:"Arequipa",temp:"4.4 °C"},
  {t:"Entrega pendiente",d:"A la espera de la confirmación del receptor para cerrar el historial.",time:"14:35",loc:"Arequipa",temp:"—"}
 ],
 en:[
  {t:"Prepared at the warehouse",d:"The shipment was conditioned to 4 °C and SmartBox SB-0182 was assigned.",time:"08:10",loc:"Lima warehouse",temp:"4.0 °C"},
  {t:"Picked up by the vehicle",d:"Load verified: 18.4 kg. Door closed and sealed on departure.",time:"08:42",loc:"Lima warehouse",temp:"4.1 °C"},
  {t:"In transit",d:"Departed onto Panamericana Sur. Readings every 60 seconds from the SmartBox.",time:"10:05",loc:"Km 312",temp:"4.2 °C"},
  {t:"Arriving in Arequipa",d:"The vehicle entered the destination perimeter. The receiving centre was notified.",time:"14:12",loc:"Arequipa",temp:"4.4 °C"},
  {t:"Delivery pending",d:"Waiting for the receiver's confirmation to close the record.",time:"14:35",loc:"Arequipa",temp:"—"}
 ]
};

let currentEvent=3;
const steps=[...document.querySelectorAll(".step")];

function renderEvent(i){
  const lang = document.documentElement.lang || "es";
  const evList = EVENTS[lang] || EVENTS["es"];
  const ev = evList[i];
  if(!ev) return;
  const evTitle = document.getElementById("evTitle");
  const evDesc = document.getElementById("evDesc");
  const evTime = document.getElementById("evTime");
  const evLoc = document.getElementById("evLoc");
  const evTemp = document.getElementById("evTemp");
  if(evTitle) evTitle.textContent=ev.t;
  if(evDesc) evDesc.textContent=ev.d;
  if(evTime) evTime.textContent=ev.time;
  if(evLoc) evLoc.textContent=ev.loc;
  if(evTemp) evTemp.textContent=ev.temp;
  steps.forEach((s,n)=>s.setAttribute("aria-selected",String(n===i)));
}

steps.forEach(s=>s.addEventListener("click",()=>{
  currentEvent=Number(s.dataset.ev);
  renderEvent(currentEvent);
}));

/* Fleet selection handler */
const fleetRows=[...document.querySelectorAll("[data-fleet]")];
fleetRows.forEach(r=>r.addEventListener("click",()=>{
  const v=JSON.parse(r.dataset.fleet);
  fleetRows.forEach(o=>o.setAttribute("aria-pressed",String(o===r)));
  const flId = document.getElementById("flId");
  const flTemp = document.getElementById("flTemp");
  const flEta = document.getElementById("flEta");
  const flBox = document.getElementById("flBox");
  if(flId) flId.textContent=v.id;
  if(flTemp) flTemp.textContent=v.temp;
  if(flEta) flEta.textContent=v.eta;
  if(flBox) flBox.textContent=v.box;
}));
