// Mapeamento dos elementos para atualização em tempo real
const inputs = ['data', 'horario', 'pregador', 'dirigente', 'louvor', 'dizimos', 'ceia', 'avisos'];

function atualizarPreview() {
    document.getElementById('out-data').innerText = document.getElementById('in-data').value;
    document.getElementById('out-horario').innerText = document.getElementById('in-horario').value;
    document.getElementById('out-pregador').innerText = document.getElementById('in-pregador').value;
    document.getElementById('out-dirigente').innerText = document.getElementById('in-dirigente').value;
    document.getElementById('out-louvor').innerText = document.getElementById('in-louvor').value;
    document.getElementById('out-dizimos').innerText = document.getElementById('in-dizimos').value;
    
    // Repete o pregador e dirigente no 4º Ato conforme o modelo padrão fornecido
    document.getElementById('out-palavra').innerText = document.getElementById('in-pregador').value;
    document.getElementById('out-bencao').innerText = document.getElementById('in-dirigente').value;

    // Trata a exibição condicional da Santa Ceia
    const ceiaAtiva = document.getElementById('in-ceia').checked;
    document.getElementById('out-ceia').classList.toggle('hidden', !ceiaAtiva);

    // Renderiza a lista de avisos (Colocando o primeiro e o último fixos)
    const avisosTexto = document.getElementById('in-avisos').value.split('\n');
    const listaAvisos = document.getElementById('out-avisos');
    listaAvisos.innerHTML = '';

    // Aviso Fixo 1
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

// Escuta as mudanças no formulário para mudar o preview na hora
inputs.forEach(id => {
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
    
    printArea.innerHTML = ''; // Limpa a área anterior
    
    // Clona o card atualizado 3 vezes dentro da div de impressão
    for (let i = 0; i < 3; i++) {
        const clone = cardOriginal.cloneNode(true);
        clone.id = `card-clone-${i}`;
        printArea.appendChild(clone);
    }
    
    // Dispara a janela de impressão do navegador
    window.print();
}

// Executa uma vez ao abrir a página para carregar os valores iniciais padrão
atualizarPreview();