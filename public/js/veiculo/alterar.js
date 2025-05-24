document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnAlterar").addEventListener("click", alterar);

    const cpfInput = document.getElementById("cpf");
    const placaInput = document.getElementById("placa");
    const modeloInput = document.getElementById("modelo");
    const corInput = document.getElementById("cor");
    const marcaInput = document.getElementById("marca");

    // Impede que caracteres não numéricos sejam digitados no CPF
    cpfInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
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

    function validarPlaca(placa) {
        const placaFormatada = placa.toUpperCase().replace(/[^A-Z0-9]/g, "").trim();
        const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
        return regex.test(placaFormatada);
    }

    function alterar() {
        limparValidacao();

        const id = document.querySelector("#id").value;
        const pessoa_id = document.querySelector("#pessoa_id").value;
        const cpf = cpfInput.value.trim();
        const placa = placaInput.value.trim();
        const modelo = modeloInput.value.trim();
        const cor = corInput.value.trim();
        const marca = marcaInput.value.trim();

        let listaErros = [];

        if (!cpf) listaErros.push({campo: cpfInput, msg: "Campo CPF é obrigatório."});
        if (!validarPlaca(placa)) listaErros.push({campo: placaInput, msg: "Placa inválida. Formato esperado: ABC-1234."});
        if (!modelo) listaErros.push({campo: modeloInput, msg: "O modelo do veículo é obrigatório."});
        if (!cor) listaErros.push({campo: corInput, msg: "A cor do veículo é obrigatória."});
        if (!marca) listaErros.push({campo: marcaInput, msg: "A marca do veículo é obrigatória."});

        if (listaErros.length > 0) {
            listaErros.forEach(erro => {
                erro.campo.style.borderColor = "red";
                exibirErro(erro.campo, erro.msg); // Exibindo a mensagem de erro
            });
            return;
        }

        const obj = {
            id,
            pessoa_id,
            cpf,
            placa,
            modelo,
            cor,
            marca
        };

        fetch("/veiculo/alterar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
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
