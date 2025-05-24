document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnExcluir").addEventListener("click", excluir);

    function limparValidacao() {
        document.getElementById("id").style["border-color"] = "#ced4da";
    }

    function excluir() {
        limparValidacao();
        let id = document.querySelector("#id").value;
        
        if (!id) { 
            alert("Erro: ID da agenda não encontrado!");
            return;
        }

        const confirmacao = confirm("Tem certeza que deseja excluir esta agenda?");
        if (!confirmacao) {
            return;
        }

        fetch(`/agenda/excluir/`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert(data.msg);
                window.location.href = "/agenda/listar";
            } else {
                alert(data.msg);
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            alert("Ocorreu um erro ao tentar excluir.");
        });
    }
});