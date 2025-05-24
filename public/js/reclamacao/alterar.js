document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnAlterar").addEventListener("click", alterar);

    function alterar() {
        limparValidacao();

        let id = document.querySelector("#id").value;
        let status = document.querySelector("#status").value;

        if (!id) {
            alert("Erro: ID da reclamação não encontrado!");
            return;
        }

        let obj = {
            id,
            status,
        };

        fetch("/reclamacao/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                window.location.href = "/reclamacao/listar";
            } else {
                alert(r.msg || "Erro ao alterar o status.");
            }
        })
        .catch(err => {
            console.error("Erro na requisição:", err);
            alert("Erro inesperado ao tentar alterar o status.");
        });
    }

    function limparValidacao() {
        const campos = ["status"];
        campos.forEach(id => {
            let campo = document.getElementById(id);
            if (campo) {
                campo.style["border-color"] = "";
            }
        });
    }
});
