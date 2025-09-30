document.addEventListener("DOMContentLoaded", function() {
  var email = document.getElementById("email");
  var phone = document.getElementById("phone");
  var pass = document.getElementById("pass");
  var rEmail = document.getElementById("rEmail");
  var rPhone = document.getElementById("rPhone");
  var rPass = document.getElementById("rPass");
  var target = document.getElementById("targetDate");
  var days = document.getElementById("daysLeft");
  var btnToday = document.getElementById("setToday");
  var btnAdd = document.getElementById("addTask");
  var inpTask = document.getElementById("newTaskText");
  var btnClear = document.getElementById("clearBoard");
  var cols = document.querySelectorAll(".column .tasks");

  var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var rePass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  document.getElementById("checkEmail").addEventListener("click", function(){
    if (reEmail.test(email.value)) rEmail.textContent = "Email válido"; else rEmail.textContent = "Email inválido";
  });

  function validarTelefonoRaw(text) {
    if (!text) return false;
    var soloDigitos = (text + "").replace(/\D/g, "");
    return soloDigitos.length >= 10 && soloDigitos.length <= 15;
  }

  document.getElementById("checkPhone").addEventListener("click", function(){
    if (validarTelefonoRaw(phone.value)) rPhone.textContent = "Teléfono válido"; else rPhone.textContent = "Teléfono inválido";
  });

  document.getElementById("checkPass").addEventListener("click", function(){
    if (rePass.test(pass.value)) rPass.textContent = "Contraseña válida"; else rPass.textContent = "Contraseña inválida";
  });

  function diffDays(iso) {
    if (!iso) return "";
    var today = new Date();
    var t = new Date(iso + "T00:00:00");
    var base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var diff = Math.ceil((t - base) / 86400000);
    if (diff > 0) return diff + " días restantes";
    if (diff === 0) return "Hoy";
    return Math.abs(diff) + " días desde la fecha";
  }

  target.addEventListener("input", function(){ days.textContent = diffDays(this.value); });
  btnToday.addEventListener("click", function(){
    var d = new Date(); d.setDate(d.getDate() + 7);
    var s = d.toISOString().slice(0,10);
    target.value = s;
    days.textContent = diffDays(s);
  });

  function enableDrag(el) {
    el.setAttribute("draggable","true");
    el.addEventListener("dragstart", function(e){ e.dataTransfer.setData("text", e.target.id); });
  }

  var starterTasks = document.querySelectorAll(".task");
  for (var i = 0; i < starterTasks.length; i++) enableDrag(starterTasks[i]);

  for (var j = 0; j < cols.length; j++) {
    cols[j].addEventListener("dragover", function(e){ e.preventDefault(); });
    cols[j].addEventListener("drop", function(e){
      e.preventDefault();
      var id = e.dataTransfer.getData("text");
      var node = document.getElementById(id);
      if (node) this.appendChild(node);
    });
  }

  function newTaskHtml(text) {
    var id = "t" + Date.now();
    var div = document.createElement("div");
    div.className = "task";
    div.id = id;
    div.textContent = text;
    enableDrag(div);
    return div;
  }

  btnAdd.addEventListener("click", function(){
    var v = (inpTask.value || "").trim();
    if (!v) return;
    var t = newTaskHtml(v);
    document.getElementById("col-1").appendChild(t);
    inpTask.value = "";
    console.log("tarea creada:", v);
  });

  btnClear.addEventListener("click", function(){
    for (var k = 0; k < cols.length; k++) cols[k].innerHTML = "";
    console.log("tablero limpio");
  });
});
