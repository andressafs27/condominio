document.addEventListener("DOMContentLoaded", function () {
    const btnAdicionarAlternativa = document.getElementById("btnAdicionarAlternativa");
    const alternativasContainer = document.getElementById("alternativasContainer");
    const btnCadastrar = document.getElementById("btnCadastrar");

    btnCadastrar.addEventListener("click", cadastrar);

    function limparValidacao() {
        ["enunciado", "status"].forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.style["border-color"] = "#ced4da";
        });
    }

    function cadastrar() {
        limparValidacao();

        const enunciado = document.getElementById("enunciado").value;
        const status = document.getElementById("status").value;
        const alternativas = [];
        const listaErros = [];

        if (!/^[A-Za-zÀ-ÿ\s]{3,50}$/.test(enunciado)) {
            listaErros.push("enunciado");
        }

        let alternativaValida = true;

        alternativasContainer.querySelectorAll('.alternativas-item').forEach(item => {
            const input = item.querySelector('.alternativa');
            const enunciado = input.value.trim();

            if (!/^[A-Za-zÀ-ÿ0-9\s]{2,100}$/.test(enunciado)) {
                alternativaValida = false;
                input.style.borderColor = "red";
            } else {
                input.style.borderColor = "#ced4da";
                alternativas.push({ enunciado });
            }
        });

        if (!alternativaValida || alternativas.length === 0) {
            listaErros.push("alternativas");
        }

        if (listaErros.length === 0) {
            const obj = { enunciado, status, alternativas };

            fetch("/perguntas/cadastrar", {
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
                        title: 'Erro ao cadastrar',
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
        } else {
            listaErros.forEach(id => {
                const campo = document.getElementById(id);
                if (campo) campo.style["border-color"] = "red";
            });

            Swal.fire({
                icon: 'error',
                title: 'Campos inválidos!',
                text: 'Preencha corretamente os campos: ' + listaErros.join(", ")
            });
        }
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
            const totalAlternativas = alternativasContainer.querySelectorAll('.alternativas-item').length;

            if (totalAlternativas > 1) {
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
