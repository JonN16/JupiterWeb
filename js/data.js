/* Dados do site. Edite aqui para mudar textos, links e grade. */
var JW = "https://uspdigital.usp.br/jupiterweb/";
var PRG = "https://prg.usp.br/";

var GROUPS = [
  ["Comece por aqui", ["efetivacao", "primeiroacesso", "cursos", "faq"]],
  ["Meu semestre", ["matricula", "grade", "calendario", "disciplina", "requerimento", "avaliacao"]],
  ["Meu curso", ["historico", "acompanhamentos", "opcao", "documentos", "cartao"]],
  ["Oportunidades", ["aex", "estagio-usp", "estagio-externo", "bolsas", "ifriends", "editais"]],
  ["Apoio e benefícios", ["auxilios", "bilhete"]]
];

/* [título, descrição, público(1=sem login), link oficial (opcional)] */
var IT = {
  "efetivacao": ["Etapa Virtual de Efetivação de Matrícula", "Confirmação da matrícula de quem acabou de ingressar."],
  "primeiroacesso": ["Meu primeiro acesso", "Como criar e usar sua senha única pela primeira vez.", 1, "http://www.prg.usp.br/?page_id=15590"],
  "cursos": ["Cursos de ingresso", "Conheça os cursos e as unidades.", 1],
  "faq": ["FAQ", "Dúvidas frequentes em linguagem simples.", 1, "http://www.prg.usp.br/wp-content/uploads/Matr%C3%ADcula-Interativa-D%C3%BAvidas-FAQ.pdf"],
  "matricula": ["Matrícula", "Inscreva-se em disciplinas e turmas."],
  "grade": ["Grade horária", "Sua semana de aulas."],
  "calendario": ["Calendário Escolar", "Prazos e datas do semestre.", 1, "https://prg.usp.br/wp-content/uploads/Calendario-Escolar-2026.pdf"],
  "disciplina": ["Disciplina", "Consulte disciplinas e turmas.", 1],
  "requerimento": ["Requerimento", "Pedidos como cursar disciplina sem vaga ou fora do horário.", 0, "http://www.prg.usp.br/?page_id=16928"],
  "avaliacao": ["Avaliação de disciplinas", "Dê sua opinião sobre o que cursou."],
  "historico": ["Histórico escolar", "Tudo o que você já cursou."],
  "acompanhamentos": ["Acompanhamentos", "Acompanhe sua vida acadêmica."],
  "opcao": ["Opção de curso", "Pedidos ligados à escolha do curso."],
  "documentos": ["Emissão de documentos", "Histórico e atestado de matrícula.", 0, "https://www.youtube.com/watch?v=mFJa2wUj7I4"],
  "cartao": ["Cartão USP", "Solicite seu cartão físico e retire na unidade.", 0, "https://youtu.be/D0rM7BjxdeE"],
  "aex": ["Atividades Extensionistas Curriculares (AEX)", "Veja as atividades e inscreva-se."],
  "estagio-usp": ["Estágio pago pela USP", "Estágios oferecidos pela universidade."],
  "estagio-externo": ["Estágio externo", "Estágios fora da USP."],
  "bolsas": ["Programa de bolsas", "Bolsas, incluindo iniciação científica.", 0, "http://www.prg.usp.br/?page_id=16934"],
  "ifriends": ["Programa USP iFriends", "Programa de apoio e integração."],
  "editais": ["Editais", "Chamadas abertas.", 1],
  "auxilios": ["Auxílios permanência/PRIP", "Auxílios para permanecer no curso. Atenção: PAPFE e auxílios se inscrevem no Portal de Serviços Computacionais, não no Júpiter."],
  "bilhete": ["Bilhete Único SPTrans", "Benefício de transporte."]
};

var STEPS = {
  primeiroacesso: ["Tenha em mãos seu número USP e o e-mail cadastrado.", "Siga o tutorial “Meu primeiro acesso” da Pró-Reitoria de Graduação para criar a senha única.", "Entre no Júpiter Web e confira seus dados antes de qualquer outra coisa."],
  matricula: ["Confira o seu período ideal (PM), calculado pelo sistema.", "Escolha as disciplinas e turmas que quer cursar.", "Se a turma lotar, faça um requerimento para tentar a vaga."],
  requerimento: ["Use quando precisar cursar uma disciplina sem vaga ou fora do seu período.", "Gere o pedido pelo Júpiter Web; ele será analisado.", "Acompanhe o resultado e os prazos no Calendário Escolar."],
  aex: ["Abra Atividades Extensionistas Curriculares.", "Veja as atividades oferecidas no momento.", "Inscreva-se na que combina com você."],
  documentos: ["Emita histórico escolar e atestado de matrícula direto no sistema.", "Os documentos saem com certificação digital, sem precisar ir à secretaria."],
  cartao: ["Faça login no Júpiter e abra “Cartão USP” no menu lateral.", "Clique em “Nova solicitação”.", "Retire o cartão físico no Serviço de Graduação da sua unidade. A Pró-Reitoria avisa por e-mail."],
  calendario: ["Consulte as datas de matrícula, retificação e recesso do semestre.", "Anote os prazos que importam para você."]
};

var APOIO = [
  ["Pró-Estudo", "Apoio ao estudo oferecido pela USP."],
  ["Monitorias", "Alunos monitores ajudam nas disciplinas."],
  ["Coursera", "Cursos online disponíveis para a comunidade USP."],
  ["Minha Biblioteca", "Livros digitais para consulta."],
  ["Esportes", "Atividades esportivas no campus."],
  ["Apoio psicológico", "Acolhimento e cuidado com a saúde mental."],
  ["Comissão de Graduação", "Orientação sobre o seu curso."]
];

var CALOURO = [
  "Faça o “Meu primeiro acesso” e entre no Júpiter",
  "Salve o Calendário Escolar do semestre",
  "Confira seu período ideal (PM) antes da matrícula",
  "Monte sua grade e anote os prazos de matrícula",
  "Peça seu Cartão USP e retire na unidade",
  "Saiba onde pedir ajuda: Serviço de Graduação, monitores e veteranos"
];

/* [código, dia (0=seg…4=sex), início, fim, matiz de cor] */
var AULAS = [
  ["7600006-2026202",0,"08:10","09:50",190],["7600006-2026202",2,"08:10","09:50",190],["7600006-2026202",3,"10:10","11:00",190],
  ["SMA0354-2026202",0,"10:10","11:50",270],["SMA0354-2026202",2,"10:10","11:50",270],
  ["7600110-2026213",1,"08:10","11:50",140],["1800121-2026208",2,"13:00","14:00",200],
  ["SSC0603-2026201",1,"14:20","16:00",330],["SSC0603-2026201",3,"14:20","16:00",330],
  ["7500017-2026201",0,"14:20","17:40",30],
  ["SMA0304-2026201",1,"16:20","18:00",215],["SMA0304-2026201",3,"08:10","09:50",215],
  ["SEL0637-2026201",2,"16:20","18:00",45],["7500012-2026201",3,"16:20","18:00",165]
];

var ICO = {
  matricula: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
  grade: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  requerimento: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 13h5M10 17h5"/>',
  documentos: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  aex: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',
  bolsas: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4"/>'
};

var NAV = [["inicio","Início"],["matricula","Matrícula"],["grade","Grade"],["requerimento","Requerimento"],["documentos","Documentos"],["mapa","Mapa do site"]];
var MOB = [["inicio","Início"],["grade","Grade"],["matricula","Matrícula"],["apoio","Apoio"],["mapa","Mapa"]];
