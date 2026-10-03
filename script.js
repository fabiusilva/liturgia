// Adicionado 'batizados' à lista de inputs e persistência
const textInputs = [
    'data', 'horario', 'pregador', 'dirigente', 'louvor', 'extra1', 
    'oracao-resp', 'dizimos', 'batizados', 'ceia-resp', 'extra2', 'avisos', 
    'extra4-inicio', 'palavra', 'extra4', 'aviso-final', 'bencao'
];
const checkInputs = ['oracao-check', 'ceia'];

// CULTOS DO DOMINGO (cada um com sua própria memória no navegador)
const CULTOS = {
    '10h': { horario: '10:00hs' },
    '18h': { horario: '18:00hs' }
};
const paramCulto = new URLSearchParams(window.location.search).get('culto');
const cultoAtual = CULTOS[paramCulto] ? paramCulto : '10h';
const chaveMemoria = (culto) => `memoria_liturgia_culto_${culto}`;
const CHAVE_ANTIGA = 'memoria_liturgia_culto'; // memória da versão com um culto só

function lerMemoria(chave) {
    try {
        const memoria = localStorage.getItem(chave);
        return memoria ? JSON.parse(memoria) : null;
    } catch (e) {
        return null;
    }
}

// Destaca a aba do culto atual
function marcarAbaAtiva() {
    Object.keys(CULTOS).forEach(culto => {
        const aba = document.getElementById(`tab-${culto}`);
        const ativa = culto === cultoAtual;
        aba.classList.toggle('bg-blue-600', ativa);
        aba.classList.toggle('text-white', ativa);
        aba.classList.toggle('border-blue-600', ativa);
        aba.classList.toggle('bg-white', !ativa);
        aba.classList.toggle('text-gray-600', !ativa);
        aba.classList.toggle('hover:bg-gray-100', !ativa);
    });
    document.title = `Gerador de Liturgia - Culto das ${cultoAtual}`;
}

// FUNÇÃO PARA SALVAR TUDO NO LOCALSTORAGE
function salvarNoNavegador() {
    const dadosCulto = {};
    
    textInputs.forEach(id => {
        dadosCulto[id] = document.getElementById(`in-${id}`).value;
    });
    checkInputs.forEach(id => {
        dadosCulto[id] = document.getElementById(`in-${id}`).checked;
    });

    try {
        localStorage.setItem(chaveMemoria(cultoAtual), JSON.stringify(dadosCulto));
    } catch (e) {
        console.warn('Não foi possível salvar no navegador:', e);
    }
}

// FUNÇÃO PARA CARREGAR OS DADOS SALVOS
function carregarDoNavegador() {
    let dadosCulto = lerMemoria(chaveMemoria(cultoAtual));

    // Primeira vez neste culto: aproveita o que já existe para não começar do zero
    if (!dadosCulto) {
        const outroCulto = cultoAtual === '10h' ? '18h' : '10h';
        dadosCulto = lerMemoria(CHAVE_ANTIGA) || lerMemoria(chaveMemoria(outroCulto)) || {};
        dadosCulto.horario = CULTOS[cultoAtual].horario;
    }

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

// Máscara da data: só números, com as barras inseridas automaticamente (dd/mm/aaaa)
function formatarData(valor) {
    const digitos = valor.replace(/\D/g, '').slice(0, 8);
    if (digitos.length > 4) return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
    if (digitos.length > 2) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    return digitos;
}

// Confere se a data existe no calendário (ex: 31/02 não existe)
function dataValida(valor) {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    if (!partes) return false;
    const dia = Number(partes[1]), mes = Number(partes[2]), ano = Number(partes[3]);
    const data = new Date(ano, mes - 1, dia);
    return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

function tratarCampoData() {
    const inData = document.getElementById('in-data');
    const formatada = formatarData(inData.value);
    if (inData.value !== formatada) inData.value = formatada;

    // Só acusa erro quando há algo digitado e a data está incompleta ou não existe
    const invalida = formatada !== '' && !dataValida(formatada);
    inData.classList.toggle('border-red-500', invalida);
    inData.classList.toggle('bg-red-50', invalida);
    inData.classList.toggle('border-gray-300', !invalida);
    inData.classList.toggle('bg-gray-50', !invalida);
    document.getElementById('aviso-data').classList.toggle('hidden', !invalida);
}

function atualizarPreview() {
    tratarCampoData();

    // Exibe/Oculta inputs dos responsáveis conforme checkboxes
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
    tratarCampoOpcional('in-batizados', 'out-batizados'); // NOVO: Convocação dos Batizados
    tratarCampoOpcional('in-extra2', 'out-extra2');
    tratarCampoOpcional('in-extra4-inicio', 'out-extra4-inicio');
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

    // Salva automaticamente no navegador
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
    html2canvas(card, {
        scale: 2,
        // Mantém o PNG sempre com 350px de largura, mesmo gerado no celular
        onclone: (doc) => {
            const cardClone = doc.getElementById('card-unico');
            cardClone.style.width = '350px';
            cardClone.style.maxWidth = 'none';
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `liturgia-${document.getElementById('in-data').value.replace(/\//g, '-')}-${cultoAtual}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Monta as 3 cópias lado a lado e reduz a fonte até tudo caber em 1 página
const FONTE_MAXIMA = 17;
const FONTE_MINIMA = 9;

function prepararImpressao() {
    const printArea = document.getElementById('print-area');
    const cardOriginal = document.getElementById('card-unico');

    printArea.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const clone = cardOriginal.cloneNode(true);
        clone.id = `card-clone-${i}`;
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        printArea.appendChild(clone);
    }

    // Mede fora da tela, no mesmo tamanho da folha (A4 deitado)
    printArea.classList.add('medindo');
    const cardMedido = printArea.firstElementChild;
    let fonte = FONTE_MAXIMA;
    printArea.style.setProperty('--fonte', `${fonte}px`);
    while (cardMedido.scrollHeight > cardMedido.clientHeight && fonte > FONTE_MINIMA) {
        fonte -= 0.5;
        printArea.style.setProperty('--fonte', `${fonte}px`);
    }
    printArea.classList.remove('medindo');
}

// Impressão 3x
function imprimir3x() {
    prepararImpressao();
    window.print();
}

// Também funciona se imprimir pelo menu do navegador (Ctrl+P)
window.addEventListener('beforeprint', prepararImpressao);

// Limpa as cópias depois de imprimir
window.addEventListener('afterprint', () => {
    document.getElementById('print-area').innerHTML = '';
});

// Inicialização
marcarAbaAtiva();
carregarDoNavegador();
atualizarPreview();
