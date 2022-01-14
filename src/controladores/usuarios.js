const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nome_loja) {
        return res.status(404).json("O campo nome_loja é obrigatório");
    }

    try {
        const quantidadeUsuarios = await knex().select("*").from("usuarios").where({ email });

        if (quantidadeUsuarios.rowCount > 0) {
            return res.status(400).json({ mensagem: "O email já existe" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await knex('usuarios').insert({
            nome: nome,
            email: email,
            senha: senhaCriptografada,
            nome_loja: nome_loja,
        }).returning('*');

        if (novoUsuario.length === 0) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}
const atualizarPerfil = async (req, res) => {
    const { usuario } = req;
    const dicionario = ["nome", "email", "senha", "nome_loja"];
    const valoresAtualizados = {};

    dicionario.forEach((x) => {
        if (req.body[x]) {
            valoresAtualizados[x] = req.body[x];
        }
    });
    if (Object.keys(valoresAtualizados).length === 0) {
        return res
            .status(404)
            .json("Informe ao menos um campo para atualizaçao do usuário");
    }

    try {
        const buscaUsuario = await knex('usuarios').where('id', usuario.id)
        if (buscaUsuario.length === 0) {
            return res.status(404).json('Usuário não encontrado');
        }
        if (valoresAtualizados['email']) {
            if (valoresAtualizados['email'] !== usuario.email) {
                const quantidadeUsuarios = await knex
                    .select("*")
                    .from("usuarios")
                    .where({ email: valoresAtualizados['email'] });
                if (quantidadeUsuarios.length > 0) {
                    return res.status(400).json("O email já existe");
                }
            }
        }
        if (valoresAtualizados['senha']) {
            valoresAtualizados['senha'] = await bcrypt.hash(req.body['senha'], 10);
        }

        const usuarioAtualizado = await knex('usuarios').where('id', usuario.id).update(valoresAtualizados);
        if (usuarioAtualizado.length === 0) {
            return res.status(400).json("O usuario não foi atualizado");
        }

        return res.status(200).json("Usuario foi atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}