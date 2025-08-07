const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Departamento de Polícia',
      version: '1.0.0',
      description: 'Documentação da API seguindo o padrão OAS',
    },
  },
  apis: [
    './routes/*.js', 
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;