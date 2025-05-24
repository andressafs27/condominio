document.addEventListener("DOMContentLoaded", function () {
    const btnAlterar = document.getElementById("btnAlterar");

    btnAlterar.addEventListener("click", alterar);

    function limparValidacao() {
        const campos = ["pauta_id", "data_inicio", "data_fim", "status"];
        campos.forEach(campo => {
            document.getElementById(campo).style["border-color"] = "#ced4da";
        });
    }

    function alterar() {
        limparValidacao();

        const id = document.getElementById("id").value;
        const pauta_id = document.getElementById("pauta_id").value;
        const data_inicio = document.getElementById("data_inicio").value;
        const data_fim = document.getElementById("data_fim").value;
        const status = document.getElementById("status").value;

        const listaErros = [];

        if (!pauta_id) {
            alert("Erro: pauta não encontrada!");
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

        if (!data_inicio) {
            listaErros.push("data_inicio");
        }
        if (!data_fim) {
            listaErros.push("data_fim");
        }
        if (!status) {
            listaErros.push("status");
        }

        if (listaErros.length > 0) {
            let mensagemErro = "Por favor, corrija os seguintes campos:\n";
            listaErros.forEach(campo => {
                document.getElementById(campo).style["border-color"] = "red";
                mensagemErro += `- ${campo}\n`;
            });
            alert(mensagemErro);
            return;
        }

        const obj = {
            id,
            pauta_id,
            data_inicio,
            data_fim,
            status,
        };

        fetch(`/votacao/pauta/${pauta_id}/alterar`, {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                alert(r.msg);
                window.location.href = "/votacao/listar";
            } else {
                alert(r.msg);
            }
        });
    }
});
