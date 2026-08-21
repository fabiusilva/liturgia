// Adicionado 'extra4-inicio' na lista de inputs e persistência
const textInputs = [
    'data', 'horario', 'pregador', 'dirigente', 'louvor', 'extra1', 
    'oracao-resp', 'dizimos', 'ceia-resp', 'extra2', 'avisos', 
    'extra4-inicio', 'palavra', 'extra4', 'aviso-final', 'bencao'
];
const checkInputs = ['oracao-check', 'ceia'];

// FUNÇÃO PARA SALVAR TUDO NO LOCALSTORAGE
function salvarNoNavegador() {
    const dadosCulto = {};
    
    textInputs.forEach(id => {
        dadosCulto[id] = document.getElementById(`in-${id}`).value;
    });
    checkInputs.forEach(id => {
        dadosCulto[id] = document.getElementById(`in-${id}`).checked;
    });

    localStorage.setItem('memoria_liturgia_culto', JSON.stringify(dadosCulto));
}

// FUNÇÃO PARA CARREGAR OS DADOS SALVOS
function carregarDoNavegador() {
    const memoria = localStorage.getItem('memoria_liturgia_culto');
    if (!memoria) return;

    const dadosCulto = JSON.parse(memoria);

    textInputs.forEach(id => {
        if (dadosCulto[id] !== undefined) {
            document.getElementById(`in-${id}`).value = dadosCulto[id];
        }
    });
    checkInputs.forEach(id => {
        if (dadosCulto[id] !== undefined) {
            document.getElementById(`in-${id}`).checked = dadosCulto[id];
        }
    });
}

function atualizarPreview() {
    // Exibe/Oculta inputs dos responsáveis
    const oracaoAtiva = document.getElementById('in-oracao-check').checked;
    document.getElementById('div-in-oracao-resp').classList.toggle('hidden', !oracaoAtiva);
    
    const ceiaAtiva = document.getElementById('in-ceia').checked;
    document.getElementById('div-in-ceia-resp').classList.toggle('hidden', !ceiaAtiva);

    // Repassa os textos para o preview
    document.getElementById('out-data').innerText = document.getElementById('in-data').value;
    document.getElementById('out-horario').innerText = document.getElementById('in-horario').value;
    document.getElementById('out-pregador').innerText = document.getElementById('in-pregador').value;
    document.getElementById('out-dirigente').innerText = document.getElementById('in-dirigente').value;
    document.getElementById('out-louvor').innerText = document.getElementById('in-louvor').value;
    document.getElementById('out-dizimos').innerText = document.getElementById('in-dizimos').value;
    document.getElementById('out-palavra').innerText = document.getElementById('in-palavra').value;
    document.getElementById('out-bencao').innerText = document.getElementById('in-bencao').value;

    // Tratamento dos Acontecimentos Opcionais
    tratarCampoOpcional('in-extra1', 'out-extra1');
    tratarCampoOpcional('in-extra2', 'out-extra2');
    tratarCampoOpcional('in-extra4-inicio', 'out-extra4-inicio'); // NOVO: Apresentação antes da Palavra
    tratarCampoOpcional('in-extra4', 'out-extra4');
    tratarCampoOpcional('in-aviso-final', 'out-aviso-final');

    // Momento de Oração
    const elOracaoOut = document.getElementById('out-oracao');
    if (oracaoAtiva) {
        document.getElementById('out-oracao-resp').innerText = document.getElementById('in-oracao-resp').value;
        elOracaoOut.classList.remove('hidden');
    } else {
        elOracaoOut.classList.add('hidden');
    }

    // Santa Ceia
    const elCeiaOut = document.getElementById('out-ceia');
    if (ceiaAtiva) {
        document.getElementById('out-ceia-resp').innerText = document.getElementById('in-ceia-resp').value;
        elCeiaOut.classList.remove('hidden');
    } else {
        elCeiaOut.classList.add('hidden');
    }

    // Avisos
    const avisosTexto = document.getElementById('in-avisos').value.split('\n');
    const listaAvisos = document.getElementById('out-avisos');
    listaAvisos.innerHTML = '';

    const liInicio = document.createElement('li');
    liInicio.textContent = 'Boas Vindas aos Visitantes;';
    listaAvisos.appendChild(liInicio);

    avisosTexto.forEach(aviso => {
        if(aviso.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = aviso.trim() + ';';
            listaAvisos.appendChild(li);
        }
    });

    const liFim = document.createElement('li');
    liFim.textContent = 'Oferta Missionária;';
    listaAvisos.appendChild(liFim);

    // Salva automaticamente
    salvarNoNavegador();
}

function tratarCampoOpcional(inputId, outputId) {
    const valor = document.getElementById(inputId).value.trim();
    const elementoOut = document.getElementById(outputId);
    if(valor !== "") {
        elementoOut.innerText = valor;
        elementoOut.classList.remove('hidden');
    } else {
        elementoOut.classList.add('hidden');
    }
}

// Escutadores de eventos
textInputs.forEach(id => {
    document.getElementById(`in-${id}`).addEventListener('input', atualizarPreview);
});
checkInputs.forEach(id => {
    document.getElementById(`in-${id}`).addEventListener('change', atualizarPreview);
});

// Baixar Imagem PNG
function baixarPNG() {
    const card = document.getElementById('card-unico');
    html2canvas(card, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `liturgia-${document.getElementById('in-data').value.replace(/\//g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Impressão 3x
function imprimir3x() {
    const printArea = document.getElementById('print-area');
    const cardOriginal = document.getElementById('card-unico');
    
    printArea.innerHTML = ''; 
    
    for (let i = 0; i < 3; i++) {
        const clone = cardOriginal.cloneNode(true);
        clone.id = `card-clone-${i}`;
        printArea.appendChild(clone);
    }
    
    window.print();
}

// Inicialização
carregarDoNavegador();
atualizarPreview();
