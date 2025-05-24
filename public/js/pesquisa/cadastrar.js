document.addEventListener("DOMContentLoaded", function () {
    const btnCadastrar = document.getElementById("btnCadastrar");

    btnCadastrar.addEventListener("click", cadastrar);
    // carregarPerguntas();

    function limparValidacao() {
        ["titulo", "data","status"].forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.style["border-color"] = "#ced4da";
        });
    }

    function cadastrar() {
        limparValidacao();

        const titulo = document.getElementById("titulo").value;
        const data = document.getElementById("data").value;
        const data_fim = document.getElementById("data_fim").value;
        const status = document.getElementById("status").value;

        const perguntasSelecionadas = [...document.querySelectorAll("input[name='pergunta']:checked")]
            .map(p => parseInt(p.value));
       
        const listaErros = [];

        if (!/^[A-Za-zÀ-ÿ\s]{3,50}$/.test(titulo)) {
            listaErros.push("titulo");
        }

        if (!validarData(data)) listaErros.push("data");
        if (!validarData(data_fim)) listaErros.push("data_fim");

        if(dataMaior(data, data_fim)) listaErros.push("data_fim");

        if (status === "") {
            listaErros.push("status");
        }

        if (perguntasSelecionadas.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecione perguntas',
                text: 'É necessário selecionar pelo menos uma pergunta para a pesquisa.'
            });
            return;
        }

        if (listaErros.length === 0) {
            const obj = { titulo, data, data_fim, status, perguntas: perguntasSelecionadas.map(id => ({id}))};

            fetch("/pesquisa/cadastrar", {
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
                        window.location.href = "/pesquisa/listar";
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

    function dataMaior(data, data_fim) {
        if (!data) return false;
        if (!data_fim) return false;


        const [ano, mes, dia] = data.split("-").map(Number);
        const dataInformada = new Date(ano, mes - 1, dia);

        const [ano_fim, mes_fim, dia_fim] = data_fim.split("-").map(Number);
        const dataFimInformada = new Date(ano_fim, mes_fim - 1, dia_fim);

        return dataInformada >= dataFimInformada;
    }
});
