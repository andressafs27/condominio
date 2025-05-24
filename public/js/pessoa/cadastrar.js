document.addEventListener("DOMContentLoaded", function() {
    
    const btnAdicionarUnidade = document.getElementById("btnAdicionarUnidade");
    const unidadesContainer = document.getElementById("unidadesContainer");
    
    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);


    function limparValidacao() {
        document.getElementById("nome").style["border-color"] = "#ced4da";
        document.getElementById("cpf").style["border-color"] = "#ced4da";
        document.getElementById("telefone").style["border-color"] = "#ced4da";
        document.getElementById("email").style["border-color"] = "#ced4da";
        document.getElementById("data_nascimento").style["border-color"] = "#ced4da";
        document.getElementById("rg").style["border-color"] = "#ced4da";
        document.getElementById("sindico").style["border-color"] = "#ced4da";
        document.getElementById("senha").style["border-color"] = "#ced4da";
        document.getElementById("adm").style["border-color"] = "#ced4da";
    }

    function cadastrar() {
        limparValidacao();
        let nome = document.querySelector("#nome").value;
        let cpf = document.querySelector("#cpf").value;
        let telefone = document.querySelector("#telefone").value;
        let email = document.querySelector("#email").value;
        let data_nascimento = document.querySelector("#data_nascimento").value;
        let rg = document.querySelector("#rg").value;
        let sindico = document.querySelector("#sindico").value;
        let senha = document.querySelector("#senha").value;
        let adm = document.querySelector("#adm").value;
       
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

        let listaErros = [];

        if (!/^[A-Za-zÀ-ÿ\s]{5,50}$/.test(nome)) {
            listaErros.push("nome");
        }
        
        if(!validarCPF(cpf)) {
            listaErros.push("cpf");
        }

        if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone) || telefone.replace(/\D/g, '').length < 10) {
            listaErros.push("telefone");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            listaErros.push("email");
        }

        if (!validarDataNascimento(data_nascimento)) {
            listaErros.push("data_nascimento");
        }

        if (!validarRG(rg)) {
            listaErros.push("rg");
        }

        if(sindico == "") {
            listaErros.push("sindico");
        }

        if(senha == "") {
            listaErros.push("senha");
        }

        if(adm == "") {
            listaErros.push("adm");
        }

        if(listaErros.length == 0) {

            let obj = {
                nome: nome,
                cpf: cpf,
                telefone,
                email,
                data_nascimento,
                rg,
                sindico,
                senha, 
                adm,
                unidades,
                
            }
            fetch("/pessoa/cadastrar", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r=> {
                return r.json();
            })
            .then(r=> {
                if(r.ok) {
                    alert(r.msg);
                    window.location.href="/pessoa/listar";
                }   
                else {
                    alert(r.msg);
                }
            })
        }
        else{

            listaErros.forEach(campo => {
                document.getElementById(campo).style["border-color"] = "red";
            });
            
            alert("Preencha corretamente os campos indicados: " + listaErros.join(", "));  
        }
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

    //-----------------validacao CPF-----------------------
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^0-9]/g, '');
      
        if (cpf.length !== 11) {
          return false;
        }

        if (/^(\d)\1+$/.test(cpf)) {
            return false;
        }
      
        let soma = 0;
        for (let i = 0; i < 9; i++) {
          soma += parseInt(cpf[i]) * (10 - i);
        }
      
        let resto1 = soma % 11;
        if (resto1 === 0 || resto1 === 1) {
          resto1 = 0;
        } else {
          resto1 = 11 - resto1;
        }
      
        soma = 0;
        for (let i = 0; i < 10; i++) {
          soma += parseInt(cpf[i]) * (11 - i);
        }
      
        let resto2 = soma % 11;
        if (resto2 === 0 || resto2 === 1) {
          resto2 = 0;
        } else {
          resto2 = 11 - resto2;
        }
      
        return cpf[9] === String(resto1) && cpf[10] === String(resto2);
    }
      
    function impedirLetras(cpf) {
        cpf.value = cpf.value.replace(/[^0-9]/g, '');
        
        if (cpf.value.length > 11) {
            cpf.value = cpf.value.substring(0, 11);
        }
        
        let valorFormatado = "";
        for (let i = 0; i < cpf.value.length; i++) {
            if (i === 3 || i === 6) {
            valorFormatado += ".";
            } else if (i === 9) {
            valorFormatado += "-";
            }
            valorFormatado += cpf.value[i];
        }
            cpf.value = valorFormatado;
    }

    function limparPontosTracosCPF(cpf){
        return cpf.replace(/[.-]/g, '');
    }

    const cpf = document.getElementById("cpf");
    
    cpf.addEventListener("keyup", function() {
        impedirLetras(cpf);
        validarCPF(cpf.value);
    })

    //--------------------validacao Nome (para impedir números)----------------------
    function impedirNumeros(nome) {
        nome.value = nome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    }

    document.getElementById("nome").addEventListener("keyup", function() {
        impedirNumeros(this);
    });

    //--------------------validacao data de nascimento----------------------
    function validarDataNascimento(data) {
        if (!data) return false;
    
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;

        const partes = data.split("-");
        const ano = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; 
        const dia = parseInt(partes[2]);
    
        const dataNascimento = new Date(ano, mes, dia);
        const hoje = new Date();
    
        if (
            dataNascimento.getFullYear() !== ano ||
            dataNascimento.getMonth() !== mes ||
            dataNascimento.getDate() !== dia
        ) {
            return false; 
        }
    
        if (dataNascimento >= hoje) {
            return false; 
        }

        return true;
    }


    //--------------------validacao numero de telefone----------------------
    const telefone = document.getElementById("telefone");
    
    telefone.addEventListener("input", function (e) {
        let somenteNumeros = telefone.value.replace(/\D/g, '');
    
        if (somenteNumeros.length > 11) {
            somenteNumeros = somenteNumeros.slice(0, 11);
        }
    
        telefone.value = phoneMask(somenteNumeros);
    });
    
    

    function phoneMask(value) {
        if (!value) return "";
        value = value.replace(/\D/g, '');
        if (value.length <= 10) {
            return value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else {
            return value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
        }
    }

    //--------------------validacao rg aceita letras----------------------
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
    
})


