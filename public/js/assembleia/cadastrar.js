document.addEventListener("DOMContentLoaded", function () {
    const btnAdicionarPauta = document.getElementById("btnAdicionarPauta");
    const pautasContainer = document.getElementById("pautasContainer");
    const btnCadastrar = document.getElementById("btnCadastrar");

    btnCadastrar.addEventListener("click", cadastrar);

    function limparValidacao() {
        ["data", "horario"].forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.style["border-color"] = "#ced4da";
        });
    }

    function cadastrar() {
        limparValidacao();

        const data = document.getElementById("data").value;
        const horario = document.getElementById("horario").value;
        const pautas = [];
        const listaErros = [];

        if (!validarData(data)) listaErros.push("data");
        if (!validarHorario(data, horario)) listaErros.push("horario");

        let pautaValida = true;

        pautasContainer.querySelectorAll('.pautas-item').forEach(item => {
            const input = item.querySelector('.pauta');
            const descricao = input.value.trim();

            if (!/^[A-Za-zÀ-ÿ0-9\s]{5,100}$/.test(descricao)) {
                pautaValida = false;
                input.style.borderColor = "red";
            } else {
                input.style.borderColor = "#ced4da";
                pautas.push({ descricao });
            }
        });

        if (!pautaValida || pautas.length === 0) {
            listaErros.push("pauta");
        }

        if (listaErros.length === 0) {
            const obj = { data, horario, pautas };

            fetch("/assembleia/cadastrar", {
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
                        window.location.href = "/assembleia/listar";
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

    btnAdicionarPauta.addEventListener('click', () => {
        const novaPauta = pautasContainer.querySelector('.pautas-item').cloneNode(true);
        novaPauta.querySelectorAll('input').forEach(el => el.value = '');
        pautasContainer.appendChild(novaPauta);

        aplicarValidacaoDescricao(novaPauta.querySelector('.pauta'));
    });

    pautasContainer.querySelectorAll('.pauta').forEach(input => {
        aplicarValidacaoDescricao(input);
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('remover-pauta')) {
            const item = event.target.closest('.pautas-item');
            const totalPautas = pautasContainer.querySelectorAll('.pautas-item').length;

            if (totalPautas > 1) {
                item.remove();
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção',
                    text: 'Pelo menos uma pauta deve ser informada.'
                });
            }
        }
    });

    function aplicarValidacaoDescricao(input) {
        input.addEventListener("keyup", function () {
            this.value = this.value.replace(/[0-9]/g, '');
        });
    }

    function validarData(data) {
        if (!data) return false;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;

        const [ano, mes, dia] = data.split("-").map(Number);
        const dataInformada = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        dataInformada.setHours(0, 0, 0, 0);

        return dataInformada >= hoje;
    }

    function validarHorario(data, horario) {
        if (!data || !horario) return false;
    
        const [ano, mes, dia] = data.split("-").map(Number);
        const [hora, minuto] = horario.split(":").map(Number);
    
        const dataInformada = new Date(ano, mes - 1, dia, hora, minuto);
        const agora = new Date();
        
        agora.setSeconds(0);
        agora.setMilliseconds(0);
    
        if (dataInformada < agora) {
            return false;
        }
    
        return true;
    }
});
