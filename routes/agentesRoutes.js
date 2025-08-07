const express = require("express");
const agentesRouter = express.Router();
const agentesController = require("../controllers/agentesController");

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Lista todos os agentes
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [dataDeIncorporacao]
 *         description: Ordena os agentes pela data de incorporação.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Define a ordem da ordenação (ascendente ou descendente).
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtrar agentes (YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar agentes (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Lista de agentes
 *       404:
 *         description: Nenhum agente encontrado
 */
agentesRouter.get("/", agentesController.getAllAgentes);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Obtém um agente específico pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do agente
 *       404:
 *         description: Agente não encontrado
 */
agentesRouter.get("/:id", agentesController.getAgenteById);

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *       400:
 *         description: Erro ao criar agente
 */
agentesRouter.post("/", agentesController.createAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza um agente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente
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
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar agente
 *       404:
 *         description: Agente não encontrado
 */
agentesRouter.put("/:id", agentesController.updateAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um agente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente
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
 *         description: Agente atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar agente
 *       404:
 *         description: Agente não encontrado
 */
agentesRouter.patch("/:id", agentesController.patchAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Deleta um agente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agente
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Agente deletado com sucesso
 *       400:
 *         description: Erro ao deletar agente
 *       404:
 *         description: Agente não encontrado
 */
agentesRouter.delete("/:id", agentesController.deleteAgente);

/**
 * @swagger
 * /agentes/cargo/{cargo}:
 *   get:
 *     summary: Obtém agentes por cargo
 *     parameters:
 *       - in: path
 *         name: cargo
 *         required: true
 *         description: Cargo do agente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de agentes com o cargo especificado
 *       404:
 *         description: Nenhum agente encontrado com este cargo
 */
agentesRouter.get("/cargo/:cargo", agentesController.getAgentesByCargo);

module.exports = agentesRouter;