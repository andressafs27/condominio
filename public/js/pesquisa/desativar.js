document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnDesativar").addEventListener("click", desativar);

    function limparValidacao() {
        document.getElementById("id").style["border-color"] = "#ced4da";
    }

    function desativar() {
        limparValidacao();
        let id = document.querySelector("#id").value;
        
        if (!id) { 
            alert("Erro: ID da pesquisa não encontrada!");
            return;
        }

        const confirmacao = confirm("Tem certeza que deseja desativar esta pesquisa?");
        if (!confirmacao) {
            return;
        }

        fetch(`/pesquisa/desativar/`, {
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
                window.location.href = "/pesquisa/listar";
            } else {
                alert(data.msg);
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            alert("Ocorreu um erro ao tentar desativar.");
        });
    }
});