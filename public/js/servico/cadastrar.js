document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);

    function limparValidacao() {
        document.getElementById("descricao").style["border-color"] = "#ced4da";
    }

    function cadastrar() {
        limparValidacao();
        let descricao = document.querySelector("#descricao").value;

        let listaErros = [];
        //validar descricao aceitar somente letras
        if (!/^[A-Za-zÀ-ÿ\s]{5,50}$/.test(descricao)) {
            listaErros.push("descricao");
        }
        

        if(listaErros.length == 0) {

            let obj = {
                descricao: descricao,
            }
            fetch("/servico/cadastrar", {
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