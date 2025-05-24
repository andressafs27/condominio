document.addEventListener("DOMContentLoaded", function () {
    const btnCadastrar = document.getElementById("btnCadastrar");

    btnCadastrar.addEventListener("click", cadastrar);

    function limparValidacao() {
        ["data", "data_final", "descricao", "servico_id", "bloco_id"].forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.style["border-color"] = "#ced4da";
        });
    }

    function cadastrar() {
        limparValidacao();

        const data = document.getElementById("data").value;
        const data_final = document.getElementById("data_final").value;
        const descricao = document.getElementById("descricao").value;
        const servico_id = document.getElementById("servico_id").value;
        const bloco_id = document.getElementById("bloco_id").value;


        const listaErros = [];

        if (!validarData(data)) listaErros.push("data");
        if (!validarData(data_final)) listaErros.push("data_final");
        if (!validarDataMaior(data, data_final)) listaErros.push("data");

        if (listaErros.length === 0) {
            const obj = 
            { 
                data: data, 
                data_final: data_final,
                descricao: descricao,
                servico_id: servico_id,
                bloco_id: bloco_id
            };

            fetch("/agenda/cadastrar", {
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
                        title: 'Erro ao cadastrar',
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
        } else {
            listaErros.forEach(id => {
                const campo = document.getElementById(id);
                if (campo) campo.style["border-color"] = "red";
            });

            Swal.fire({
                icon: 'error',
                title: 'Campos inválidos!',
                text: 'Preencha corretamente os campos: ' + listaErros.join(", ")
            });
        }
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

    function validarDataMaior(data, data_final) {
        if (!data || !data_final) return false;
        if (!data) return false;

        const [ano, mes, dia] = data.split("-").map(Number);
        const [ano_final, mes_final, dia_final] = data_final.split("-").map(Number);
        const dataInformada = new Date(ano, mes - 1, dia);
        const dataFinalInformada = new Date(ano_final, mes_final - 1, dia_final);

        return dataFinalInformada >= dataInformada;
    }

});
