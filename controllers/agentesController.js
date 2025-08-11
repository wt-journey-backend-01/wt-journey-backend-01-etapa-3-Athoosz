const agentesRepository = require("../repositories/agentesRepository");
const { errorResponse } = require("../utils/errorHandler");
const { isValidDate, isFutureDate } = require("../utils/validators");

async function getAllAgentes(req, res) {
   const { sort, order = "asc", startDate, endDate } = req.query;
   try {
      let agentes;
      if (startDate && endDate) {
         if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return errorResponse(
               res,
               400,
               "Datas inválidas. Use o formato YYYY-MM-DD."
            );
         }
         if (new Date(startDate) > new Date(endDate)) {
            return errorResponse(
               res,
               400,
               "A data inicial não pode ser maior que a data final."
            );
         }
         agentes = await agentesRepository.findByDataDeIncorporacaoRange(
            startDate,
            endDate
         );
      } else if (sort === "dataDeIncorporacao") {
         agentes = await agentesRepository.findAllSortedByDataDeIncorporacao(
            order
         );
      } else {
         agentes = await agentesRepository.findAll();
      }
      if (!agentes || agentes.length === 0) {
         return errorResponse(res, 404, "Nenhum agente encontrado");
      }
      res.status(200).json(agentes);
   } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar agentes", [
         { error: error.message },
      ]);
   }
}

async function getAgenteById(req, res) {
   const { id } = req.params;
   if (isNaN(Number(id))) {
      return errorResponse(res, 400, "ID inválido: deve ser um número");
   }
   try {
      const agente = await agentesRepository.findById(id);
      if (agente) {
         res.status(200).json(agente);
      } else {
         return errorResponse(res, 404, "Agente não encontrado", [
            { id: `O Agente com o id: ${id} não existe` },
         ]);
      }
   } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar agente", [
         { error: error.message },
      ]);
   }
}

async function createAgente(req, res) {
   const novoAgente = req.body;

   if (
      !novoAgente ||
      typeof novoAgente !== "object" ||
      Array.isArray(novoAgente) ||
      Object.keys(novoAgente).length === 0
   ) {
      return errorResponse(
         res,
         400,
         "Payload inválido: deve ser um objeto com ao menos um campo para criação"
      );
   }

   if (!novoAgente.nome || novoAgente.nome.trim() === "") {
      return errorResponse(res, 400, "O campo 'nome' é obrigatório", [
         { nome: "Nome é obrigatório" },
      ]);
   }
   if (!isValidDate(novoAgente.dataDeIncorporacao)) {
      return errorResponse(
         res,
         400,
         "O campo 'dataDeIncorporacao' deve ser uma data válida no formato YYYY-MM-DD",
         [{ dataDeIncorporacao: "Data inválida" }]
      );
   }
   if (isFutureDate(novoAgente.dataDeIncorporacao)) {
      return errorResponse(
         res,
         400,
         "A data de incorporação não pode ser no futuro",
         [{ dataDeIncorporacao: "Data futura não permitida" }]
      );
   }
   if (!novoAgente.cargo || novoAgente.cargo.trim() === "") {
      return errorResponse(res, 400, "O campo 'cargo' é obrigatório", [
         { cargo: "Cargo é obrigatório" },
      ]);
   }

   try {
      const agenteCriado = await agentesRepository.createAgente(novoAgente);
      return res.status(201).json(agenteCriado);
   } catch (error) {
      return errorResponse(res, 400, "Erro ao criar agente", [
         { error: error.message },
      ]);
   }
}

