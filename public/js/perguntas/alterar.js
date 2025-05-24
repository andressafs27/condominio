document.addEventListener("DOMContentLoaded", function () {
    const btnAlterar = document.getElementById("btnAlterar");
    const enunciado = document.getElementById("enunciado");
    const status = document.getElementById("status");
    const alternativasContainer = document.getElementById("alternativasContainer");
    const btnAdicionarAlternativa = document.getElementById("btnAdicionarAlternativa");

    btnAlterar.addEventListener("click", alterar);

    if (status.value === "") {
        listaErros.push("status");
    }

    function limparValidacao() {
        const campos = ["enunciado", "status"];
        campos.forEach(campo => {
            document.getElementById(campo).style["border-color"] = "#ced4da";
        });
    }

    function alterar() {
        limparValidacao();

        const id = document.getElementById("id").value;
        const enunciado = document.getElementById("enunciado").value;
        const status = document.getElementById("status").value;

        const alternativas = [];
        alternativasContainer.querySelectorAll('.alternativas-item').forEach(item => {
            const input = item.querySelector('.alternativa');
            const enunciado = input.value.trim();

            if (!/^[A-Za-zÀ-ÿ0-9\s]{3,100}$/.test(enunciado)) {
                input.style.borderColor = "red";
                alternativas.push("alternativa");
            } else {
                input.style.borderColor = "#ced4da";
                alternativas.push({ enunciado });
            }
        });

        const listaErros = [];

        if (listaErros.length > 0) {
            listaErros.forEach(campo => {
                const campoElement = document.getElementById(campo);
                if (campoElement) campoElement.style["border-color"] = "red";
            });

            Swal.fire({
                icon: 'error',
                title: 'Campos inválidos!',
                text: 'Preencha corretamente os campos: ' + listaErros.join(", ")
            });
            return;
        }

        const obj = { id, enunciado, status, alternativas };

        fetch("/perguntas/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: r.msg
                }).then(() => {
                    window.location.href = "/perguntas/listar";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao alterar',
                    text: r.msg
                });
            }
        })
        .catch(err => {
            console.error("Erro ao enviar requisição:", err);
            Swal.fire({
                icon: 'error',
                title: 'Erro inesperado',
                text: 'Tente novamente mais tarde.'
            });
        });
    }

    btnAdicionarAlternativa.addEventListener('click', () => {
        const novaAlternativa = alternativasContainer.querySelector('.alternativas-item').cloneNode(true);
        novaAlternativa.querySelectorAll('input').forEach(el => el.value = '');
        alternativasContainer.appendChild(novaAlternativa);

        aplicarValidacaoEnunciado(novaAlternativa.querySelector('.alternativa'));
    });

    alternativasContainer.querySelectorAll('.alternativa').forEach(input => {
        aplicarValidacaoEnunciado(input);
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('remover-alternativa')) {
            const item = event.target.closest('.alternativas-item');
            const totalalternativas = alternativasContainer.querySelectorAll('.alternativas-item').length;

            if (totalalternativas > 1) {
                item.remove();
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção',
                    text: 'Pelo menos uma alternativa deve ser informada.'
                });
            }
        }
    });

    function aplicarValidacaoEnunciado(input) {
        input.addEventListener("keyup", function () {
            this.value = this.value.replace(/[0-9]/g, '');
        });
    }
});
