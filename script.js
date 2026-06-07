// Mapeamento de todos os inputs da tela para atualização imediata
const inputsIds = [
    'data', 'horario', 'pregador', 'dirigente', 'louvor', 'extra1',
    'dizimos', 'extra2', 'avisos', 'palavra', 'extra4', 'bencao'
];

function atualizarPreview() {
    // Atualizações simples de texto direto
    document.getElementById('out-data').innerText = document.getElementById('in-data').value;
    document.getElementById('out-horario').innerText = document.getElementById('in-horario').value;
    document.getElementById('out-pregador').innerText = document.getElementById('in-pregador').value;
    document.getElementById('out-dirigente').innerText = document.getElementById('in-dirigente').value;
    document.getElementById('out-louvor').innerText = document.getElementById('in-louvor').value;
    document.getElementById('out-dizimos').innerText = document.getElementById('in-dizimos').value;
    
    // Novas atribuições independentes e editáveis para o 4º Ato
    document.getElementById('out-palavra').innerText = document.getElementById('in-palavra').value;
    document.getElementById('out-bencao').innerText = document.getElementById('in-bencao').value;

    // Lógica para Tratar Acontecimentos Extras Opcionais (1º, 2º e 4º Atos)
    tratarCampoOpcional('in-extra1', 'out-extra1');
    tratarCampoOpcional('in-extra2', 'out-extra2');
    tratarCampoOpcional('in-extra4', 'out-extra4');

    // Lógica para a Santa Ceia
    const ceiaAtiva = document.getElementById('in-ceia').checked;
    document.getElementById('out-ceia').classList.toggle('hidden', !ceiaAtiva);

    // Renderizar a lista de avisos com o primeiro e o último fixos
    const avisosTexto = document.getElementById('in-avisos').value.split('\n');
    const listaAvisos = document.getElementById('out-avisos');
    listaAvisos.innerHTML = '';

    // Aviso Fixo de Início
    const liInicio = document.createElement('li');
    liInicio.textContent = 'Boas Vindas aos Visitantes;';
    listaAvisos.appendChild(liInicio);

    // Avisos Dinâmicos digitados
    avisosTexto.forEach(aviso => {
        if(aviso.trim() !== "") {
            const li = document.createElement('li');
            li.textContent = aviso.trim() + ';';
            listaAvisos.appendChild(li);
        }
    });

    // Aviso Fixo Final
    const liFim = document.createElement('li');
    liFim.textContent = 'Oferta Missionária;';
    listaAvisos.appendChild(liFim);
}

// Função auxiliar para esconder elementos se estiverem em branco
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

// Vincula o evento 'input' em todos os campos para atualizar em tempo real
inputsIds.forEach(id => {
    document.getElementById(`in-${id}`).addEventListener('input', atualizarPreview);
});
document.getElementById('in-ceia').addEventListener('change', atualizarPreview);

// Função para baixar a imagem individual em PNG
function baixarPNG() {
    const card = document.getElementById('card-unico');
    html2canvas(card, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `liturgia-${document.getElementById('in-data').value.replace(/\//g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Função para estruturar os 3 cards na folha de impressão horizontal
function imprimir3x() {
    const printArea = document.getElementById('print-area');
    const cardOriginal = document.getElementById('card-unico');
    
    printArea.innerHTML = ''; // Limpa a área anterior da última impressão
    
    // Clona o card atualizado 3 vezes de forma idêntica
    for (let i = 0; i < 3; i++) {
        const clone = cardOriginal.cloneNode(true);
        clone.id = `card-clone-${i}`;
        printArea.appendChild(clone);
    }
    
    // Dispara a janela de impressão do navegador
    window.print();
}

// Inicialização imediata ao abrir a aplicação
atualizarPreview();
