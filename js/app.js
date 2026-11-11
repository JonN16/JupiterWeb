(function () {
  var app = document.getElementById("app"), qi = document.getElementById("q"), Q = "";
  var DEF = { nome: "João", prazoNome: "Matrícula", prazoData: "", cf: 0, ct: 240, done: {} };
  var DEMO = { selectedClasses: [], enrollmentProtocol: "", request: null };
  var DEMO_CLASSES = [
    { id: "sma0354", code: "SMA0354", name: "Cálculo I", schedule: "Seg e qua · 10:10–11:50", vacancies: 12 },
    { id: "ssc0603", code: "SSC0603", name: "Introdução à Ciência da Computação", schedule: "Ter e qui · 14:20–16:00", vacancies: 8 },
    { id: "sel0637", code: "SEL0637", name: "Circuitos Elétricos", schedule: "Qua · 16:20–18:00", vacancies: 5 }
  ];

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
  function demoProtocol(prefix) { return prefix + "-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.floor(1000 + Math.random() * 9000); }
  function demoNotice() {
    return '<p class="note s demo-notice">Demonstração interativa: os dados são fictícios e ficam apenas nesta página. Nada é consultado ou enviado ao sistema da USP.</p>';
  }
  function demoDocumentText(kind) {
    if (kind === "historico") {
      return "JÚPITER WEB — HISTÓRICO ESCOLAR (DEMONSTRAÇÃO)\n\nNome: " + S.nome
        + "\nCurso: Engenharia de Computação (dados fictícios)\nNúmero USP: 00000000 (exemplo)\n\n"
        + "2026 · 1º semestre\nSMA0354 — Cálculo I — Aprovado (exemplo)\nSSC0603 — Introdução à Ciência da Computação — Aprovado (exemplo)\n\n"
        + "Este arquivo é apenas uma simulação. Não tem validade acadêmica e não foi emitido pela USP.\n";
    }
    return "JÚPITER WEB — ATESTADO DE MATRÍCULA (DEMONSTRAÇÃO)\n\nNome: " + S.nome
      + "\nCurso: Engenharia de Computação (dados fictícios)\nSituação: regularmente matriculado (exemplo)\nAno: 2026\n\n"
      + "Este arquivo é apenas uma simulação. Não tem validade acadêmica e não foi emitido pela USP.\n";
  }
  function demoCalendarFile() {
    return "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//JupiterWeb//Demonstracao//PT\r\nCALSCALE:GREGORIAN\r\n"
      + "BEGIN:VEVENT\r\nUID:matricula-demo@jupiterweb.local\r\nDTSTAMP:20261111T120000Z\r\nDTSTART;VALUE=DATE:20261201\r\nDTEND;VALUE=DATE:20261202\r\nSUMMARY:Período de matrícula (exemplo)\r\nDESCRIPTION:Evento fictício para demonstração; confira as datas oficiais da USP.\r\nEND:VEVENT\r\n"
      + "BEGIN:VEVENT\r\nUID:retificacao-demo@jupiterweb.local\r\nDTSTAMP:20261111T120000Z\r\nDTSTART;VALUE=DATE:20261208\r\nDTEND;VALUE=DATE:20261209\r\nSUMMARY:Retificação de matrícula (exemplo)\r\nDESCRIPTION:Evento fictício para demonstração; confira as datas oficiais da USP.\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n";
  }
  function downloadDemoFile(name, content, type) {
    var status = document.getElementById("download-status");
    try {
      var file = new Blob([content], { type: type }), url = URL.createObjectURL(file), link = document.createElement("a");
      link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      if (status) status.textContent = "Arquivo de demonstração gerado e baixado: " + name;
    } catch (e) {
      if (status) status.textContent = "Não foi possível gerar o arquivo neste navegador. Tente novamente ou use outro navegador.";
    }
  }

  function vDocumentos() {
    return '<div><div class="crumb"><a href="#inicio">Início</a> › Meu curso</div><h1>Documentos</h1><p class="sub">Veja uma prévia e gere arquivos de exemplo diretamente no navegador.</p></div>'
      + demoNotice()
      + '<section class="card"><h2>Seus documentos</h2><p class="sub">Os arquivos são textos de demonstração, não documentos oficiais.</p>'
      + '<div class="demo-doc"><div><b>Histórico escolar</b><span>Disciplinas e situação acadêmica · exemplo</span></div><button class="btn o" type="button" data-download="historico">Baixar exemplo .txt</button></div>'
      + '<div class="demo-doc"><div><b>Atestado de matrícula</b><span>Vínculo acadêmico · exemplo</span></div><button class="btn o" type="button" data-download="atestado">Baixar exemplo .txt</button></div>'
      + '<p id="download-status" class="sub demo-status" role="status" aria-live="polite"></p></section>'
      + '<section class="card"><h2>Prévia do histórico</h2><pre class="demo-preview">' + esc(demoDocumentText("historico")) + '</pre></section>'
      + '<section class="card"><h2>Precisa de um documento oficial?</h2><p class="sub">A emissão real exige acesso ao sistema oficial da USP.</p><div class="links"><a href="' + JW + '" target="_blank" rel="noopener">Acessar o Júpiter Web oficial ↗</a></div></section>';
  }

  function vMatricula(searchOnly) {
    var cards = DEMO_CLASSES.map(function (c) {
      var selected = DEMO.selectedClasses.indexOf(c.id) > -1;
      return '<article class="demo-class"><div><span class="tag">' + c.code + '</span><h3>' + c.name + '</h3><p class="sub">' + c.schedule + '</p><p class="sub">' + c.vacancies + ' vagas · número ilustrativo</p></div>'
        + '<button class="btn ' + (selected ? 'o' : '') + '" type="button" data-toggle-class="' + c.id + '" aria-pressed="' + selected + '">' + (selected ? 'Remover' : 'Adicionar') + '</button></article>';
    }).join("");
    var confirmation = DEMO.enrollmentProtocol
      ? '<div class="note s demo-result" role="status"><b>Simulação concluída.</b><br>Protocolo demonstrativo: ' + esc(DEMO.enrollmentProtocol) + '. Nenhuma matrícula foi enviada à USP.</div>'
      : "";
    return '<div><div class="crumb"><a href="#inicio">Início</a> › Meu semestre</div><h1>' + (searchOnly ? "Buscar turmas" : "Simular matrícula") + '</h1><p class="sub">Escolha algumas turmas e confirme para ver como seria o fluxo.</p></div>'
      + demoNotice()
      + '<section class="card"><h2>Turmas disponíveis (exemplo)</h2><p class="sub">Selecione ou remova disciplinas. Vagas e horários são fictícios.</p>' + cards
      + '<div class="demo-actions"><span class="sub">' + DEMO.selectedClasses.length + ' turma(s) selecionada(s)</span><button class="btn" type="button" id="confirm-enrollment"' + (DEMO.selectedClasses.length ? "" : " disabled") + '>Confirmar simulação</button></div>'
      + confirmation + '</section>'
      + '<p class="sub">Para efetuar uma matrícula real, consulte os períodos e regras no <a class="inline-link" href="' + JW + '" target="_blank" rel="noopener">Júpiter Web oficial ↗</a>.</p>';
  }

  function vRequerimento() {
    var result = DEMO.request
      ? '<div class="note s demo-result" role="status"><b>Pedido de demonstração registrado nesta página.</b><br>Protocolo: ' + esc(DEMO.request.protocol) + '<br>Tipo: ' + esc(DEMO.request.type) + '<br>Motivo: ' + esc(DEMO.request.reason) + '<br><b>Nada foi enviado à USP.</b></div>'
      : "";
    return '<div><div class="crumb"><a href="#inicio">Início</a> › Meu semestre</div><h1>Simular requerimento</h1><p class="sub">Preencha um pedido de exemplo e veja a confirmação, sem enviar dados para lugar algum.</p></div>'
      + demoNotice()
      + '<section class="card"><form id="demo-request"><label class="demo-label" for="request-type">Tipo de pedido</label><select id="request-type" name="type" required><option value="">Selecione</option><option>Solicitação de vaga em disciplina</option><option>Conflito de horário</option><option>Outro pedido acadêmico</option></select>'
      + '<label class="demo-label" for="request-reason">Explique o motivo</label><textarea id="request-reason" name="reason" maxlength="400" required placeholder="Exemplo: preciso cursar esta disciplina neste semestre."></textarea>'
      + '<div class="demo-actions"><button class="btn" type="submit">Registrar simulação</button></div></form>' + result + '</section>'
      + '<p class="sub">Um requerimento real deve ser feito pelo <a class="inline-link" href="' + JW + '" target="_blank" rel="noopener">Júpiter Web oficial ↗</a>.</p>';
  }

  function vCalendario() {
    return '<div><div class="crumb"><a href="#inicio">Início</a> › Meu semestre</div><h1>Calendário escolar</h1><p class="sub">Confira como seria baixar eventos para seu calendário.</p></div>'
      + demoNotice()
      + '<section class="card"><h2>Agenda de exemplo</h2><div class="demo-doc"><div><b>Período de matrícula</b><span>Evento ilustrativo · data fictícia</span></div><span class="tag">Exemplo</span></div>'
      + '<div class="demo-doc"><div><b>Retificação de matrícula</b><span>Evento ilustrativo · data fictícia</span></div><span class="tag">Exemplo</span></div>'
      + '<button class="btn" type="button" data-download="agenda">Baixar agenda de exemplo (.ics)</button>'
      + '<p id="download-status" class="sub demo-status" role="status" aria-live="polite"></p></section>'
      + '<section class="card"><h2>Datas oficiais</h2><p class="sub">Consulte o calendário atualizado no site da Pró-Reitoria de Graduação.</p><div class="links"><a href="https://prg.usp.br/" target="_blank" rel="noopener">Abrir a Pró-Reitoria de Graduação ↗</a></div></section>';
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
      + '<section class="card demo-launch"><div><h2>Experimente as simulações</h2><p class="sub">Teste ações comuns sem login: escolha disciplinas, registre um requerimento ou gere arquivos fictícios.</p></div><div class="row"><a class="btn" href="#matricula">Simular matrícula</a><a class="btn o" href="#requerimento">Criar requerimento</a><a class="btn o" href="#documentos">Baixar documentos</a></div></section>'
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
    else if (r === "grade") h = vGrade(); else if (r === "apoio") h = vApoio();
    else if (r === "matricula") h = vMatricula(false); else if (r === "disciplina") h = vMatricula(true);
    else if (r === "requerimento") h = vRequerimento(); else if (r === "documentos" || r === "historico") h = vDocumentos();
    else if (r === "calendario") h = vCalendario(); else if (IT[r]) h = vItem(r); else h = vInicio();
    app.innerHTML = h; nav();
    document.title = "Júpiter Web – " + (r === "matricula" ? "Simular matrícula" : r === "disciplina" ? "Buscar turmas" : r === "requerimento" ? "Simular requerimento" : r === "documentos" || r === "historico" ? "Documentos" : r === "calendario" ? "Calendário escolar" : IT[r] ? IT[r][0] : "proposta de redesenho");
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
    var fileButton = e.target.closest("[data-download]");
    if (fileButton) {
      var fileKind = fileButton.dataset.download;
      if (fileKind === "agenda") downloadDemoFile("agenda-exemplo.ics", demoCalendarFile(), "text/calendar;charset=utf-8");
      else downloadDemoFile(fileKind + "-demonstracao.txt", demoDocumentText(fileKind), "text/plain;charset=utf-8");
    }
    var classButton = e.target.closest("[data-toggle-class]");
    if (classButton) {
      var classId = classButton.dataset.toggleClass, index = DEMO.selectedClasses.indexOf(classId);
      if (index > -1) DEMO.selectedClasses.splice(index, 1); else DEMO.selectedClasses.push(classId);
      DEMO.enrollmentProtocol = "";
      render(false);
    }
    if (e.target.id === "confirm-enrollment" && DEMO.selectedClasses.length) {
      DEMO.enrollmentProtocol = demoProtocol("DEMO-MAT");
      render(false);
    }
  });
  app.addEventListener("submit", function (e) {
    if (e.target.id !== "demo-request") return;
    e.preventDefault();
    var fields = e.target.elements;
    DEMO.request = { protocol: demoProtocol("DEMO-REQ"), type: fields.namedItem("type").value, reason: fields.namedItem("reason").value.trim() };
    render(false);
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
