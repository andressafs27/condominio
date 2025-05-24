document.addEventListener("DOMContentLoaded", function() {
    console.log("dom");


    document.getElementById("btnDesabilitar").addEventListener("click", desabilitar);
    console.log("Botão clicado");


    function limparValidacao() {
        document.getElementById("id").style["border-color"] = "#ced4da";
    }

    function desabilitar() {
        limparValidacao();
        let id = document.querySelector("#id").value;
        
        if (!id) { 
            alert("Erro: ID do servico não encontrado!");
            return;
        }

        const confirmacao = confirm("Tem certeza que deseja desabilitar esse serviço?");
        if (!confirmacao) {
            return;
        }

        
        fetch(`/servico/desabilitar/`, {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            if (data.ok) {
                alert(data.msg);
                window.location.href = "/servico/listar";
            } else {
                alert(data.msg);
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            alert("Ocorreu um erro ao tentar desabilitar.");
        });
    }
});