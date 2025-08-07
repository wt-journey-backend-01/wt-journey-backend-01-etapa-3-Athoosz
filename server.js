const express = require("express");
const app = express();
const PORT = 3000;
const casosRoutes = require("./routes/casosRoutes");
const agentesRoutes = require("./routes/agentesRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

app.use(express.json());
app.use("/casos", casosRoutes);
app.use("/agentes", agentesRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
   console.log(
      `Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`
   );
   console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});
