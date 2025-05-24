window.onload = function() {
    const reclamacaoFinalizada = document.getElementById("finalizada");
    
    if (reclamacaoFinalizada) {
      Swal.fire({
        title: 'Reclamação concluída!',
        text: 'Obrigado por fazer sua reclamação.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = "/reclamacao/listagem-morador"; 
      });
    }
  };