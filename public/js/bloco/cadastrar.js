document.addEventListener("DOMContentLoaded", function () {

    const inputNumero = document.getElementById("numero");

    // Impede digitar letras
    inputNumero.addEventListener("keypress", function (e) {
        const charCode = e.charCode || e.keyCode;
        const charStr = String.fromCharCode(charCode);

        // Permite apenas números (0–9)
        if (!/^\d$/.test(charStr)) {
            e.preventDefault();
        }
    });

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);

    function limparValidacao() {
        inputNumero.style["border-color"] = "#ced4da";
    }

    function cadastrar() {
        limparValidacao();
        let numero = inputNumero.value.trim();
        let listaErros = [];

        if (numero === "") {
            listaErros.push("numero");
        }

        if (isNaN(numero) || !/^\d+$/.test(numero)) {
            listaErros.push("numero");
        }

        if (listaErros.length === 0) {
            let obj = { numero };

            fetch("/bloco/cadastrar", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r => r.json())
            .then(r => {
                if (r.ok) {
                    // alert(r.msg);
                    window.location.href = "/bloco/listar";
                } else if (r.jaExisteDesativado) {
                    const confirmar = confirm(r.msg);
                    if (confirmar) {
                        fetch("/bloco/reativar", {
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
                                window.location.href = "/bloco/listar";
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
});



