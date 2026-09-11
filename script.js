document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const mensagemSucesso = document.getElementById('mensagemSucesso');

  form.addEventListener('submit', (event) => {
    // Impede o envio padrão do formulário (recarregar a página)
    event.preventDefault();

    // Coleta dos dados preenchidos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const perfil = document.getElementById('perfil').value;
    const nota = document.querySelector('input[name="rating"]:checked').value;
    const opiniao = document.getElementById('opiniao').value;
    const melhorias = document.getElementById('melhorias').value;

    // Objeto com as informações coletadas
    const avaliacaoData = {
      nome,
      email,
      perfil,
      nota,
      opiniao,
      melhorias,
      dataEnvio: new Date().toLocaleString('pt-BR')
    };

    // Exibe no console para verificação/integração com backend futuro
    console.log("Avaliação Recebida:", avaliacaoData);

    // Esconde o formulário e exibe a mensagem de sucesso
    form.reset();
    mensagemSucesso.classList.remove('hidden');

    // (Opcional) Oculta a mensagem de sucesso após 5 segundos
    setTimeout(() => {
      mensagemSucesso.classList.add('hidden');
    }, 5000);
  });
});