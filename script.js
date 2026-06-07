const inputsIds = [
    'data', 'horario', 'pregador', 'dirigente', 'louvor', 'extra1',
    'dizimos', 'extra2', 'avisos', 'palavra', 'extra4', 'bencao'
];

function atualizarPreview() {
    // Atualizações dos textos básicos
    document.getElementById('out-data').innerText = document.getElementById('in-data').value;
    document.getElementById('out-horario').innerText = document.getElementById('in-horario').value;
    document.getElementById('out-pregador').innerText = document.getElementById('in-pregador').value;
    document.getElementById('out-dirigente').innerText = document.getElementById('in-dirigente').value;
    document.getElementById('out-louvor').innerText = document.getElementById('in-louvor').value;
    document.getElementById('out-dizimos').innerText = document.getElementById('in-dizimos').value;
    document.getElementById('out-palavra').innerText = document.getElementById('in-palavra').value;
    document.getElementById('out-bencao').innerText = document.getElementById('in-bencao').value;

    // Acontecimentos Opcionais
    tratarCampoOpcional('in-extra1', 'out-extra1');
    tratarCampoOpcional('in-extra2', 'out-extra2');
    tratarCampoOpcional('in-extra4', 'out-extra4');

    // Santa Ceia condicional
    const ceiaAtiva = document.getElementById('in-ceia').checked;
    document.getElementById('out-ceia').classList.toggle('hidden', !ceiaAtiva);

    // Geração da lista de avisos
    const avisosTexto = document.getElementById('in-avisos').value.split('\n');
    const listaAvisos = document.getElementById('out-avisos');
    listaAvisos.innerHTML = '';

    // Fixo Inicial
    const liInicio = document.createElement('li');
    liInicio.textContent = 'Boas Vindas aos Visitantes;';
    listaAvisos.appendChild(liInicio);

    // Avisos dinâmicos digitados
    avisosTexto.forEach(aviso => {
        if(aviso.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = aviso.trim() + ';';
            listaAvisos.appendChild(li);
        }
    });

    // Fixo Final
    const liFim = document.createElement('li');
    liFim.textContent = 'Oferta Missionária;';
    listaAvisos.appendChild(liFim);
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

// Ouvintes de eventos para inputs e checkboxes
inputsIds.forEach(id => {
    document.getElementById(`in-${id}`).addEventListener('input', atualizarPreview);
});
document.getElementById('in-ceia').addEventListener('change', atualizarPreview);

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

// Impressão 3x forçada em página única horizontal
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

// Inicializa no carregamento do app
atualizarPreview();
