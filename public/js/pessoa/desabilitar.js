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
            alert("Erro: ID da pessoa não encontrado!");
            return;
        }

        const confirmacao = confirm("Tem certeza que deseja desabilitar essa pessoa?");
        if (!confirmacao) {
            return;
        }

        fetch(`/pessoa/desabilitar/`, {
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
                window.location.href = "/pessoa/listar";
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