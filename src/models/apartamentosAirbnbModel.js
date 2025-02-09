const connection = require('./connection');

// Função para buscar todos os apartamentos
const getAllApartamentos = async () => {
  const [apartamentos] = await connection.execute('SELECT * FROM apartamentos');
  return apartamentos;
};

// Função para criar um novo apartamento
const createApartamento = async (apartamento) => {
  const { nome, predio_id, link_airbnb_calendario } = apartamento;
  const insertApartamentoQuery = `
    INSERT INTO apartamentos (nome, predio_id, link_airbnb_calendario) 
    VALUES (?, ?, ?)
  `;
  const values = [nome, predio_id, link_airbnb_calendario];

  try {
    const [result] = await connection.execute(insertApartamentoQuery, values);
    return { insertId: result.insertId };
  } catch (error) {
    console.error('Erro ao inserir apartamento:', error);
    throw error;
  }
};

// Função para buscar um apartamento pelo ID
const getApartamentoById = async (id) => {
  const query = 'SELECT * FROM apartamentos WHERE id = ?';
  const [apartamentos] = await connection.execute(query, [id]);

  if (apartamentos.length > 0) {
    return apartamentos[0];
  } else {
    return null;
  }
};

// Função para buscar apartamentos pelo ID do prédio
const getApartamentosByPredioId = async (predioId) => {
  const query = 'SELECT * FROM apartamentos WHERE predio_id = ?';
  const [apartamentos] = await connection.execute(query, [predioId]);
  return apartamentos;
};

// Função para atualizar um apartamento
const updateApartamento = async (apartamento) => {
  const { id, nome, predio_id, link_airbnb_calendario } = apartamento;
  const updateApartamentoQuery = `
    UPDATE apartamentos 
    SET nome = ?, predio_id = ?, link_airbnb_calendario = ?
    WHERE id = ?
  `;
  const values = [nome, predio_id, link_airbnb_calendario, id];

  try {
    const [result] = await connection.execute(updateApartamentoQuery, values);
    return result.affectedRows > 0; // Retorna true se o apartamento foi atualizado com sucesso
  } catch (error) {
    console.error('Erro ao atualizar apartamento:', error);
    throw error;
  }
};

// Função para deletar um apartamento pelo ID
const deleteApartamento = async (id) => {
  const deleteApartamentoQuery = 'DELETE FROM apartamentos WHERE id = ?';

  try {
    const [result] = await connection.execute(deleteApartamentoQuery, [id]);
    return result.affectedRows > 0; // Retorna true se o apartamento foi deletado com sucesso
  } catch (error) {
    console.error('Erro ao deletar apartamento:', error);
    throw error;
  }
};

module.exports = {
  getAllApartamentos,
  createApartamento,
  getApartamentoById,
  getApartamentosByPredioId,
  updateApartamento,
  deleteApartamento
};