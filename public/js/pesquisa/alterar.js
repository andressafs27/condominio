document.addEventListener("DOMContentLoaded", function () {
    const btnAlterar = document.getElementById("btnAlterar");
    btnAlterar.addEventListener("click", alterar);

    document.body.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("remover-pergunta")) {
            e.target.closest(".form-group").remove();
        }
    });

    const btnAdicionarPergunta = document.getElementById("btnAdicionarPergunta");
    btnAdicionarPergunta.addEventListener("click", adicionarPergunta);

    // Função para limpar a validação visual
    function limparValidacao() {
        const campos = ["titulo", "data", "status"];
        campos.forEach(campo => {
            document.getElementById(campo).style["border-color"] = "#ced4da";
        });
    }

    // Função para alterar a pesquisa
    function alterar() {
        limparValidacao();

        const id = document.getElementById("id").value;
        const titulo = document.getElementById("titulo").value;
        const data = document.getElementById("data").value;
        const data_fim = document.getElementById("data_fim").value;
        const status = document.getElementById("status").value;

        const perguntasSelecionadas = [...document.querySelectorAll("input[name='pergunta']:checked")]
            .map(p => parseInt(p.value));

        const listaErros = [];

        // Validação do título
        if (!/^[A-Za-zÀ-ÿ0-9\s]{3,100}$/.test(titulo)) {
            listaErros.push("titulo");
        }

        // Validação da data
        if (!validarData(data)) {
            listaErros.push("data");
        }
                // Validação da data
        if (!validarData(data_fim)) {
            listaErros.push("data_fim");
        }

        if(dataMaior(data, data_fim)) listaErros.push("data_fim");

        // Validação do status
        if (status === "") {
            listaErros.push("status");
        }

        // Validação de perguntas selecionadas
        if (perguntasSelecionadas.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecione perguntas',
                text: 'É necessário selecionar pelo menos uma pergunta para a pesquisa.'
            });
            return;
        }

        // Se houver campos com erros, mostrar os erros e não enviar a requisição
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

        const obj = { id, titulo, data, data_fim, status, perguntas: perguntasSelecionadas };

        fetch("/pesquisa/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
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

    // Função para adicionar uma nova pergunta à pesquisa
    function adicionarPergunta() {
        const selectPergunta = document.getElementById("selectPergunta");
        const perguntaId = selectPergunta.value;
        const perguntaTexto = selectPergunta.options[selectPergunta.selectedIndex].text;

        if (!perguntaId) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecione uma pergunta',
                text: 'Você precisa selecionar uma pergunta para adicionar.'
            });
            return;
        }

        // Verifica se a pergunta já foi adicionada
        if (document.querySelector(`[data-id='${perguntaId}']`)) {
            Swal.fire({
                icon: 'info',
                title: 'Pergunta já adicionada',
                text: 'Esta pergunta já foi adicionada à pesquisa.'
            });
            return;
        }

        const perguntasContainer = document.querySelector("#container-perguntas");
        // const perguntasContainer = document.querySelector(".form-group .d-flex");
        const perguntaItem = document.createElement("div");
        perguntaItem.classList.add("form-group", "d-flex", "align-items-center");
        perguntaItem.innerHTML = `
            <input type="text" class="form-control mr-2" value="${perguntaTexto}" readonly />
            <button type="button" class="btn btn-danger btn-sm remover-pergunta" data-id="${perguntaId}">Remover</button>
        `;
        perguntasContainer.appendChild(perguntaItem);

        // Adicionar evento para remover a pergunta
        const btnRemover = perguntaItem.querySelector(".remover-pergunta");
        btnRemover.addEventListener("click", function () {
            perguntaItem.remove();
        });
    }

    // Função para validar a data
    function validarData(data) {
        if (!data) return false;

        // Verificação do formato YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;

        const [ano, mes, dia] = data.split("-").map(Number);
        const dataInformada = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        dataInformada.setHours(0, 0, 0, 0);

        // Verifica se a data informada é maior ou igual à data de hoje
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
