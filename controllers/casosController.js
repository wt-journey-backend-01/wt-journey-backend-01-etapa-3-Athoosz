const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const { errorResponse } = require("../utils/errorHandler");

async function getAllCasos(req, res) {
   try {
      const casos = await casosRepository.findAll();
      if (!casos || casos.length === 0) {
         return errorResponse(res, 404, "Nenhum caso encontrado");
      }
      res.status(200).json(casos);
   } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar casos", [{ error: error.message }]);
   }
}

async function getCasoById(req, res) {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return errorResponse(res, 400, "ID inválido: deve ser um número");
  }
  try {
    const caso = await casosRepository.findById(id);
    if (caso) {
      res.status(200).json(caso);
    } else {
      return errorResponse(res, 404, "Caso não encontrado", [
        { id: `O Caso com o id: ${id} não existe` },
      ]);
    }
  } catch (error) {
    return errorResponse(res, 500, "Erro ao buscar caso", [{ error: error.message }]);
  }
}

async function createCaso(req, res) {
   const novoCaso = req.body;

   if (
      !novoCaso ||
      typeof novoCaso !== "object" ||
      Array.isArray(novoCaso) ||
      Object.keys(novoCaso).length === 0
   ) {
      return errorResponse(
         res,
         400,
         "Payload inválido: deve ser um objeto com ao menos um campo para criação"
      );
   }

   // Validações
   if (!["aberto", "solucionado"].includes(novoCaso.status)) {
      return errorResponse(
         res,
         400,
         "O campo 'status' pode ser somente 'aberto' ou 'solucionado'",
         [{ status: "Status inválido" }]
      );
   }
   if (!novoCaso.titulo || novoCaso.titulo.trim() === "") {
      return errorResponse(res, 400, "O campo 'titulo' é obrigatório", [
         { field: "titulo", message: "Título é obrigatório" },
      ]);
   }
   if (!novoCaso.descricao || novoCaso.descricao.trim() === "") {
      return errorResponse(res, 400, "O campo 'descricao' é obrigatório", [
         { field: "descricao", message: "Descrição é obrigatória" },
      ]);
   }
   if (
      novoCaso.agente_id === undefined ||
      novoCaso.agente_id === null ||
      isNaN(Number(novoCaso.agente_id))
   ) {
      return errorResponse(res, 400, "O campo 'agente_id' é obrigatório e deve ser um número", [
         { field: "agente_id", message: "ID do agente é obrigatório" },
      ]);
   }

   // Verifica se o agente existe
   const agenteExiste = await agentesRepository.findById(novoCaso.agente_id);
   if (!agenteExiste) {
      return errorResponse(res, 404, "Agente não encontrado para o caso", [
         { agente_id: "Agente inexistente" },
      ]);
   }

   try {
      const casoCriado = await casosRepository.addCaso(novoCaso);
      res.status(201).json(casoCriado);
   } catch (error) {
      return errorResponse(res, 400, "Erro ao criar caso", [
         { field: "body", message: error.message },
      ]);
   }
}

async function updateCaso(req, res) {
   const { id } = req.params;
   const updatedCaso = req.body;

   if (
      !updatedCaso ||
      typeof updatedCaso !== "object" ||
      Array.isArray(updatedCaso) ||
      Object.keys(updatedCaso).length === 0
   ) {
      return errorResponse(
         res,
         400,
         "Payload inválido: deve ser um objeto com ao menos um campo para atualização"
      );
   }

   // Não permitir alteração do id
   if (updatedCaso.id && Number(updatedCaso.id) !== Number(id)) {
      return errorResponse(res, 400, "Não é permitido alterar o ID do caso");
   }

   const caso = await casosRepository.findById(id);
   if (!caso) {
      return errorResponse(res, 404, "Caso não encontrado");
   }

   // Validações
   if (!["aberto", "solucionado"].includes(updatedCaso.status)) {
      return errorResponse(
         res,
         400,
         "O campo 'status' pode ser somente 'aberto' ou 'solucionado'",
         [{ status: "Status inválido" }]
      );
   }
   if (!updatedCaso.titulo || updatedCaso.titulo.trim() === "") {
      return errorResponse(res, 400, "O campo 'titulo' é obrigatório", [
         { field: "titulo", message: "Título é obrigatório" },
      ]);
   }
   if (!updatedCaso.descricao || updatedCaso.descricao.trim() === "") {
      return errorResponse(res, 400, "O campo 'descricao' é obrigatório", [
         { field: "descricao", message: "Descrição é obrigatória" },
      ]);
   }
   if (
      updatedCaso.agente_id === undefined ||
      updatedCaso.agente_id === null ||
      isNaN(Number(updatedCaso.agente_id))
   ) {
      return errorResponse(res, 400, "O campo 'agente_id' é obrigatório e deve ser um número", [
         { field: "agente_id", message: "ID do agente é obrigatório" },
      ]);
   }

   // Verifica se o agente existe
   const agenteExiste = await agentesRepository.findById(updatedCaso.agente_id);
   if (!agenteExiste) {
      return errorResponse(res, 404, "Agente não encontrado para o caso", [
         { agente_id: "Agente inexistente" },
      ]);
   }

   try {
      const casoAtualizado = await casosRepository.updateCaso(id, updatedCaso);
      res.status(200).json(casoAtualizado);
   } catch (error) {
      return errorResponse(res, 400, "Erro ao atualizar caso", [
         { field: "body", message: error.message },
      ]);
   }
}

