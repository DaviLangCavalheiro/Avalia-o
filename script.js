let respostasRegistradas = JSON.parse(localStorage.getItem('respostasControleEducacional')) || [];

document.addEventListener('DOMContentLoaded', () => {
  atualizarMetricas();
});

// Avançar etapa
function nextStep(currentStep) {
  if (currentStep === 1) {
    const melhoriaOpcao = document.querySelector('input[name="melhoriaOpcao"]:checked');
    if (!melhoriaOpcao) {
      alert("Por favor, escolha uma das opções para prosseguir.");
      return;
    }
  }

  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${currentStep + 1}`).classList.add('active');

  document.getElementById(`dot-${currentStep}`).classList.remove('active');
  document.getElementById(`dot-${currentStep + 1}`).classList.add('active');
}

// Voltar etapa
function prevStep(currentStep) {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${currentStep - 1}`).classList.add('active');

  document.getElementById(`dot-${currentStep}`).classList.remove('active');
  document.getElementById(`dot-${currentStep - 1}`).classList.add('active');
}

// Envio do formulário
document.getElementById('feedbackForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const melhoriaOpcao = document.querySelector('input[name="melhoriaOpcao"]:checked').value;
  const apresentacaoNota = document.querySelector('input[name="apresentacaoNota"]:checked').value;

  const novaResposta = {
    id: Date.now(),
    melhoriaOpcao,
    apresentacaoNota,
    data: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  respostasRegistradas.push(novaResposta);
  localStorage.setItem('respostasControleEducacional', JSON.stringify(respostasRegistradas));

  atualizarMetricas();

  // Oculta e exibe confirmação
  document.getElementById('feedbackForm').reset();
  document.getElementById('step-2').classList.remove('active');
  document.getElementById('mensagemSucesso').classList.remove('hidden');

  // Reseta para novo teste após 3 segundos
  setTimeout(() => {
    document.getElementById('mensagemSucesso').classList.add('hidden');
    document.getElementById('step-1').classList.add('active');
    document.getElementById('dot-2').classList.remove('active');
    document.getElementById('dot-1').classList.add('active');
  }, 3000);
});

/* Modal / Métricas */
const modal = document.getElementById('modalMetrics');
const btnMetrics = document.getElementById('btnMetrics');
const closeBtn = document.querySelector('.close-btn');

btnMetrics.onclick = () => modal.classList.remove('hidden');
closeBtn.onclick = () => modal.classList.add('hidden');

window.onclick = (e) => {
  if (e.target === modal) modal.classList.add('hidden');
};

function atualizarMetricas() {
  document.getElementById('totalRespostas').innerText = respostasRegistradas.length;

  const contagemMelhoria = { 'Melhorar apresentação': 0, 'Melhorar o site': 0, 'Melhorar as ideias': 0 };
  const contagemNota = { Ótima: 0, Boa: 0, Ruim: 0, Péssima: 0 };

  respostasRegistradas.forEach(r => {
    if (contagemMelhoria[r.melhoriaOpcao] !== undefined) contagemMelhoria[r.melhoriaOpcao]++;
    if (contagemNota[r.apresentacaoNota] !== undefined) contagemNota[r.apresentacaoNota]++;
  });

  // Atualiza indicadores
  document.getElementById('count-apresentacao').innerText = contagemMelhoria['Melhorar apresentação'];
  document.getElementById('count-site').innerText = contagemMelhoria['Melhorar o site'];
  document.getElementById('count-ideias').innerText = contagemMelhoria['Melhorar as ideias'];

  document.getElementById('count-otima').innerText = contagemNota.Ótima;
  document.getElementById('count-boa').innerText = contagemNota.Boa;
  document.getElementById('count-ruim').innerText = contagemNota.Ruim;
  document.getElementById('count-pessima').innerText = contagemNota.Péssima;

  // Lista simples
  const historico = document.getElementById('historicoRespostas');
  if (respostasRegistradas.length === 0) {
    historico.innerHTML = '<p class="empty">Nenhum registro ainda.</p>';
    return;
  }

  historico.innerHTML = respostasRegistradas.slice().reverse().map(r => `
    <div class="history-item">
      <strong>${r.melhoriaOpcao}</strong> • Nota: ${r.apresentacaoNota}
    </div>
  `).join('');
}