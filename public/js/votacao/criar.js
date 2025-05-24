document.addEventListener('DOMContentLoaded', () => {
    const btnCriar = document.getElementById('btnCriar');
  
    btnCriar.addEventListener('click', async () => {
      const pauta_id = document.getElementById('pauta_id').value;
      const data_inicio = document.getElementById('data_inicio').value;
      const data_fim = document.getElementById('data_fim').value;
      const status = document.getElementById('status').value;

      if (!pauta_id) {
        alert("Selecione uma pauta para votoção!");
        return;
      }
      if (!data_inicio) {
        alert("Selecione a data de início!");
        return;
      }
      if (!data_fim) {
          alert("Selecione a data de fim!");
          return;
      }
      if (!status) {
          alert("Selecione o status da votação!");
          return;
      }
      if (new Date(data_inicio) >= new Date(data_fim)) {
        alert("A data de início deve ser anterior à data de fim.");
        return;
      }
      if (new Date(data_fim) < new Date()) {
        alert("A data de fim deve ser maior ou igual a data atual.");
        return;
      }
      
      try {
        const resposta = await fetch('/votacao/criar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ pauta_id , data_inicio, data_fim, status })
        });
  
        const resultado = await resposta.json();
  
        if (resposta.ok) {
          alert("Votação criada com sucesso!");
          window.location.href = "/votacao/listar";
        } else {
          alert("Erro ao criar votação: " + resultado.msg);
        }
  
      } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro ao registrar voto.");
      }
    });
});
