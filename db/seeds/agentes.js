exports.seed = async function(knex) {
  await knex('casos').del();
  await knex('agentes').del();

  await knex('agentes').insert([
    {
      nome: 'João Silva',
      dataDeIncorporacao: '2020-01-15',
      cargo: 'Investigador'
    },
    {
      nome: 'Maria Souza',
      dataDeIncorporacao: '2019-05-10',
      cargo: 'Delegada'
    }
  ]);
};