async function updateAgente(req, res) {
   const { id } = req.params;
   const { id: newId, ...updatedAgente } = req.body;
   if (isNaN(Number(id))) {
      return errorResponse(res, 400, "ID inválido: deve ser um número");
   }
   if (
      !updatedAgente ||
      typeof updatedAgente !== "object" ||
      Array.isArray(updatedAgente) ||
      Object.keys(updatedAgente).length === 0
   ) {
      return errorResponse(
         res,
         400,
         "Payload inválido: deve ser um objeto com ao menos um campo para atualização"
      );
   }

   const agenteExiste = await agentesRepository.findById(id);
   if (!agenteExiste) {
      return errorResponse(res, 404, "Agente não encontrado");
   }

   if (newId && Number(newId) !== Number(id)) {
      return errorResponse(res, 400, "Não é permitido alterar o ID do agente");
   }

   if (!updatedAgente.nome || updatedAgente.nome.trim() === "") {
      return errorResponse(res, 400, "O campo 'nome' é obrigatório", [
         { nome: "Nome é obrigatório" },
      ]);
   }
   if (!isValidDate(updatedAgente.dataDeIncorporacao)) {
      return errorResponse(
         res,
         400,
         "O campo 'dataDeIncorporacao' deve ser uma data válida no formato YYYY-MM-DD",
         [{ dataDeIncorporacao: "Data inválida" }]
      );
   }
   if (isFutureDate(updatedAgente.dataDeIncorporacao)) {
      return errorResponse(
         res,
         400,
         "A data de incorporação não pode ser no futuro",
         [{ dataDeIncorporacao: "Data futura não permitida" }]
      );
   }
   if (!updatedAgente.cargo || updatedAgente.cargo.trim() === "") {
      return errorResponse(res, 400, "O campo 'cargo' é obrigatório", [
         { cargo: "Cargo é obrigatório" },
      ]);
   }

   try {
      const agenteAtualizado = await agentesRepository.updateAgente(id, updatedAgente);
      return res.status(200).json(agenteAtualizado);
   } catch (error) {
      return errorResponse(res, 400, "Erro ao atualizar agente", [
         { error: error.message },
      ]);
   }
}

async function deleteAgente(req, res) {
   const { id } = req.params;
   if (isNaN(Number(id))) {
      return errorResponse(res, 400, "ID inválido: deve ser um número");
   }

   const agenteExiste = await agentesRepository.findById(id);
   if (!agenteExiste) {
      return errorResponse(res, 404, "Agente não encontrado");
   }

   try {
      await agentesRepository.deleteAgente(id);
      res.status(204).send();
   } catch (error) {
      return errorResponse(res, 400, "Erro ao deletar agente", [
         { field: "id", message: error.message },
      ]);
   }
}

async function patchAgente(req, res) {
   const { id } = req.params;
   const { id: newId, ...updatedFields } = req.body;

   if (isNaN(Number(id))) {
      return errorResponse(res, 400, "ID inválido: deve ser um número");
   }
   if (
      !updatedFields ||
      typeof updatedFields !== "object" ||
      Array.isArray(updatedFields) ||
      Object.keys(updatedFields).length === 0
   ) {
      return errorResponse(
         res,
         400,
         "Payload inválido: deve ser um objeto com ao menos um campo para atualização"
      );
   }

   const agenteExiste = await agentesRepository.findById(id);
   if (!agenteExiste) {
      return errorResponse(res, 404, "Agente não encontrado");
   }

   if (newId && Number(newId) !== Number(id)) {
      return errorResponse(res, 400, "Não é permitido alterar o ID do agente");
   }

   if (updatedFields.nome !== undefined && updatedFields.nome.trim() === "") {
      return errorResponse(res, 400, "O campo 'nome' não pode ser vazio", [
         { nome: "Nome inválido" },
      ]);
   }
   if (updatedFields.dataDeIncorporacao !== undefined) {
      if (!isValidDate(updatedFields.dataDeIncorporacao)) {
         return errorResponse(
            res,
            400,
            "O campo 'dataDeIncorporacao' deve ser uma data válida no formato YYYY-MM-DD",
            [{ dataDeIncorporacao: "Data inválida" }]
         );
      }
      if (isFutureDate(updatedFields.dataDeIncorporacao)) {
         return errorResponse(
            res,
            400,
            "A data de incorporação não pode ser no futuro",
            [{ dataDeIncorporacao: "Data futura não permitida" }]
         );
      }
   }
   if (updatedFields.cargo !== undefined && updatedFields.cargo.trim() === "") {
      return errorResponse(res, 400, "O campo 'cargo' não pode ser vazio", [
         { cargo: "Cargo inválido" },
      ]);
   }

   try {
      const agenteAtualizado = await agentesRepository.patchAgente(
         id,
         updatedFields
      );
      res.status(200).json(agenteAtualizado);
   } catch (error) {
      return errorResponse(res, 400, "Erro ao atualizar agente", [
         { field: "body", message: error.message },
      ]);
   }
}

async function getAgentesByCargo(req, res) {
   const { cargo } = req.params;
   try {
      const agentes = await agentesRepository.getAgenteByCargo(cargo);
      if (!agentes || agentes.length === 0) {
         return errorResponse(
            res,
            404,
            "Nenhum agente encontrado com este cargo"
         );
      }
      res.status(200).json(agentes);
   } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar agentes por cargo", [
         { error: error.message },
      ]);
   }
}

module.exports = {
   getAllAgentes,
   getAgenteById,
   createAgente,
   updateAgente,
   deleteAgente,
   patchAgente,
   getAgentesByCargo,
};
