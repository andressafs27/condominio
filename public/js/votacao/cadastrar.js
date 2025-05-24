document.addEventListener('DOMContentLoaded', () => {
  const btnVotar = document.getElementById('btnVotar');
  const radios = document.querySelectorAll('input[name="voto"]');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      btnVotar.disabled = false;  
      btnVotar.classList.remove('btn-danger');
      btnVotar.classList.add('btn-success');
    });
  });

  btnVotar.addEventListener('click', async () => {
    const pessoaId = document.getElementById('pessoaId').value;
    const pautaId = document.getElementById('pautaId').value;
    const votoSelecionado = document.querySelector('input[name="voto"]:checked');

    if (!votoSelecionado) {
      alert("Selecione uma opção de voto!");
      return;
    }

    const voto = votoSelecionado.value;

    try {
      const resposta = await fetch('/votacao/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pessoaId, pautaId, voto })
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        alert("Voto registrado com sucesso!");
        window.location.href = "/votacao/listar";
      } else {
        // Melhor exibição do erro com a mensagem do servidor
        alert(`Erro ao registrar voto: ${resultado.msg || 'Erro desconhecido'}`);
      }

    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert("Erro ao registrar voto. Tente novamente mais tarde.");
    }
  });
});
