exports.seed = async function(knex) {
  await knex('casos').del();

  await knex('casos').insert([
    {
      titulo: 'Roubo no centro',
      descricao: 'Investigação de roubo ocorrido no centro da cidade.',
      status: 'aberto',
      agente_id: 1
    },
    {
      titulo: 'Furto de veículo',
      descricao: 'Furto de veículo na zona sul.',
      status: 'solucionado',
      agente_id: 2
    }
  ]);
};