// Armazenamento em memória local (Array para guardar as respostas enviadas)
let respostasRegistradas = JSON.parse(localStorage.getItem('respostasControleEducacional')) || [];

document.addEventListener('DOMContentLoaded', () => {
  updateMetricsDisplay();
});

// Navegação de Etapas (Passo a Passo)
function nextStep(currentStep) {
  // Validação simples dos campos da etapa atual
  if (currentStep === 1) {
    const melhoriaSelecionada = document.querySelector('input[name="melhoria"]:checked');
    if (!melhoriaSelecionada) {
      alert("Por favor, selecione uma das opções.");
      return;
    }
  } else if (currentStep === 2) {
    const apresentacao = document.getElementById('apresentacao').value.trim();
    if (!apresentacao) {
      alert("Por favor, preencha o campo sobre a apresentação.");
      return;
    }
  }

  // Esconde etapa atual e mostra a próxima
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${currentStep + 1}`).classList.add('active');

  // Atualiza indicadores de progresso
  updateProgressDots(currentStep + 1);
}

function prevStep(currentStep) {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${currentStep - 1}`).classList.add('active');

  updateProgressDots(currentStep - 1);
}

function updateProgressDots(stepIndex) {
  const dots = document.querySelectorAll('.step-dot');
  dots.forEach((dot, idx) => {
    if (idx < stepIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Envio do Formulário
document.getElementById('feedbackForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const melhoria = document.querySelector('input[name="melhoria"]:checked').value;
  const apresentacao = document.getElementById('apresentacao').value;
  const identificacao = document.getElementById('identificacao').value || 'Anônimo';

  // Objeto de Resposta
  const novaResposta = {
    id: Date.now(),
    identificacao,
    melhoria,
    apresentacao,
    data: new Date().toLocaleDateString('pt-BR') + " " + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
  };

  // Salva na lista
  respostasRegistradas.push(novaResposta);
  localStorage.setItem('respostasControleEducacional', JSON.stringify(respostasRegistradas));

  // Atualiza dados nas Métricas
  updateMetricsDisplay();

  // Esconde Formulário e mostra Sucesso
  document.getElementById('feedbackForm').reset();
  document.getElementById('step-3').classList.remove('active');
  document.getElementById('mensagemSucesso').classList.remove('hidden');

  // Reseta estado para novo envio futuro
  setTimeout(() => {
    document.getElementById('mensagemSucesso').classList.add('hidden');
    document.getElementById('step-1').classList.add('active');
    updateProgressDots(1);
  }, 4000);
});

/* Modal / Painel de Métricas */
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

// Função para processar e atualizar os dados exibidos no painel de registros
function updateMetricsDisplay() {
  document.getElementById('totalRespostas').innerText = respostasRegistradas.length;

  // Contagem de cada opção
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

  // Histórico detalhado
  const historicoContainer = document.getElementById('historicoRespostas');
  if (respostasRegistradas.length === 0) {
    historicoContainer.innerHTML = '<p class="no-data">Nenhuma resposta registrada até o momento.</p>';
    return;
  }

  historicoContainer.innerHTML = respostasRegistradas.slice().reverse().map(r => `
    <div class="card-resposta">
      <p><strong>Usuário:</strong> ${r.identificacao} <small>(${r.data})</small></p>
      <p><strong>Melhoria:</strong> ${r.melhoria}</p>
      <p><strong>Apresentação:</strong> "${r.apresentacao}"</p>
    </div>
  `).join('');
}