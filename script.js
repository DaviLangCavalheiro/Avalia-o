// Recupera respostas gravadas ou inicia uma lista vazia
let respostasRegistradas = JSON.parse(localStorage.getItem('respostasControleEducacional')) || [];

document.addEventListener('DOMContentLoaded', () => {
  atualizarMetricas();
});

// Avançar Etapa
function nextStep(currentStep) {
  if (currentStep === 1) {
    const melhoriaSelecionada = document.querySelector('input[name="melhoria"]:checked');
    if (!melhoriaSelecionada) {
      alert("Por favor, escolha uma opção para continuar.");
      return;
    }
  }

  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${currentStep + 1}`).classList.add('active');

  // Atualizar os indicadores numéricos do topo
  document.getElementById(`dot-${currentStep}`).classList.remove('active');
  document.getElementById(`dot-${currentStep + 1}`).classList.add('active');
}

// Voltar Etapa
function prevStep(currentStep) {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${currentStep - 1}`).classList.add('active');

  document.getElementById(`dot-${currentStep}`).classList.remove('active');
  document.getElementById(`dot-${currentStep - 1}`).classList.add('active');
}

// Submissão do Formulário
document.getElementById('feedbackForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const melhoria = document.querySelector('input[name="melhoria"]:checked').value;
  const apresentacao = document.getElementById('apresentacao').value.trim();

  // Objeto com a resposta coletada
  const novaResposta = {
    id: Date.now(),
    melhoria,
    apresentacao,
    data: new Date().toLocaleDateString('pt-BR') + " às " + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
  };

  // Salva no array e armazena localmente
  respostasRegistradas.push(novaResposta);
  localStorage.setItem('respostasControleEducacional', JSON.stringify(respostasRegistradas));

  // Atualiza a modal de métricas
  atualizarMetricas();

  // Limpa e reseta a interface
  document.getElementById('feedbackForm').reset();
  document.getElementById('step-2').classList.remove('active');
  document.getElementById('dot-2').classList.remove('active');
  
  document.getElementById('mensagemSucesso').classList.remove('hidden');

  // Volta o formulário para a Etapa 1 após 3 segundos
  setTimeout(() => {
    document.getElementById('mensagemSucesso').classList.add('hidden');
    document.getElementById('step-1').classList.add('active');
    document.getElementById('dot-1').classList.add('active');
  }, 3000);
});

/* Lógica do Modal de Métricas */
const modal = document.getElementById('modalMetrics');
const btnMetrics = document.getElementById('btnMetrics');
const closeModal = document.querySelector('.close-modal');

btnMetrics.onclick = () => {
  modal.classList.remove('hidden');
};

closeModal.onclick = () => {
  modal.classList.add('hidden');
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
};

// Atualização dos números e feedbacks na janela de métricas
function atualizarMetricas() {
  document.getElementById('totalRespostas').innerText = respostasRegistradas.length;

  const contagem = { Ótima: 0, Boa: 0, Ruim: 0, Péssima: 0 };

  respostasRegistradas.forEach(r => {
    if (contagem[r.melhoria] !== undefined) {
      contagem[r.melhoria]++;
    }
  });

  document.getElementById('listaMelhorias').innerHTML = `
    <li>Ótima: <strong>${contagem.Ótima}</strong></li>
    <li>Boa: <strong>${contagem.Boa}</strong></li>
    <li>Ruim: <strong>${contagem.Ruim}</strong></li>
    <li>Péssima: <strong>${contagem.Péssima}</strong></li>
  `;

  const historicoContainer = document.getElementById('historicoRespostas');
  
  if (respostasRegistradas.length === 0) {
    historicoContainer.innerHTML = '<p class="no-data">Nenhuma resposta registrada até o momento.</p>';
    return;
  }

  historicoContainer.innerHTML = respostasRegistradas.slice().reverse().map(r => `
    <div class="card-resposta">
      <p><strong>Avaliação:</strong> ${r.melhoria} <small style="color:#777">(${r.data})</small></p>
      <p><strong>Apresentação:</strong> "${r.apresentacao}"</p>
    </div>
  `).join('');
}