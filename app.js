(() => {
const KEY="dayflow-goal-v1", setup=document.getElementById("setup-panel"), tracker=document.getElementById("tracker-panel"), custom=document.getElementById("custom-days"), presets=[...document.querySelectorAll(".preset")];
let selected=90,state=null;
document.getElementById("year").textContent=new Date().getFullYear();
function dateString(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function parseDate(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)}
function diff(a,b){return Math.floor((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/86400000)}
function label(d){return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2200)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast("Could not save in this browser.")}}
function render(){
 if(!state){setup.classList.remove("hidden");tracker.classList.add("hidden");return}
 setup.classList.add("hidden");tracker.classList.remove("hidden");
 const start=parseDate(state.startDate),today=new Date(),elapsed=Math.max(0,diff(start,today)),day=Math.min(elapsed+1,state.days),done=elapsed+1>=state.days,pct=Math.min(100,Math.round(day/state.days*100)),end=new Date(start);end.setDate(end.getDate()+state.days-1);
 document.getElementById("day-number").textContent=day;document.getElementById("goal-duration").textContent=`${state.days} DAY${state.days===1?"":"S"} GOAL`;document.getElementById("progress-label").textContent=pct+"%";document.getElementById("progress-fill").style.width=pct+"%";document.getElementById("start-date").textContent="STARTED "+label(start).toUpperCase();document.getElementById("end-date").textContent="TARGET "+label(end).toUpperCase();
 document.getElementById("day-caption").textContent=done?"You made it. Take a moment to be proud of how far you've come.":day===1?"You're on day one. That's where every great thing starts.":`You've shown up for ${day} days. Keep the promise you made to yourself.`;
 document.getElementById("reset-btn").innerHTML=(done?"Begin another journey":"Start a new journey")+' <span>↗</span>';
}
presets.forEach(b=>b.addEventListener("click",()=>{selected=Number(b.dataset.days);custom.value="";presets.forEach(p=>p.classList.toggle("selected",p===b))}));
custom.addEventListener("input",()=>{if(custom.value!=="")presets.forEach(p=>p.classList.remove("selected"))});
document.getElementById("start-btn").addEventListener("click",()=>{const raw=custom.value.trim(),days=raw?Number(raw):selected;if(!Number.isInteger(days)||days<1||days>36500){toast("Enter a whole number from 1 to 36,500.");custom.focus();return}state={days,startDate:dateString(new Date())};save();render();toast("Your journey starts today. Let's go!")});
document.getElementById("edit-goal").addEventListener("click",()=>{if(state){selected=state.days;custom.value=[7,30,60,90,180,365].includes(state.days)?"":String(state.days);presets.forEach(p=>p.classList.toggle("selected",Number(p.dataset.days)===state.days&&custom.value===""))}setup.classList.remove("hidden");tracker.classList.add("hidden")});
document.getElementById("reset-btn").addEventListener("click",()=>{state=null;try{localStorage.removeItem(KEY)}catch(e){}selected=90;custom.value="";presets.forEach(p=>p.classList.toggle("selected",Number(p.dataset.days)===90));render();window.scrollTo({top:0,behavior:"smooth"})});
try{const raw=localStorage.getItem(KEY);if(raw){const x=JSON.parse(raw);if(Number.isInteger(x.days)&&x.days>0&&/^\d{4}-\d{2}-\d{2}$/.test(x.startDate))state=x}}catch(e){}
render();
})();