// Load product data
fetch("../products.json")
  .then(r=>r.json())
  .then(products=>{
    const list=document.getElementById("productList");
    products.forEach((p,i)=>{
      const li=document.createElement("li");
      li.textContent=p.name;
      li.style.borderLeft=`4px solid ${p.accent}`;
      li.onclick=()=>showProduct(p);
      list.appendChild(li);
      if(i===0)showProduct(p);
    });
  });

const chatWin=document.getElementById("chatWindow");
const chatInput=document.getElementById("chatInput");
const chatSend=document.getElementById("chatSend");
let currentProduct=null;

function showProduct(p){
  currentProduct=p;
  const area=document.getElementById("productDisplay");
  area.innerHTML=`<h2 style="color:${p.accent}">${p.name}</h2><p>${p.subtitle}</p>`;
  addBot(`You are viewing the ${p.name}. Ask about fit, material, sigils, or care.`);
}

function addMessage(text,from){
  const div=document.createElement("div");
  div.className=`msg ${from}`;
  if(from==="bot"){
    const title=document.createElement("div");
    title.className="msg-title";
    title.textContent="EnTrus Design Assistant";
    div.appendChild(title);
  }
  const body=document.createElement("div");
  body.textContent=text;
  div.appendChild(body);
  chatWin.appendChild(div);
  setTimeout(()=>div.classList.add("show"),50);
  chatWin.scrollTop=chatWin.scrollHeight;
}

function addBot(t){addMessage(t,"bot");}
function addUser(t){addMessage(t,"user");}

chatSend.onclick=handleChat;
chatInput.addEventListener("keydown",e=>{if(e.key==="Enter")handleChat();});

function handleChat(){
  const q=chatInput.value.trim();
  if(!q)return;
  addUser(q);
  chatInput.value="";
  simulateApi(q);
}

function simulateApi(q){
  const typing=document.createElement("div");
  typing.className="msg bot typing show";
  typing.textContent="EnTrus Design Assistant is typing";
  chatWin.appendChild(typing);
  chatWin.scrollTop=chatWin.scrollHeight;

  setTimeout(()=>{
    typing.remove();
    // placeholder for real API call
    // fetch("/api/entrus-chat",{method:"POST",body:JSON.stringify({product:currentProduct,query:q})})
    //   .then(r=>r.text()).then(answer=>addBot(answer));
    const a=localAnswer(q);
    addBot(a);
  },1000+Math.random()*500);
}

function localAnswer(q){
  const p=currentProduct||{};
  const l=q.toLowerCase();
  if(l.includes("fit")||l.includes("size")) return `The ${p.category||"item"} follows a ${p.fit||"regular"} fit.`;
  if(l.includes("material")||l.includes("fabric")) return `Material: ${p.material||"cotton blend"}.`;
  if(l.includes("sigil")||l.includes("logo")) return `Sigil placement: ${p.sigils||"standard chest seal"}.`;
  if(l.includes("care")||l.includes("wash")) return p.care||"Machine wash cold, hang dry.";
  return `This information is based on the official EnTrus spec sheet for ${p.name||"this product"}.`;
}
