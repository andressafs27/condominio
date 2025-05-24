document.addEventListener("DOMContentLoaded", function () {
    const btnCadastrar = document.getElementById("btnCadastrar");
    const campos = ["nome", "penalidade", "multa"];

    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrar);
    }

    function limparValidacao() {
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            const small = document.getElementById(`erro-${campo}`);

            if (input) input.style.borderColor = "#ced4da";
            if (small) {
                small.style.display = "none";
                small.innerText = "";
            }
        });
    }

    function cadastrar() {
        limparValidacao();

        const nome = document.getElementById("nome")?.value.trim() || "";
        const penalidade = document.getElementById("penalidade")?.value || "";
        const multa = document.getElementById("multa")?.value || "";

        const listaErros = [];

        if (!/^[A-Za-zÀ-ÿ\s'-]{5,50}$/.test(nome)) {
            listaErros.push("nome");
        }
        

        if (!penalidade) {
            listaErros.push("penalidade");
        }

        const multaConvertida = converterParaNumero(multa);
        if (!multa || isNaN(multaConvertida)) {
            listaErros.push("multa");
        }

        if (listaErros.length > 0) {
            exibirErros(listaErros);
            return;
        }

        const obj = {
            nome,
            penalidade,
            multa: multaConvertida
        };

        fetch("/categoria/cadastrar", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then(r => {
                if (r.ok) {
                    // alert(r.msg);
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
                                // alert(r2.msg);
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
            alert(res.msg || "Erro desconhecido ao cadastrar a categoria.");
            console.error("Erro desconhecido:", res.msg);
        }
    }

    function exibirErros(listaErros) {
        listaErros.forEach(campo => {
            const input = document.getElementById(campo);
            const small = document.getElementById(`erro-${campo}`);
            if (input) input.style.borderColor = "red";
            if (small) small.style.display = "block";
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
    

    // Impedir números no campo nome
    const inputNome = document.getElementById("nome");
    if (inputNome) {
        inputNome.addEventListener("keyup", function () {
            this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        
            const nome = this.value.trim();
            const input = this;
            const small = document.getElementById("erro-nome");
        
            // Se nome for válido, remove o erro
            if (/^[A-Za-zÀ-ÿ\s'-]{5,50}$/.test(nome)) {
                input.style.borderColor = "#ced4da";
                if (small) {
                    small.innerText = "";
                    small.style.display = "none";
                }
            }
        });
        
        

        // Verificação de nome duplicado ao perder o foco
        inputNome.addEventListener("blur", function () {
            const nome = this.value.trim();

            if (nome.length >= 5) {
                fetch("/categoria/verificar-nome", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nome })
                })
                .then(res => res.json())
                .then(res => {
                    if (res.ok) {
                        // Nome já existe
                        const small = document.getElementById("erro-nome");
                        inputNome.style.borderColor = "red";
                        if (small) {
                            small.innerText = "Este nome já está cadastrado.";
                            small.style.display = "block";
                        }
                    }
                })
                .catch(err => console.error("Erro na verificação de nome:", err));
            }
        });
    }

    // Formatar valor em tempo real no campo multa
    const inputMulta = document.getElementById("multa");

    inputMulta.addEventListener("input", function (e) {
        let valor = this.value.replace(/\D/g, ""); // Remove tudo que não for número
    
        // Limita a 10 dígitos (por exemplo, R$ 99.999.999,99)
        if (valor.length > 10) valor = valor.slice(0, 10);
    
        const numero = (parseInt(valor, 10) / 100).toFixed(2);
    
        this.value = numero
            .toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            .replace(".", ","); // Converte ponto para vírgula (formato brasileiro)
    
        // Move o cursor sempre para o final
        this.setSelectionRange(this.value.length, this.value.length);
    });
    

    function formatarMoeda(valor) {
        valor = valor.replace(/\D/g, "");
    
        if (!valor) return "";
    
        const numero = parseFloat(valor) / 100;
        return numero.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    

    function converterParaNumero(valor) {
        return parseFloat(valor.replace(/\./g, "").replace(",", "."));
    }
})