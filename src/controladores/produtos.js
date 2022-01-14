const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        const params = [];

        let produtos = await knex('produtos').where('usuarios.id', usuario.id);

        if (categoria) {
            produtos.where('categoria', 'ilike', ...params)
            params.push(`%${categoria}%`);
        }
        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const adquirirProdutos = await knex('produtos').where({ usuario_id: usuario.id, id: id })

        if (adquirirProdutos.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(adquirirProdutos[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {
        const produto = await knex('produtos').insert({ usuario_id: usuario.id, nome, estoque, preco, categoria, descricao, imagem });

        if (produto.length === 0) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const dicionario = ['nome', 'estoque', 'preco', 'categoria', 'descricao', 'imagem'];
    const valoresAtualizados = {};

    dicionario.forEach(x => {
        if (req.body[x]) {
            valoresAtualizados[x] = req.body[x];
        }
    });

    if (Object.keys(valoresAtualizados).length === 0) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {

        const produto = await knex('produtos').where({ id, usuario_id: usuario.id });

        if (produto.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtualizado = await knex('produtos').where({ id, usuario_id: usuario.id }).update(valoresAtualizados);

        if (!produtoAtualizado) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const encontrarProduto = await knex('produtos').where({ usuario_id: usuario.id, id })

        if (encontrarProduto.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex('produto').delete().where('id', id).returning();

        if (produtoExcluido.length === 0) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}