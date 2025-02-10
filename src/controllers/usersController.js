const usersModel = require('../models/usersModel');

const getAllUsers = async (_request, response) => {
  try {
    const users = await usersModel.getAllUsers();
    return response.status(200).json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    return response.status(500).json({ error: 'Erro ao obter usuários' });
  }
};

const createUser = async (request, response) => {
  try {
    const createdUser = await usersModel.createUser(request.body);
    return response.status(201).json(createdUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return response.status(409).json({ error: error.message });
  }
};
 

const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    const result = await usersModel.loginUser(email,password);
    if (result) {
      // Autenticação bem-sucedida
      // Retorna o token e o usuário
      return response.status(200).json({ user: result.user, token: result.token });
    } else {
      // Autenticação falhou
      return response.status(401).json({ message: 'Login ou senha incorretos.' });
    }
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return response.status(500).json({ error: 'Erro ao realizar login' });
  }
};

const getUser = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await usersModel.getUser(id);

    if (user) {
      return response.status(200).json(user);
    } else {
      return response.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return response.status(500).json({ error: 'Erro ao obter usuário' });
  }
};


const updateUser = async (request, response) => {
  try {
    const { id } = request.params;
    const updatedUser = await usersModel.updateUser(id, request.body);
    return response.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return response.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};


const deleteUser = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedUser = await usersModel.deleteUser(id);
    if (deletedUser) {
      return response.status(200).json({ message: 'Usuário excluído com sucesso.' });
    } else {
      return response.status(404).json({ message: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return response.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
};
const createUsersBatch = async (request, response) => {
  try {
    const users = request.body; // Array de objetos com first_name, last_name, cpf, email
    const createdUsers = await usersModel.createUsersBatch(users);
    return response.status(201).json({ message: `${createdUsers.length} usuários criados com sucesso.` });
  } catch (error) {
    console.error('Erro ao criar usuários em lote:', error);
    return response.status(409).json({ error: error.message });
  }
};
module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  createUsersBatch
};