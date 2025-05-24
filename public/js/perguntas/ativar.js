document.addEventListener("DOMContentLoaded", function() {


    function ativar(id) {
        const confirmacao = confirm("Tem certeza que ativar esta pergunta?");
        if (!confirmacao) {
            return;
        }

        fetch(`/perguntas/ativar/`, {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert(data.msg);
                window.location.href = "/perguntas/listar";
            } else {
                alert(data.msg);
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            alert("Ocorreu um erro ao tentar ativar.");
        });
    }
});