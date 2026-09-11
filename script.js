let respostasRegistradas = JSON.parse(localStorage.getItem('respostasControleEducacional')) || [];

document.addEventListener('DOMContentLoaded', () => {
  atualizarMetricas();
});

// Envio do formulário
document.getElementById('feedbackForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const apresentacaoNota = document.querySelector('input[name="apresentacaoNota"]:checked').value;

  const novaResposta = {
    id: Date.now(),
    apresentacaoNota,
    data: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  respostasRegistradas.push(novaResposta);
  localStorage.setItem('respostasControleEducacional', JSON.stringify(respostasRegistradas));

  atualizarMetricas();

  // Exibe mensagem de confirmação
  document.getElementById('feedbackForm').reset();
  document.querySelector('.step').classList.add('hidden');
  document.getElementById('mensagemSucesso').classList.remove('hidden');

  // Restaura para um novo envio após 3 segundos
  setTimeout(() => {
    document.getElementById('mensagemSucesso').classList.add('hidden');
    document.querySelector('.step').classList.remove('hidden');
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

  const contagemNota = { Ótima: 0, Ruim: 0 };

  respostasRegistradas.forEach(r => {
    if (contagemNota[r.apresentacaoNota] !== undefined) contagemNota[r.apresentacaoNota]++;
  });

  document.getElementById('count-otima').innerText = contagemNota.Ótima;
  document.getElementById('count-ruim').innerText = contagemNota.Ruim;

  const historico = document.getElementById('historicoRespostas');
  if (respostasRegistradas.length === 0) {
    historico.innerHTML = '<p class="empty">Nenhum registro ainda.</p>';
    return;
  }

  historico.innerHTML = respostasRegistradas.slice().reverse().map(r => `
    <div class="history-item">
      Nota: <strong>${r.apresentacaoNota}</strong> • <small>${r.data}</small>
    </div>
  `).join('');
}