async function patchCaso(req, res) {
   const { id } = req.params;
   const { id: newId, ...updatedFields } = req.body;

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

   if (newId && Number(newId) !== Number(id)) {
      return errorResponse(res, 400, "Não é permitido alterar o ID do caso");
   }

   const caso = await casosRepository.findById(id);
   if (!caso) {
      return errorResponse(res, 404, "Caso não encontrado");
   }

   if (
      updatedFields.titulo !== undefined &&
      updatedFields.titulo.trim() === ""
   ) {
      return errorResponse(res, 400, "O campo 'titulo' não pode ser vazio", [
         { titulo: "Título inválido" },
      ]);
   }
   if (
      updatedFields.descricao !== undefined &&
      updatedFields.descricao.trim() === ""
   ) {
      return errorResponse(res, 400, "O campo 'descricao' não pode ser vazio", [
         { descricao: "Descrição inválida" },
      ]);
   }
   if (
      updatedFields.status !== undefined &&
      !["aberto", "solucionado"].includes(updatedFields.status)
   ) {
      return errorResponse(
         res,
         400,
         "O campo 'status' deve ser 'aberto' ou 'solucionado'",
         [{ status: "Status inválido" }]
      );
   }
   if (updatedFields.agente_id !== undefined) {
      if (
         updatedFields.agente_id === null ||
         updatedFields.agente_id === "" ||
         isNaN(Number(updatedFields.agente_id))
      ) {
         return errorResponse(
            res,
            400,
            "O campo 'agente_id' não pode ser vazio e deve ser um número",
            [{ agente_id: "Agente_id inválido" }]
         );
      }
      const agenteExiste = await agentesRepository.findById(updatedFields.agente_id);
      if (!agenteExiste) {
         return errorResponse(res, 400, "O agente_id informado não existe", [
            { agente_id: "Agente não encontrado" },
         ]);
      }
   }

   try {
      const casoAtualizado = await casosRepository.patchCaso(id, updatedFields);
      res.status(200).json(casoAtualizado);
   } catch (error) {
      return errorResponse(res, 400, "Erro ao atualizar caso", [
         { field: "body", message: error.message },
      ]);
   }
}

async function deleteCaso(req, res) {
   const { id } = req.params;

   const caso = await casosRepository.findById(id);
   if (!caso) {
      return errorResponse(res, 404, "Caso não encontrado");
   }

   try {
      await casosRepository.deleteCaso(id);
      res.status(204).send();
   } catch (error) {
      return errorResponse(res, 400, "Erro ao deletar caso", [
         { field: "id", message: error.message },
      ]);
   }
}

async function getCasosByAgenteId(req, res) {
   const { agente_id } = req.query;

   if (!agente_id || isNaN(Number(agente_id))) {
      return errorResponse(
         res,
         400,
         "A query string 'agente_id' deve ser um número válido"
      );
   }

   try {
      const casos = await casosRepository.findByAgenteId(agente_id);
      if (!casos || casos.length === 0) {
         return errorResponse(res, 404, "Nenhum caso encontrado para este agente");
      }
      res.status(200).json(casos);
   } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar casos por agente", [{ error: error.message }]);
   }
}

async function getCasosByStatus(req, res) {
   const { status } = req.query;
   if (!status || typeof status !== "string" || status.trim() === "") {
      return errorResponse(
         res,
         400,
         "A query string 'status' é obrigatória para pesquisa"
      );
   }
   const statusLower = status.toLowerCase();
   if (!["aberto", "solucionado"].includes(statusLower)) {
      return errorResponse(
         res,
         400,
         "O status deve ser 'aberto' ou 'solucionado'"
      );
   }
   try {
      const casos = await casosRepository.findByStatus(statusLower);
      if (!casos || casos.length === 0) {
         return errorResponse(res, 404, "Nenhum caso encontrado com este status");
      }
      res.status(200).json(casos);
   } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar casos por status", [{ error: error.message }]);
   }
}

async function getCasosByTituloOrDescricao(req, res) {
   const { q } = req.query;
   if (!q || typeof q !== "string" || q.trim() === "") {
      return errorResponse(
         res,
         400,
         "A query string 'q' é obrigatória para pesquisa"
      );
   }
   try {
      const casos = await casosRepository.findByTituloOrDescricao(q);
      if (!casos || casos.length === 0) {
         return errorResponse(
            res,
            404,
            "Nenhum caso encontrado com este título ou descrição"
         );
      }
      res.status(200).json(casos);
   } catch (error) {
      return errorResponse(res, 500, "Erro ao buscar casos por título/descrição", [{ error: error.message }]);
   }
}

module.exports = {
   getAllCasos,
   getCasoById,
   createCaso,
   updateCaso,
   patchCaso,
   deleteCaso,
   getCasosByAgenteId,
   getCasosByStatus,
   getCasosByTituloOrDescricao,
};