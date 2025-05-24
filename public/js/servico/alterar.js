document.addEventListener("DOMContentLoaded", function() {
    console.log("dom");


    document.getElementById("btnAlterar").addEventListener("click", alterar);
    console.log("Botão clicado");


    function limparValidacao() {
        document.getElementById("descricao").style["border-color"] = "#ced4da";
    }

    function alterar() {
        limparValidacao();
        let id = document.querySelector("#id").value;
        let descricao = document.querySelector("#descricao").value;

        let listaErros = [];
        //validar descricao aceitar somente letras
        if (!/^[A-Za-zÀ-ÿ\s]{5,50}$/.test(descricao)) {
            listaErros.push("descricao");
        }

        if (!id) { 
            alert("Erro: ID do servico não encontrado!");
            return;
        }

        if(listaErros.length > 0) {
            let mensagemErro = "Por favor, corrija os seguintes campos:\n";
            listaErros.forEach(campo => {
                let campos = document.getElementById(campo);
                campos.style["border-color"] = "red";
                mensagemErro += `- ${campo}\n`;
            });
            alert(mensagemErro);
        }else{

            let obj = {
                id,
                descricao: descricao,
            }
            fetch("/servico/alterar", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r=> {
                return r.json();
            })
            .then(r => {
                if (r.ok) {
                    // alert(r.msg);
                    window.location.href = "/servico/listar";
                } else if (r.jaExisteDesativado) {
                    const confirmar = confirm(r.msg);
                    if (confirmar) {
                        fetch("/servico/reativar", {
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
                                window.location.href = "/servico/listar";
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


    //--------------------validacao descricao para impedir números----------------------
    function impedirNumeros(descricao) {
        // Remove números do descricao
        descricao.value = descricao.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    }

    // Chama a função de impedir números ao digitar no campo descricao
    document.getElementById("descricao").addEventListener("keyup", function() {
        impedirNumeros(this);
    });

    
    
})