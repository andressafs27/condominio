window.onload = function() {
    const sugestaoFinalizada = document.getElementById("finalizada");
    
    if (sugestaoFinalizada) {
      Swal.fire({
        title: 'Sugestão concluída!',
        text: 'Obrigado por fazer sua sugestão.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = "/sugestao/listagem-morador"; 
      });
    }
  };