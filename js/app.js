(function () {
  var app = document.getElementById("app"), qi = document.getElementById("q"), Q = "";
  var DEF = { nome: "João", prazoNome: "Matrícula", prazoData: "", cf: 0, ct: 240, done: {} };

  /* ---------- armazenamento (seguro se o navegador bloquear) ---------- */
  function load() { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem("jw") || "{}")); } catch (e) { return Object.assign({}, DEF); } }
  function save() { try { localStorage.setItem("jw", JSON.stringify(S)); } catch (e) {} }
  var S = load();

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function mins(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function svg(id) { return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[id] + '</svg>'; }
  function item(id) {
    var x = IT[id];
    return '<a class="it" href="#' + id + '"><b>' + x[0] + '</b><span>' + x[1] + '</span>' + (x[2] ? '<i class="tag">Público</i>' : '') + '</a>';
  }
  function fmtData(iso) {
    if (!iso) return "defina a data em “Olá, " + esc(S.nome) + "”";
    var d = new Date(iso + "T00:00:00"), hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var n = Math.round((d - hoje) / 864e5), s = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
    return s + (n > 0 ? " · faltam " + n + (n === 1 ? " dia" : " dias") : n === 0 ? " · é hoje!" : " · já passou");
  }

  /* ---------- páginas ---------- */
  function vInicio() {
    var q = ["matricula", "grade", "requerimento", "documentos", "aex", "bolsas"].map(function (id) {
      return '<a class="card" href="#' + id + '" style="display:flex;flex-direction:column;gap:10px;min-height:160px"><span class="ico">' + svg(id) + '</span><b style="font-size:19px">' + IT[id][0] + '</b><span class="sub" style="margin:0;font-size:15px">' + IT[id][1] + '</span></a>';
    }).join("");
    var ap = APOIO.map(function (a) { return '<a class="chip" href="#apoio">' + a[0] + '</a>'; }).join("");
    var pct = Math.min(100, Math.round(S.cf / Math.max(1, S.ct) * 100));
    var feitos = CALOURO.filter(function (_, i) { return S.done[i]; }).length;
    var lista = CALOURO.map(function (t, i) {
      return '<label class="check"><input type="checkbox" data-i="' + i + '"' + (S.done[i] ? " checked" : "") + '><span>' + t + '</span></label>';
    }).join("");
    return '<section class="hero"><div class="big"><p class="k">Seu painel do curso</p><h1 style="margin:10px 0 12px">O que você precisa fazer hoje?</h1><p class="d">Matrícula, grade, requerimentos e documentos num só lugar, com cada coisa explicada em uma linha.</p></div>'
      + '<div class="card stat"><span class="l">Próximo prazo</span><b>' + esc(S.prazoNome) + '</b><span class="sub" style="margin:0">' + fmtData(S.prazoData) + '</span><a class="go" href="#calendario">Ver calendário escolar →</a></div>'
      + '<div class="card stat"><span class="l">Evolução no curso</span><b>' + S.cf + ' de ' + S.ct + ' créditos</b><div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div><a class="go" href="#acompanhamentos">Ver o que falta →</a></div></section>'
      + '<section><h2>Acesso rápido</h2><p class="sub">As tarefas mais comuns, com o que cada uma significa.</p><div class="grid g3" style="margin-top:20px">' + q + '</div></section>'
      + '<section class="card" style="padding:30px"><h2>Apoio da USP para você</h2><p class="sub">Ninguém entra sabendo. Pedir ajuda faz parte, e os veteranos já passaram por isso.</p><div class="row" style="margin-top:20px">' + ap + '</div></section>'
      + '<section class="card"><h2>Checklist do calouro <span class="tag">' + feitos + '/' + CALOURO.length + '</span></h2><p class="sub">Marque o que já fez. Fica salvo neste navegador.</p><div style="margin-top:14px">' + lista + '</div></section>'
      + '<section class="note"><h2>Ajude a melhorar o Júpiter</h2><p class="sub">Estudantes podem sugerir melhorias de interface e testar novidades, inclusive no celular.</p><button class="btn dk" id="sgb" type="button" style="margin-top:14px">Enviar sugestão</button><div id="sg" hidden><textarea aria-label="Sua sugestão" placeholder="Escreva sua ideia…"></textarea><p class="sub" style="font-size:14px">Demonstração: a sugestão não é enviada a lugar nenhum.</p></div></section>';
  }

  function vMapa() {
    var g = GROUPS.map(function (x) { return '<section class="card"><h2>' + x[0] + '</h2>' + x[1].map(item).join("") + '</section>'; }).join("");
    var n = Object.keys(IT).length;
    return '<div><h1>Todas as páginas do Júpiter Web</h1><p class="sub">Os ' + n + ' itens do menu, agrupados pelo que o aluno quer fazer. Itens com a etiqueta Público abrem sem login.</p></div><div class="grid g3" style="align-items:start">' + g + '</div>';
  }

  function vGrade() {
    var hoje = new Date().getDay() - 1, agora = new Date().getHours() * 60 + new Date().getMinutes(), cols = "", heads = "";
    ["Seg", "Ter", "Qua", "Qui", "Sex"].forEach(function (n, d) {
      heads += '<div class="dh' + (d === hoje ? " hoje" : "") + '">' + n + '</div>';
      cols += '<div class="col' + (d === hoje ? " hoje" : "") + '">';
      AULAS.forEach(function (a) {
        if (a[1] !== d) return;
        var t = (mins(a[2]) - 480) * 56 / 60, h = (mins(a[3]) - mins(a[2])) * 56 / 60 - 2;
        cols += '<div class="blk" style="--h:' + a[4] + ';top:' + t.toFixed(0) + 'px;height:' + h.toFixed(0) + 'px" title="' + a[0] + ' ' + a[2] + '–' + a[3] + '"><b>' + a[0] + '</b>' + a[2] + '–' + a[3] + '</div>';
      });
      if (d === hoje && agora >= 480 && agora <= 1080) cols += '<div class="agora" style="top:' + ((agora - 480) * 56 / 60).toFixed(0) + 'px" title="Agora"></div>';
      cols += '</div>';
    });
    var hrs = "";
    [8, 10, 12, 14, 16, 18].forEach(function (h) { hrs += '<span style="top:' + ((h - 8) * 56 - (h === 8 ? 8 : 0) - (h === 18 ? 8 : 0)) + 'px">' + (h < 10 ? "0" : "") + h + ':00</span>'; });
    return '<div><div class="crumb"><a href="#inicio">Início</a> › Meu semestre</div><h1>Grade horária</h1><p class="sub">Engenharia de Computação (integral) · Escola de Engenharia de São Carlos e ICMC · Situação: ativo</p></div>'
      + '<div class="row"><a class="btn" href="#grade">Minha semana</a><a class="btn o" href="#disciplina">Buscar turmas</a><button class="btn o" type="button" onclick="window.print()" style="margin-left:auto">Imprimir</button></div>'
      + '<div class="card gw"><div class="gi"><div></div>' + heads + '<div class="hr">' + hrs + '</div>' + cols + '</div></div>'
      + '<p class="sub">Cada disciplina tem uma cor. A linha vermelha marca o horário de agora. Sábado e domingo só aparecem se houver aula. Dados de exemplo.</p>';
  }

  function vApoio() {
    return '<div><div class="crumb"><a href="#inicio">Início</a> › Apoio</div><h1>Apoio da USP para você</h1><p class="sub">Ninguém entra sabendo. Pedir ajuda faz parte, e os veteranos já passaram por isso.</p></div><div class="grid g3">'
      + APOIO.map(function (a) { return '<div class="card"><b style="font-size:18px">' + a[0] + '</b><p class="sub" style="font-size:15px">' + a[1] + '</p></div>'; }).join("")
      + '</div><p class="sub">Página de exemplo: aqui entrariam os links e contatos oficiais de cada serviço.</p>';
  }

  function vItem(id) {
    var x = IT[id], gn = "";
    GROUPS.forEach(function (g) { if (g[1].indexOf(id) > -1) gn = g[0]; });
    var s = STEPS[id] ? '<section class="card"><h2>Como fazer</h2><div style="display:flex;flex-direction:column;gap:16px;margin-top:16px">' + STEPS[id].map(function (t, i) { return '<div class="step"><i>' + (i + 1) + '</i><p>' + t + '</p></div>'; }).join("") + '</div></section>' : "";
    var lk = '<div class="links">' + (x[3] ? '<a href="' + x[3] + '" target="_blank" rel="noopener">Guia oficial desta página ↗</a>' : '') + '<a href="' + JW + '" target="_blank" rel="noopener">Abrir o Júpiter Web oficial ↗</a></div>';
    return '<div><div class="crumb"><a href="#inicio">Início</a> › <a href="#mapa">' + gn + '</a></div><h1>' + x[0] + '</h1><p class="sub">' + x[1] + (x[2] ? ' <span class="tag">Público, sem login</span>' : '') + '</p></div>'
      + s + '<section class="card"><h2>Links oficiais</h2>' + lk + '</section>'
      + '<p class="note s">Página de exemplo da proposta. O conteúdo real depende do sistema da USP; aqui o Júpiter explicaria em linguagem simples para que serve e qual é o próximo passo.</p>'
      + '<div><a class="btn o" href="#mapa">← Todas as páginas</a></div>';
  }

  function vBusca() {
    var t = norm(Q), r = Object.keys(IT).filter(function (id) { return norm(IT[id][0] + " " + IT[id][1]).indexOf(t) > -1; });
    return '<div><h1>Resultados para “' + esc(Q) + '”</h1></div>'
      + (r.length ? '<section class="card">' + r.map(item).join("") + '</section>' : '<p class="sub">Nada encontrado. Tente “matrícula” ou “estágio”.</p>');
  }

  /* ---------- navegação ---------- */
  function nav() {
    var r = location.hash.slice(1) || "inicio";
    [["dk", NAV], ["mb", MOB]].forEach(function (p) {
      document.getElementById(p[0]).innerHTML = p[1].map(function (n) {
        return '<a href="#' + n[0] + '"' + (n[0] === r ? ' class="on" aria-current="page"' : "") + '>' + n[1] + '</a>';
      }).join("");
    });
  }
  function render(top) {
    var r = location.hash.slice(1) || "inicio", h;
    if (Q) h = vBusca(); else if (r === "inicio") h = vInicio(); else if (r === "mapa") h = vMapa();
    else if (r === "grade") h = vGrade(); else if (r === "apoio") h = vApoio(); else if (IT[r]) h = vItem(r); else h = vInicio();
    app.innerHTML = h; nav();
    document.title = "Júpiter Web – " + (IT[r] ? IT[r][0] : "proposta de redesenho");
    if (top) window.scrollTo(0, 0);
  }

  /* ---------- eventos ---------- */
  qi.addEventListener("input", function () { Q = qi.value.trim(); render(true); });
  window.addEventListener("hashchange", function () { Q = ""; qi.value = ""; render(true); app.focus({ preventScroll: true }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); qi.focus(); }
    if (e.key === "Escape" && document.activeElement === qi) { qi.value = ""; Q = ""; qi.blur(); render(true); }
  });
  app.addEventListener("change", function (e) {
    if (e.target.matches(".check input")) { S.done[e.target.dataset.i] = e.target.checked; save(); render(false); }
  });
  app.addEventListener("click", function (e) {
    if (e.target.id === "sgb") { var b = document.getElementById("sg"); b.hidden = !b.hidden; }
  });

  /* tema */
  function setTheme(t) { document.documentElement.dataset.theme = t; try { localStorage.setItem("jwTheme", t); } catch (e) {} }
  var tm; try { tm = localStorage.getItem("jwTheme"); } catch (e) {}
  setTheme(tm || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"));
  document.getElementById("theme").addEventListener("click", function () { setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); });

  /* personalizar */
  var dlg = document.getElementById("dlg"), form = document.getElementById("perfil");
  function nome() { document.getElementById("nome").textContent = S.nome; }
  document.getElementById("me").addEventListener("click", function () {
    ["nome", "prazoNome", "prazoData", "cf", "ct"].forEach(function (k) { form.elements[k].value = S[k]; });
    dlg.showModal();
  });
  dlg.addEventListener("close", function () {
    if (dlg.returnValue !== "ok") return;
    var f = form.elements;
    S.nome = f.nome.value.trim() || DEF.nome; S.prazoNome = f.prazoNome.value.trim() || DEF.prazoNome; S.prazoData = f.prazoData.value;
    S.ct = Math.max(1, +f.ct.value || DEF.ct); S.cf = Math.min(S.ct, Math.max(0, +f.cf.value || 0));
    save(); nome(); render(false);
  });

  nome(); render(false);
})();
