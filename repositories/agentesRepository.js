const db = require('../db/db');

async function findAll() {
   try {
      return await db('agentes').select('*');
   } catch (error) {
      console.error('Erro ao buscar agentes:', error);
      throw error;
   }
}

async function findById(id) {
   try {
      return await db('agentes').where({ id }).first();
   } catch (error) {
      console.error('Erro ao buscar agente por ID:', error);
      throw error;
   }
}

async function createAgente(agente) {
   try {
      const [novoAgente] = await db('agentes').insert(agente).returning('*');
      return novoAgente;
   } catch (error) {
      console.error('Erro ao criar agente:', error);
      throw error;
   }
}

async function updateAgente(id, updatedAgente) {
   try {
      const { id: _, ...rest } = updatedAgente;
      const [agenteAtualizado] = await db('agentes').where({ id }).update(rest).returning('*');
      return agenteAtualizado;
   } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      throw error;
   }
}

async function patchAgente(id, updatedFields) {
   try {
      const [agenteAtualizado] = await db('agentes').where({ id }).update(updatedFields).returning('*');
      return agenteAtualizado;
   } catch (error) {
      console.error('Erro ao atualizar parcialmente agente:', error);
      throw error;
   }
}

async function deleteAgente(id) {
   try {
      return await db('agentes').where({ id }).del();
   } catch (error) {
      console.error('Erro ao deletar agente:', error);
      throw error;
   }
}

async function getAgenteByCargo(cargo) {
   try {
      return await db('agentes').whereRaw('LOWER(cargo) = ?', [cargo.toLowerCase()]);
   } catch (error) {
      console.error('Erro ao buscar agente por cargo:', error);
      throw error;
   }
}

async function findAllSortedByDataDeIncorporacao(order = "asc") {
   try {
      return await db('agentes').orderBy('dataDeIncorporacao', order);
   } catch (error) {
      console.error('Erro ao buscar agentes ordenados:', error);
      throw error;
   }
}

async function findByDataDeIncorporacaoRange(start, end) {
   try {
      return await db('agentes').whereBetween('dataDeIncorporacao', [start, end]);
   } catch (error) {
      console.error('Erro ao buscar agentes por intervalo de data:', error);
      throw error;
   }
}

module.exports = {
   findAll,
   findById,
   createAgente,
   updateAgente,
   patchAgente,
   deleteAgente,
   getAgenteByCargo,
   findAllSortedByDataDeIncorporacao,
   findByDataDeIncorporacaoRange,
};