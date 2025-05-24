document.addEventListener("DOMContentLoaded", function () {
    const btnAlterar = document.getElementById("btnAlterar");
    const nomeInput = document.getElementById("nome");
    const penalidadeInput = document.getElementById("penalidade");
    const multaInput = document.getElementById("multa");
    const erroNome = document.getElementById("erro-nome");

    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterar);
    }

    const multaValor = parseFloat(multaInput.value); // Exemplo: o valor vindo do banco

    if (multaInput) {
        // Se o valor de multa já existe (vindo do banco), formate-o corretamente
        if (multaValor) {
            multaInput.value = multaValor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    // Validação de nome
    nomeInput.addEventListener("keyup", function () {
        this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        const nome = this.value.trim();

        if (/^[A-Za-zÀ-ÿ\s'-]{5,50}$/.test(nome)) {
            nomeInput.style.borderColor = "#ced4da";
            erroNome.innerText = "";
            erroNome.style.display = "none";
        }
    });

    nomeInput.addEventListener("blur", function () {
        const nome = this.value.trim();
        const id = document.querySelector("#id")?.value;

        if (nome.length >= 5) {
            fetch("/categoria/verificar-nome", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, id })
            })
            .then(res => res.json())
            .then(res => {
                if (res.ok) {
                    nomeInput.style.borderColor = "red";
                    erroNome.innerText = "Este nome já está cadastrado.";
                    erroNome.style.display = "block";
                }
            });
        }
    });

    // ✅ Máscara de moeda: formato BR, da direita para esquerda
    if (multaInput) {
        multaInput.addEventListener("input", function () {
            let valor = this.value.replace(/\D/g, ""); // Só números

            // Garante no mínimo 3 dígitos para centavos
            while (valor.length < 3) {
                // valor = "0" + valor;
                valor = valor.padStart(3, "0");
            }

            const parteInteira = valor.slice(0, valor.length - 2);
            const parteDecimal = valor.slice(-2);
            const valorFinal = `${parteInteira}.${parteDecimal}`;
            const numero = parseFloat(valorFinal);

            this.value = numero.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Move o cursor sempre pro final
            this.setSelectionRange(this.value.length, this.value.length);
        });
    }

    // 🔄 Função para converter string formatada (pt-BR) para número
    function converterParaNumero(valor) {
        if (!valor || valor === "") return 0;
        const numero = parseFloat(valor.replace(/\./g, "").replace(",", "."));
        return isNaN(numero) ? 0 : numero;
    }

    function limparValidacao() {
        [nomeInput, penalidadeInput, multaInput].forEach(input => {
            input.style.borderColor = "#ced4da";
        });
        erroNome.style.display = "none";
        erroNome.innerText = "";
    }

    function alterar() {
        limparValidacao();

        const id = document.querySelector("#id")?.value;
        const nome = nomeInput.value.trim();
        const penalidade = penalidadeInput.value.trim();
        const multa = multaInput.value.trim();

        if (!id) {
            alert("Erro: ID da categoria não encontrado!");
            return;
        }

        let listaErros = [];

        if (!/^[A-Za-zÀ-ÿ\s'-]{5,50}$/.test(nome)) listaErros.push("nome");
        if (!penalidade) listaErros.push("penalidade");
        if (isNaN(converterParaNumero(multa))) listaErros.push("multa");

        if (listaErros.length > 0) {
            listaErros.forEach(campo => {
                document.getElementById(campo).style.borderColor = "red";
            });

            alert("Por favor, corrija os seguintes campos:\n- " + listaErros.join("\n- "));
            return;
        }

        const obj = {
            id,
            nome,
            penalidade,
            multa: converterParaNumero(multa) // envia como número float
        };

        fetch("/categoria/alterar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        })
        .then(response => response.json())
        .then(r => {
            if (r.ok) {
                window.location.href = "/categoria/listar";
            } else if (r.jaExisteDesativado) {
                const confirmar = confirm(r.msg);
                if (confirmar) {
                    fetch("/categoria/reativar", {
                        method: 'POST',
                        body: JSON.stringify({ id: r.id }),
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                    .then(r2 => r2.json())
                    .then(r2 => {
                        if (r2.ok) {
                            window.location.href = "/categoria/listar";
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
            alert(res.msg || "Erro desconhecido ao alterar o bloco.");
            console.error("Erro desconhecido:", res.msg);
        }
    }
});
