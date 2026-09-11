let respostasRegistradas = JSON.parse(localStorage.getItem('respostasControleEducacional')) || [];

document.addEventListener('DOMContentLoaded', () => {
  atualizarMetricas();
});

// Avançar de etapa
function nextStep(currentStep) {
  if (currentStep === 1) {
    const melhoriaTexto = document.getElementById('melhoriaTexto').value.trim();
    if (!melhoriaTexto) {
      alert("Por favor, digite sua opinião no campo de texto para continuar.");
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

// Submeter o Formulário
document.getElementById('feedbackForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const melhoriaTexto = document.getElementById('melhoriaTexto').value.trim();
  const apresentacaoNota = document.querySelector('input[name="apresentacaoNota"]:checked').value;

  const novaResposta = {
    id: Date.now(),
    melhoriaTexto,
    apresentacaoNota,
    data: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  respostasRegistradas.push(novaResposta);
  localStorage.setItem('respostasControleEducacional', JSON.stringify(respostasRegistradas));

  atualizarMetricas();

  // Oculta o formulário e exibe tela de sucesso
  document.getElementById('feedbackForm').reset();
  document.getElementById('step-2').classList.remove('active');
  document.getElementById('mensagemSucesso').classList.remove('hidden');

  // Reinicia para uma nova avaliação após 3.5s
  setTimeout(() => {
    document.getElementById('mensagemSucesso').classList.add('hidden');
    document.getElementById('step-1').classList.add('active');
    document.getElementById('dot-2').classList.remove('active');
    document.getElementById('dot-1').classList.add('active');
  }, 3500);
});

/* Modal de Métricas */
const modal = document.getElementById('modalMetrics');
const btnMetrics = document.getElementById('btnMetrics');
const closeBtn = document.querySelector('.close-btn');

btnMetrics.onclick = () => modal.classList.remove('hidden');
closeBtn.onclick = () => modal.classList.add('hidden');

window.onclick = (e) => {
  if (e.target === modal) modal.classList.add('hidden');
};

// Atualiza o painel de estatísticas
function atualizarMetricas() {
  document.getElementById('totalRespostas').innerText = respostasRegistradas.length;

  const contagem = { Ótima: 0, Boa: 0, Ruim: 0, Péssima: 0 };

  respostasRegistradas.forEach(r => {
    if (contagem[r.apresentacaoNota] !== undefined) {
      contagem[r.apresentacaoNota]++;
    }
  });

  document.getElementById('count-otima').innerText = contagem.Ótima;
  document.getElementById('count-boa').innerText = contagem.Boa;
  document.getElementById('count-ruim').innerText = contagem.Ruim;
  document.getElementById('count-pessima').innerText = contagem.Péssima;

  const historicoContainer = document.getElementById('historicoRespostas');
  
  if (respostasRegistradas.length === 0) {
    historicoContainer.innerHTML = '<p class="empty-state">Nenhum registro até o momento.</p>';
    return;
  }

  historicoContainer.innerHTML = respostasRegistradas.slice().reverse().map(r => `
    <div class="feedback-card">
      <p><strong>Sugestão:</strong> "${r.melhoriaTexto}"</p>
      <small>Avaliou a apresentação como <strong>${r.apresentacaoNota}</strong> • ${r.data}</small>
    </div>
  `).join('');
}