document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnDesabilitar").addEventListener("click", desabilitar);

    function limparValidacao() {
        document.getElementById("numero").style["border-color"] = "#ced4da";
        document.getElementById("bloco_numero").style["border-color"] = "#ced4da";
    }

    function desabilitar() {
        limparValidacao(); 
        let numero = document.querySelector("#numero").value;
        let bloco_numero = document.querySelector("#bloco_numero").value;
        let id = document.querySelector("#id").value; // Assume que o ID da unidade está presente no campo oculto

        let listaErros = [];
        
        if (!numero) {
            listaErros.push("numero");
        }
        
        if (!bloco_numero) {
            listaErros.push("bloco_numero");
        }


        if (listaErros.length == 0) {
            let obj = {
                id: id,
                numero: numero,
                bloco_numero: bloco_numero
            }

            const confirmacao = confirm("Tem certeza que deseja desabilitar essa unidade?");
            if (!confirmacao) {
                return;
            }

            fetch("/unidade/desabilitar", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r => {
                return r.json();
            })
            .then(r => {
                if (r.ok) {
                    alert(r.msg); 
                    window.location.href = "/unidade/listar"; 
                } else {
                    alert(r.msg);
                }
            });
        } else {
            
            for (let i = 0; i < listaErros.length; i++) {
                let campos = document.getElementById(listaErros[i]);
                campos.style["border-color"] = "red"; 
            }
            alert("Preencha corretamente os campos indicados!"); 
        }
    }
});
