document.addEventListener("DOMContentLoaded", function () {
    const btnAlterar = document.getElementById("btnAlterar");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const nomeInput = document.getElementById("nome");

    btnAlterar.addEventListener("click", alterar);

    cpfInput.addEventListener("keyup", function () {
        impedirLetras(cpfInput);
        validarCPF(cpfInput.value);
    });

    nomeInput.addEventListener("keyup", function () {
        impedirNumeros(this);
    });

    telefoneInput.addEventListener("input", function () {
        let somenteNumeros = telefoneInput.value.replace(/\D/g, '');
        if (somenteNumeros.length > 11) {
            somenteNumeros = somenteNumeros.slice(0, 11);
        }
        telefoneInput.value = phoneMask(somenteNumeros);
    });

    function limparValidacao() {
        const campos = ["nome", "cpf", "telefone", "email", "data_nascimento", "rg", "sindico", "senha", "adm"];
        campos.forEach(campo => {
            document.getElementById(campo).style["border-color"] = "#ced4da";
        });
    }

    function alterar() {
        limparValidacao();

        const id = document.getElementById("id").value;
        const nome = document.getElementById("nome").value;
        let cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;
        const email = document.getElementById("email").value;
        const data_nascimento = document.getElementById("data_nascimento").value;
        const rg = document.getElementById("rg").value;
        const sindico = document.getElementById("sindico").value;
        const senha = document.getElementById("senha").value;
        const adm = document.getElementById("adm").value;

        cpf = limparPontosTracosCPF(cpf);

        const unidades = [];
        unidadesContainer.querySelectorAll('.unidade-item').forEach(item => {
        const bloco = item.querySelector('.bloco-select').value;
        const numeroUnidade = item.querySelector('.numero-unidade').value.trim();
        const responsavel = item.querySelector('.tipo-vinculo').value;

        if (bloco && numeroUnidade && responsavel !== '') {
            unidades.push({
            bloco,
            numeroUnidade,
            responsavel: responsavel
            });
        }
        });

        const listaErros = [];

        if (!id) {
            alert("Erro: ID não encontrado!");
            return;
        }

        if (!/^[A-Za-zÀ-ÿ\s]{5,50}$/.test(nome)) listaErros.push("nome");
        if (!validarCPF(cpf)) listaErros.push("cpf");
        if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone) || telefone.replace(/\D/g, '').length < 10) {
            listaErros.push("telefone");
        }
        if (!validarRG(rg)) {
            listaErros.push("rg");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) listaErros.push("email");
        if (!validarDataNascimento(data_nascimento)) listaErros.push("data_nascimento");
        if (sindico === "") listaErros.push("sindico");
        if (senha === "") listaErros.push("senha");
        if (adm === "") listaErros.push("adm");

        if (!nome) listaErros.push("nome");
        if (!telefone) listaErros.push("telefone");
        if (!email) listaErros.push("email");
        if (!data_nascimento) listaErros.push("data_nascimento");
        if (!rg) listaErros.push("rg");

        if (listaErros.length > 0) {
            let mensagemErro = "Por favor, corrija os seguintes campos:\n";
            listaErros.forEach(campo => {
                document.getElementById(campo).style["border-color"] = "red";
                mensagemErro += `- ${campo}\n`;
            });
            alert(mensagemErro);
            return;
        }

        const obj = {
            id,
            nome,
            cpf,
            telefone,
            email,
            data_nascimento,
            rg,
            sindico,
            senha,
            adm,
            unidades
        };

        fetch("/pessoa/alterar", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .then(r => {
            if (r.ok) {
                alert(r.msg);
                window.location.href = "/pessoa/listar";
            } else {
                alert(r.msg);
            }
        });
    }

    btnAdicionarUnidade.addEventListener('click', () => {
        const novaUnidade = unidadesContainer.querySelector('.unidade-item').cloneNode(true);
    
        novaUnidade.querySelectorAll('input, select').forEach(el => el.value = '');
    
        unidadesContainer.appendChild(novaUnidade);
      });
    
      document.addEventListener('click', function (event) {
        if (event.target.classList.contains('remover-unidade')) {
          const item = event.target.closest('.unidade-item');
          const totalUnidades = unidadesContainer.querySelectorAll('.unidade-item').length;
    
          if (totalUnidades > 1) {
            item.remove();
          } else {
            alert('Pelo menos uma unidade deve ser informada.');
          }
        }
    });

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^0-9]/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
        let resto1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
        let resto2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        return cpf[9] == resto1 && cpf[10] == resto2;
    }

    function impedirLetras(cpf) {
        cpf.value = cpf.value.replace(/[^0-9]/g, '');
        if (cpf.value.length > 11) cpf.value = cpf.value.substring(0, 11);

        let valorFormatado = "";
        for (let i = 0; i < cpf.value.length; i++) {
            if (i === 3 || i === 6) valorFormatado += ".";
            if (i === 9) valorFormatado += "-";
            valorFormatado += cpf.value[i];
        }
        cpf.value = valorFormatado;
    }

    function limparPontosTracosCPF(cpf) {
        return cpf.replace(/[.-]/g, '');
    }

    function impedirNumeros(nome) {
        nome.value = nome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    }

    function validarDataNascimento(data) {
        if (!data) return false;
        let hoje = new Date().toISOString().split("T")[0];
        return data < hoje;
    }

    function phoneMask(value) {
        if (!value) return "";
        value = value.replace(/\D/g, '');
        return value.length <= 10
            ? value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
            : value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    const rg = document.getElementById("rg");

    rg.addEventListener("input", function () {
        formatarRG(this);
    });

    function formatarRG(campo) {
        let valor = campo.value.toUpperCase()
            .replace(/\./g, '')       
            .replace(/-/g, '')        
            .replace(/[^0-9X]/g, ''); 
    
        const temXNoFinal = valor.endsWith('X');
        valor = valor.replace(/X/g, '');
        if (temXNoFinal) valor += 'X';
    
        valor = valor.substring(0, 10);
    
        if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
        }
        if (valor.length > 6) {
            valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        }
        if (valor.length > 9) {
            valor = valor.replace(/^(\d{2})\.(\d{3})\.(\d{3})([0-9X])/, '$1.$2.$3-$4');
        }
    
        campo.value = valor;
    }

    function validarRG(rg) {
        if (!rg) return false;
    
        rg = rg.replace(/\D/g, ''); 
        if (rg.length === 9) {
            return true;
        }
        return false;
    }
});
