document.addEventListener("DOMContentLoaded", function () {
    const btnAlterar = document.getElementById("btnAlterar");
    const campos = ["numero"];

    if (btnAlterar) {
        btnAlterar.addEventListener("click", alterar);
    }

   // Impede digitar letras
    const inputNumero = document.getElementById("numero");
    if (inputNumero) {
        inputNumero.addEventListener("keypress", function (e) {
            const charCode = e.charCode || e.keyCode;
            const charStr = String.fromCharCode(charCode);

            // Permite apenas números (0–9)
            if (!/^\d$/.test(charStr)) {
                e.preventDefault();
            }
        });
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

    function alterar() {
        limparValidacao();

        const id = document.getElementById("id")?.value;
        const numero = document.getElementById("numero")?.value.trim();

        const listaErros = [];

        if (!id) {
            alert("Erro: ID do bloco não encontrado!");
            return;
        }

        if (!numero || !/^\d{1,3}$/.test(numero)) {
            listaErros.push("numero");
        }

        if (listaErros.length > 0) {
            exibirErros(listaErros);
            return;
        }

        const obj = {
            id,
            numero
        };

        fetch("/bloco/alterar", {
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
            alert(res.msg || "Erro desconhecido ao alterar o bloco.");
            console.error("Erro desconhecido:", res.msg);
        }
    }
});
