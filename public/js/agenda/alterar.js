document.addEventListener("DOMContentLoaded", function () {
    const btnAlterar = document.getElementById("btnAlterar");
    const dataInput = document.getElementById("data");
    const dataFinalInput = document.getElementById("data_final");

    btnAlterar.addEventListener("click", alterar);

    dataInput.addEventListener("keyup", function () {
        validarData(dataInput.value);
    });

    dataFinalInput.addEventListener("keyup", function () {
        validarData(dataFinalInput.value);
    });

    function limparValidacao() {
        const campos = ["data", "data_final", "descricao", "servico_id", "bloco_id"];
        campos.forEach(campo => {
            document.getElementById(campo).style["border-color"] = "#ced4da";
        });
    }

    function alterar() {
        limparValidacao();

        const id = document.getElementById("id").value;
        const data = document.getElementById("data").value;
        const data_final = document.getElementById("data_final").value;
        const descricao = document.getElementById("descricao").value;
        const servico_id = document.getElementById("servico_id").value;
        const bloco_id = document.getElementById("bloco_id").value;
       
        const listaErros = [];

        if (!validarData(data)) {
            listaErros.push("data");
        }

        if (!validarData(data_final)) {
            listaErros.push("data_final");
        }

        if (listaErros.length > 0) {
            listaErros.forEach(campo => {
                const campoElement = document.getElementById(campo);
                if (campoElement) campoElement.style["border-color"] = "red";
            });

            Swal.fire({
                icon: 'error',
                title: 'Campos inválidos!',
                text: 'Preencha corretamente os campos: ' + listaErros.join(", ")
            });
            return;
        }

        const obj = { id, data, data_final, descricao, servico_id, bloco_id };

        fetch("/agenda/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: r.msg
                }).then(() => {
                    window.location.href = "/agenda/listar";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao alterar',
                    text: r.msg
                });
            }
        })
        .catch(err => {
            console.error("Erro ao enviar requisição:", err);
            Swal.fire({
                icon: 'error',
                title: 'Erro inesperado',
                text: 'Tente novamente mais tarde.'
            });
        });
    }

    

    function validarData(data) {
        if (!data) return false;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;

        const [ano, mes, dia] = data.split("-").map(Number);
        const dataInformada = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        dataInformada.setHours(0, 0, 0, 0);

        return dataInformada >= hoje;
    }
});
