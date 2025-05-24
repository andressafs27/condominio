

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);

    let numeroInput = document.getElementById("numero");
    // let blocoNumeroInput = document.getElementById("bloco_numero");
    let blocoSelect = document.getElementById("bloco_id");


    // Impede que caracteres não numéricos sejam digitados
    numeroInput.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, ""); // Remove tudo que não for número
    });

    // blocoNumeroInput.addEventListener("input", function() {
    //     this.value = this.value.replace(/\D/g, ""); // Remove tudo que não for número
    // });

    // Função para limpar a validação visual
    function limparValidacao() {
        numeroInput.style.borderColor = "#ced4da";
        // blocoNumeroInput.style.borderColor = "#ced4da";
        blocoSelect.style.borderColor = "#ced4da";
    }

    // Função de cadastro
    function cadastrar() {
        limparValidacao(); // Limpa as validações anteriores

        let numero = numeroInput.value.trim();
        // let bloco_numero = blocoNumeroInput.value.trim();
        let bloco_id = parseInt(blocoSelect.value); // garantir que seja número inteiro


        let listaErros = [];

        // Verifica se os campos estão vazios ou não são numéricos
        if (numero === "" || isNaN(numero)) {
            listaErros.push("numero");
        }

        // if (bloco_numero === "" || isNaN(bloco_numero)) {
        //     listaErros.push("bloco_numero");
        // }

        if (!bloco_id || isNaN(bloco_id)) {
            listaErros.push("bloco_id");
        }
        


        // Se houver erros, destacar os campos
        if (listaErros.length > 0) {
            listaErros.forEach(id => {
                document.getElementById(id).style.borderColor = "red";
            });
            alert("Preencha corretamente os campos indicados! Apenas números são permitidos.");
            return; // Interrompe a execução
        }

        // Objeto a ser enviado ao backend
        let obj = {
            numero: numero,
            // bloco_numero: bloco_numero
            bloco_id: bloco_id
        };



        // Envia os dados para o backend via POST
        fetch("/unidade/cadastrar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                window.location.href = "/unidade/listar"; // Redireciona para a lista
            } else if (r.jaExisteDesativado) {
                const confirmar = confirm(r.msg);
                if (confirmar) {
                    fetch("/unidade/reativar", {
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
                            window.location.href = "/unidade/listar";
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
            alert(res.msg || "Erro desconhecido ao cadastrar a unidade.");
            console.error("Erro desconhecido:", res.msg);
        }
    }
});

