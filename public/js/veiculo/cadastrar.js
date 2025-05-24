document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);
    document.getElementById("btnBuscarPessoa").addEventListener("click", buscarPessoa);

    let cpfInput = document.getElementById("cpf");
    let placaInput = document.getElementById("placa");
    let modeloInput = document.getElementById("modelo");
    let corInput = document.getElementById("cor");
    let marcaInput = document.getElementById("marca");

    let pessoaId = null;

    if (!cpfInput) {
        return;
    }

    cpfInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, '');

        if (cpfInput.value.length > 11) {
            cpfInput.value = cpf.value.substring(0, 11);
        }

        if (/^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let valorFormatado = "";
        for (let i = 0; i < cpfInput.value.length; i++) {
            if (i === 3 || i === 6) {
            valorFormatado += ".";
            } else if (i === 9) {
            valorFormatado += "-";
            }
            valorFormatado += cpfInput.value[i];
        }
        cpfInput.value = valorFormatado;
 
    });

  

    placaInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0,7);
    });

    function limparValidacao() {
        [cpfInput, placaInput, modeloInput, corInput, marcaInput].forEach(input => {
            input.style.borderColor = "#ced4da";
            let erroElement = document.getElementById(`erro-${input.id}`);
            if (erroElement) {
                erroElement.style.display = "none";
            }
        });
    }

    function buscarPessoa() {
        limparValidacao();
        let cpf = cpfInput.value.replace(/[^\d]/g, '').trim(); 

        if (cpf === "" || cpf.length !== 11) {
            cpfInput.style.borderColor = "red";

            exibirErro(cpfInput, "CPF inválido. Digite um CPF válido.");

            return;
        }

        fetch(`/pessoa/buscarPorCpf/${cpf}`)
            .then(response => response.json())
            .then(data => {
                const erroCpf = document.getElementById("erro-cpf");

                if (!data.ok) {
                    pessoaId = null;
                    document.querySelectorAll(".veiculo").forEach(input => input.disabled = true);
                    document.getElementById("btnCadastrar").disabled = true;
                    document.getElementById("nomePessoa").value = "";
                    cpfInput.style.borderColor = "red";

                    exibirErro(cpfInput, "CPF não encontrado.");

                    return;
                }

                pessoaId = data.id;
                document.getElementById("pessoa_id").value = pessoaId;
                document.getElementById("nomePessoa").value = data.nome;
                document.querySelectorAll(".veiculo").forEach(input => input.disabled = false);
                document.getElementById("btnCadastrar").disabled = false;

                 // Oculta o erro caso exista
                if (erroCpf) erroCpf.style.display = "none";
            })
            .catch(error => {
                console.error("Erro:", error);
            });
    }

    function cadastrar() {
        limparValidacao();

        let placa = placaInput.value.trim();
        let modelo = modeloInput.value.trim();
        let cor = corInput.value.trim();
        let marca = marcaInput.value.trim();
        let listaErros = [];

        if (!pessoaId) {
            listaErros.push({ campo: cpfInput, msg: "Selecione uma pessoa válida (CPF)." });
        }
        if (!validarPlaca(placa)) {
            listaErros.push({ campo: placaInput, msg: "Placa inválida. Formato esperado: ABC-1234." });
        }
        if (modelo === "") {
            listaErros.push({ campo: modeloInput, msg: "O modelo do veículo é obrigatório." });
        }
        if (cor === "") {
            listaErros.push({ campo: corInput, msg: "A cor do veículo é obrigatória." });
        }
        if (marca === "") {
            listaErros.push({ campo: marcaInput, msg: "A marca do veículo é obrigatória." });
        }


        if (listaErros.length > 0) {
            listaErros.forEach(erro => {
                erro.campo.style.borderColor = "red";
                exibirErro(erro.campo, erro.msg);
            });
            return;
        }

        let obj = { placa, modelo, cor, marca, pessoa_id: pessoaId };

        fetch("/veiculo/cadastrar", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then(r => {
            if (r.ok) {
                window.location.href = "/veiculo/listar";
            } else if (r.jaExisteDesativado) {
                const confirmar = confirm(r.msg);
                if (confirmar) {
                    fetch("/veiculo/reativar", {
                        method: 'POST',
                        body: JSON.stringify({ id: r.id }),
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                    .then(r2 => r2.json())
                    .then(r2 => {
                        if (r2.ok) {
                            window.location.href = "/veiculo/listar";
                        } else {
                            tratarErroBackend(res);
                        }
                    });
                }
            } else {
                alert(r.msg);
            }
        });
    }

    function tratarErroBackend(res) {
        if (res.campo) {
            const input = document.getElementById(res.campo);
            const small = document.getElementById(`erro-${res.campo}`);
            if (input) input.style.borderColor = "red";
            if (small) {
                small.innerText = res.msg;
                small.style.display = "block";
            }
        } else {
            alert(res.msg || "Erro desconhecido ao cadastrar a categoria.");
            console.error("Erro desconhecido:", res.msg);
        }
    }

    function validarPlaca(placa) {
        const placaFormatada = placa.toUpperCase().replace(/[^A-Z0-9]/g, "").trim();
        const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
        return regex.test(placaFormatada);
    }

    function exibirErro(input, mensagem) {
        let erroElement = document.getElementById(`erro-${input.id}`);
        if (!erroElement) {
            erroElement = document.createElement("div");
            erroElement.id = `erro-${input.id}`;
            erroElement.style.color = "red";
            erroElement.style.fontSize = "12px";
            erroElement.style.marginTop = "5px";
            input.parentNode.appendChild(erroElement);
        }
        erroElement.innerText = mensagem;
        erroElement.style.display = "block";
    }
});
