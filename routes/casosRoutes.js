const express = require("express");
const casosRouter = express.Router();
const casosController = require("../controllers/casosController");

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Lista todos os casos
 *     responses:
 *       200:
 *         description: Lista de casos
 *       404:
 *         description: Nenhum caso encontrado
 */
casosRouter.get("/", casosController.getAllCasos);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Obtém um caso específico pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do caso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do caso
 *       404:
 *         description: Caso não encontrado
 */
casosRouter.get("/:id", casosController.getCasoById);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Erro ao criar caso
 */
casosRouter.post("/", casosController.createCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza um caso existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do caso
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar caso
 *       404:
 *         description: Caso não encontrado
 */
casosRouter.put("/:id", casosController.updateCaso);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um caso existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do caso
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar caso
 *       404:
 *         description: Caso não encontrado
 */
casosRouter.patch("/:id", casosController.patchCaso);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Deleta um caso existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do caso
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Caso deletado com sucesso
 *       400:
 *         description: Erro ao deletar caso
 *       404:
 *         description: Caso não encontrado
 */
casosRouter.delete("/:id", casosController.deleteCaso);

/**
 * @swagger
 * /casos/agent:
 *   get:
 *     summary: Obtém casos por ID do agente
 *     parameters:
 *       - in: query
 *         name: uuid
 *         required: true
 *         description: UUID do agente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de casos para o agente
 *       404:
 *         description: Nenhum caso encontrado para este agente
 */
casosRouter.get("/agent", casosController.getCasosByAgenteId);

/**
 * @swagger
 * /casos/status:
 *   get:
 *     summary: Obtém casos por status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         description: Status do caso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de casos com o status especificado
 *       404:
 *         description: Nenhum caso encontrado com este status
 */
casosRouter.get("/status", casosController.getCasosByStatus);

/**
 * @swagger
 * /casos/search:
 *   get:
 *     summary: Pesquisa casos por título ou descrição (full-text)
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Palavra-chave para pesquisa no título ou descrição
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de casos encontrados
 *       404:
 *         description: Nenhum caso encontrado
 */
casosRouter.get("/search", casosController.getCasosByTituloOrDescricao);

module.exports = casosRouter;
