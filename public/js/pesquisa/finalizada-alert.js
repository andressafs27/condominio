window.onload = function() {
    const pesquisaFinalizada = document.getElementById("finalizada");
    
    if (pesquisaFinalizada) {
      Swal.fire({
        title: 'Pesquisa concluída!',
        text: 'Obrigado por responder à pesquisa.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = "/pesquisa/listagem-morador"; // Redireciona após clicar em OK
      });
    }
  };
  