const db = require('../db/db');

async function findAll() {
    return await db('casos').select('*');
}

async function findById(id) {
    return await db('casos').where({ id }).first();
}

async function addCaso(caso) {
    const [novoCaso] = await db('casos').insert(caso).returning('*');
    return novoCaso;
}

async function updateCaso(id, updatedCaso) {
    const { id: _, ...rest } = updatedCaso;
    const [casoAtualizado] = await db('casos').where({ id }).update(rest).returning('*');
    return casoAtualizado;
}

async function patchCaso(id, updatedFields) {
    const [casoAtualizado] = await db('casos').where({ id }).update(updatedFields).returning('*');
    return casoAtualizado;
}

async function deleteCaso(id) {
    return await db('casos').where({ id }).del();
}

async function findByAgenteId(agenteId) {
    return await db('casos').where({ agente_id: agenteId });
}

async function findByStatus(status) {
    return await db('casos').whereRaw('LOWER(status) = ?', [status.toLowerCase()]);
}

async function findByTituloOrDescricao(query) {
    const q = `%${query.toLowerCase()}%`;
    return await db('casos')
        .whereRaw('LOWER(titulo) LIKE ?', [q])
        .orWhereRaw('LOWER(descricao) LIKE ?', [q]);
}

module.exports = {
    findAll,
    findById,
    findByAgenteId,
    addCaso,
    updateCaso,
    patchCaso,
    deleteCaso,
    findByStatus,
    findByTituloOrDescricao
};