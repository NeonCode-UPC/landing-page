/* ============================================================
   Live telemetry (simulated readings) Engine
   ============================================================ */
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let temp=4.2, batt=82, fuel=64, km=312, etaMin=14*60+35, progress=52;

function paint(key,value){
  document.querySelectorAll('[data-live="'+key+'"]').forEach(el=>{
    if(el.textContent!==value){
      el.textContent=value;
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    }
  });
}

function tick(){
  temp=Math.min(5.4,Math.max(3.4,temp+(Math.random()-.5)*.3));
  batt=Math.max(60,batt-(Math.random()<.35?.1:0));
  fuel=Math.max(40,fuel-(Math.random()<.4?.1:0));
  km+=Math.random()<.6?1:0;
  progress=Math.min(94,progress+.25);
  if(Math.random()<.25) etaMin+=Math.random()<.5?1:-1;

  paint("temp",temp.toFixed(1)+" °C");
  paint("batt",Math.round(batt)+" %");
  paint("fuel",Math.round(fuel)+" %");
  paint("km",km+" km");
  const h=String(Math.floor(etaMin/60)).padStart(2,"0"), m=String(etaMin%60).padStart(2,"0");
  paint("eta",h+":"+m);

  const dot=document.getElementById("tkDot");
  if(dot) dot.style.left=progress+"%";

  /* nudge the sparkline */
  const line=document.getElementById("tempLine"), head=document.getElementById("tempHead");
  if(line){
    const pts=line.getAttribute("points").split(" ").map(p=>p.split(",").map(Number));
    pts.shift();
    const y=44-((temp-3.4)/2)*14;
    pts.push([232,y]);
    pts.forEach((p,i)=>p[0]=20+i*21.2);
    line.setAttribute("points",pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" "));
    if(head){
      head.setAttribute("cx",pts[pts.length-1][0].toFixed(1));
      head.setAttribute("cy",pts[pts.length-1][1].toFixed(1));
    }
  }
}

if(!reduce){
  setInterval(tick,2600);
}else{
  document.querySelectorAll("animateMotion").forEach(a=>a.remove());
}
