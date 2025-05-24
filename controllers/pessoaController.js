import PessoaRepository from "../repositories/pessoaRepository.js";
import PessoaEntity from "../entities/pessoaEntity.js";
import UnidadeRepository from "../repositories/unidadeRepository.js";
import PessoaUnidadeRepository from "../repositories/pessoaUnidadeRepository.js";
import BlocoRepository from "../repositories/blocoRepository.js";

export default class PessoaController {

    async cadastrar(req, res) {
        try {
            const { nome, cpf, telefone, email, data_nascimento, rg, sindico, senha, adm, unidades = [] } = req.body;
            const bloco = unidades[0]?.bloco;

            if (!nome || !cpf || !telefone || !email || !data_nascimento || !rg || !sindico || !senha || !adm || !bloco || !bloco.trim() || unidades.length === 0) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }

            const repoPessoa = new PessoaRepository();
            const pessoaExistente = await repoPessoa.obterPorCpf(cpf);

            if (pessoaExistente) {
                return res.status(400).json({ ok: false, msg: "Este CPF já está cadastrado!" });
            }

            for (const unidade of unidades) {
                const repoBloco = new BlocoRepository();
                const { bloco, numeroUnidade, responsavel } = unidade;
                if (!bloco || !numeroUnidade) {
                    return res.status(400).json({ ok: false, msg: "Bloco ou Número da Unidade não informados corretamente!" });
                }
                const unidadeExistente = await new UnidadeRepository().buscarPorNumeroEBloco(numeroUnidade, bloco);
                
                if (!unidadeExistente) {
                    const blocoEncontrado = await repoBloco.buscarPorId(bloco);
                    const numeroBloco = blocoEncontrado?.numero || bloco;
                    return res.status(400).json({ ok: false, msg: `Unidade ${numeroUnidade} no bloco ${numeroBloco} não encontrada!`});
                }

                if (!unidadeExistente.ativo) {
                    const blocoEncontrado = await repoBloco.buscarPorId(bloco);
                    const numeroBloco = blocoEncontrado?.numero || bloco;

                    return res.status(400).json({ 
                        ok: false, 
                        msg: `A unidade ${numeroUnidade} no bloco ${numeroBloco} está desativada!` 
                    });
                }
            }

            const entidadePessoa = new PessoaEntity(0, nome, cpf, telefone, email, data_nascimento, rg, sindico,senha, true, adm);
            const pessoaCadastradaId = await repoPessoa.cadastrar(entidadePessoa);

            if (!pessoaCadastradaId) {
                throw new Error("Erro ao cadastrar no banco de dados");
            }

            const repoPessoaUnidade = new PessoaUnidadeRepository();

            for (const unidade of unidades) {
                const { bloco, numeroUnidade, responsavel } = unidade;
                const unidadeExistente = await new UnidadeRepository().buscarPorNumeroEBlocoEAtivo(numeroUnidade, bloco, 1);

                const pessoaUnidade = {
                    pessoa_id: pessoaCadastradaId,
                    unidade_id: unidadeExistente.id,
                    responsavel: responsavel  
                };

                await repoPessoaUnidade.associarPessoaUnidade(pessoaUnidade);
            }
    
            return res.status(201).json({ ok: true, msg: "Cadastro realizado com sucesso!" });

        } catch (ex) {
            console.error("Erro no cadastro:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }

    async listar(req, res) {
        try{
            let pessoa = new PessoaRepository();
            let lista = await pessoa.listar();
            res.render("pessoa/listar", { lista: lista });  
        }
        catch(ex) {
            console.error("Erro ao listar pessoas:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req, res) {
        try {
            const { id, nome, cpf, telefone, email, data_nascimento, rg, sindico, senha, adm, unidades = [] } = req.body;

            if (!nome || !cpf || !telefone || !email || !data_nascimento || !rg || !sindico || !senha || !adm || unidades === 0) {
                console.log("Parâmetros obrigatórios não informados!");
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
    
            if (!unidades || unidades.length === 0) {
                console.log("Unidades não informadas!");
                return res.status(400).json({ msg: "Nenhuma unidade foi informada!" });
            }
    
            const unidade = unidades[0]; 
            if (!unidade) {
                return res.status(400).json({ msg: "Unidade não informada!" });
            }

            const { bloco, numeroUnidade, responsavel } = unidade;
    
            if (!bloco || !numeroUnidade || responsavel === undefined || responsavel === null) {
                console.log("Bloco, número da unidade ou tipo de vínculo não informados corretamente!");
                return res.status(400).json({ msg: "Bloco, número da unidade ou tipo de vínculo não informados corretamente!" });
            }

            for (const unidade of unidades) {
                if (!unidade.bloco || !unidade.numeroUnidade || unidade.responsavel === undefined || unidade.responsavel === null) {
                    console.log("Unidade inválida, faltando bloco, número da unidade ou responsável!");
                    return res.status(400).json({ msg: "Unidade inválida, faltando bloco, número da unidade ou responsável!" });
                }
            }
    
            const repoPessoa = new PessoaRepository();
            const pessoaExistente = await repoPessoa.buscarPorId(id);
    
            if (!pessoaExistente) {
                console.log(`Pessoa com ID ${id} não encontrada!`);
                return res.status(404).json({ msg: "Pessoa não encontrada!" });
            }
    
            const entidade = new PessoaEntity(id, nome, cpf, telefone, email, data_nascimento, rg, sindico, senha,true, adm);
    
            console.log("Entidade Pessoa para alteração:", entidade);
    
            const result = await repoPessoa.alterar(entidade);
            console.log("Resultado da alteração da pessoa:", result);
    
            if (!result) {
                return res.status(400).json({ ok: false, msg: "Cadastro não atualizado!" });
            }
    
            const repoPessoaUnidade = new PessoaUnidadeRepository();
            const repoUnidade = new UnidadeRepository();
            const repoBloco = new BlocoRepository();
    
            console.log("Removendo associações anteriores...");
            await repoPessoaUnidade.removerPorPessoaId(id);
    
            for (const unidade of unidades) {
                const { bloco, numeroUnidade, responsavel } = unidade;
    
                if (!bloco || !numeroUnidade) {
                    return res.status(400).json({ ok: false, msg: "Bloco ou Número da Unidade não informados corretamente!" });
                }

                const unidadeExistente = await repoUnidade.buscarPorNumeroEBloco(numeroUnidade, bloco);

                if (!unidadeExistente) {
                    const blocoEncontrado = await repoBloco.buscarPorId(bloco);
                    const numeroBloco = blocoEncontrado?.numero || bloco;

                    return res.status(400).json({ 
                        ok: false, 
                        msg: `Unidade ${numeroUnidade} no bloco ${numeroBloco} não encontrada!` 
                    });
                }

                if (!unidadeExistente.ativo) {
                    const blocoEncontrado = await repoBloco.buscarPorId(bloco);
                    const numeroBloco = blocoEncontrado?.numero || bloco;

                    return res.status(400).json({ 
                        ok: false, 
                        msg: `A unidade ${numeroUnidade} no bloco ${numeroBloco} está desativada!` 
                    });
                }

    
                const pessoaUnidade = {
                    pessoa_id: id,
                    unidade_id: unidadeExistente.id,
                    responsavel: responsavel
                };
    
                await repoPessoaUnidade.associarPessoaUnidade(pessoaUnidade);
            }
    
            return res.status(200).json({ ok: true, msg: "Cadastro atualizado com sucesso!" });
    
        } catch (ex) {
            console.error("Erro na atualização:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    
    async buscarPorId(id) {
        try {
            console.log('id', id);

            const repo = new PessoaRepository();
            const pessoa = await repo.buscarPorId(id);

            console.log('pessoa', pessoa);
    
            if (!pessoa) {
                console.log("Pessoa não encontrada.");
                return null; 
            }
    
            return(pessoa);
        } catch (error) {
            console.error("Erro ao buscar pessoa por ID:", error);
            return null;
        }
    }

    async buscarPorCpf(req, res) {
        try {
            const { cpf } = req.params;
            if (!cpf) {
                return res.status(400).json({ ok: false, msg: "CPF não informado!" });
            }

            const repo = new PessoaRepository();
            const pessoa = await repo.obterPorCpf(cpf);

            if (!pessoa) {
                return res.status(404).json({ ok: false, msg: "Pessoa não encontrada!" });
            }

            return res.status(200).json({
                ok: true,
                id: pessoa.id,
                nome: pessoa.nome,
                cpf: pessoa.cpf
            });
            
        } catch (error) {
            console.error("Erro ao buscar pessoa por CPF:", error);
            return res.status(500).json({ ok: false, msg: "Erro interno do servidor" });
        }
    }

    async buscarPessoaVinculada(req, res) {
        try {
            const { cpf } = req.params;
            if (!cpf) {
                return res.status(400).json({ ok: false, msg: "CPF não informado!" });
            }

            const repo = new PessoaRepository();
            const pessoa = await repo.obterPorCpf(cpf);

            if (!pessoa) {
                return res.status(404).json({ ok: false, msg: "Pessoa não encontrada!" });
            }

            return res.status(200).json({
                ok: true,
                id: pessoa.id,
                nome: pessoa.nome,
                cpf: pessoa.cpf
            });
            
        } catch (error) {
            console.error("Erro ao buscar pessoa por CPF:", error);
            return res.status(500).json({ ok: false, msg: "Erro interno do servidor" });
        }
    }

    async desabilitar(req, res) {
        try {
          const { id } = req.body;
    
          if (!id) {
            return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
          }
    
          const repo = new PessoaRepository();
          const pessoaExistente = await repo.buscarPorId(id);
    
          if (!pessoaExistente) {
            return res.status(404).json({ msg: "Pessoa não encontrada!" });
          }
    
          pessoaExistente.ativo = false;
          const result = await repo.desabilitar(pessoaExistente);
          console.log("Pessoa desabilitada:", result);
    
          if (result) {
            return res.status(200).json({ ok: true, msg: "Pessoa desabilitada com sucesso!" });
          } else {
            return res.status(400).json({ok:false, msg: "Falha ao desabilitar pessoa!" });
          }
        } catch (ex) {
          console.error("Erro ao desabilitar pessoa:", ex);
          return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

     // Relatório
async filtrar(req, res, json = false) {
        let termo = req.params.termo;
        let filtro = req.params.filtro;

        let repo = new PessoaRepository();
        var lista = await repo.listarParaRelatorio(termo, filtro);
        if(!json)
        {
        res.render("pessoa/relatorio", 
          { 
            pessoas: lista
          });

        }
        else{
          res.json(lista);
        }
    }

}