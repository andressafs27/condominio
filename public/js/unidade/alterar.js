// 
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnAlterar").addEventListener("click", alterar);

    let numeroInput = document.getElementById("numero");
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
        blocoSelect.style.borderColor = "#ced4da";    }

    // Função de alteração
    function alterar() {
        limparValidacao(); // Limpa as validações anteriores
        let numero = numeroInput.value.trim();
        let bloco_id = parseInt(blocoSelect.value); 
        let id = document.querySelector("#id").value.trim(); // Captura o ID da unidade

        let listaErros = [];
        
        // Valida os campos
        if (numero === "" || isNaN(numero)) {
            listaErros.push("numero");
        }
        
        // if (bloco_numero === "" || isNaN(bloco_numero)) {
        //     listaErros.push("bloco_numero"); // Corrigido o nome do campo na validação
        // }

        if (!bloco_id || isNaN(bloco_id)) {
            listaErros.push("bloco_id");
        }

        // Se houver erros, destacar os campos e alertar o usuário
        if (listaErros.length > 0) {
            listaErros.forEach(id => {
                document.getElementById(id).style.borderColor = "red";
            });
            alert("Preencha corretamente os campos indicados! Apenas números são permitidos.");
            return; // Interrompe a execução
        }

        // Objeto a ser enviado ao backend
        let obj = {
            id: id,
            numero: numero,
            bloco_id: bloco_id
        };

        // Envia os dados para o backend via POST
        fetch("/unidade/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((res) => res.json())
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
                            tratarErroBackend(r2);
                        }
                    });
                }
            } else {
                alert(r.msg);
            }
        })
        .catch(err => {
            console.error("Erro ao alterar:", err);
            alert("Erro ao tentar alterar unidade.");
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
