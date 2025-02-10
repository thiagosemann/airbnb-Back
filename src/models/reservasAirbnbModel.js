const connection = require('./connection');
const apartamentosModel = require('./apartamentosAirbnbModel');
const axios = require('axios');
const ical = require('ical.js');
const moment = require('moment-timezone');


// Função para buscar todas as reservas com o nome do apartamento
const getAllReservas = async () => {
  const query = `
    SELECT r.*, 
           COALESCE(a.nome, 'Apartamento não encontrado') AS apartamento_nome
    FROM reservas r
    LEFT JOIN apartamentos a ON r.apartamento_id = a.id
  `;
  const [reservas] = await connection.execute(query);
  return reservas;
};


// Função para criar reserva (atualizada com cod_reserva)
const createReserva = async (reserva) => {
  const { apartamento_id, description, end_data, start_date, Observacoes, cod_reserva, link_reserva,form_answered, credencial_made, informed,check_in,check_out } = reserva;
  const insertReservaQuery = `
    INSERT INTO reservas 
    (apartamento_id, description, end_data, start_date, Observacoes, cod_reserva, link_reserva,form_answered, credencial_made, informed,check_in,check_out) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [apartamento_id, description, end_data, start_date, Observacoes, cod_reserva, link_reserva,form_answered, credencial_made, informed,check_in,check_out];

  try {
    const [result] = await connection.execute(insertReservaQuery, values);

    return { insertId: result.insertId };
  } catch (error) {
    console.error('Erro ao inserir reserva:', error);
    throw error;
  }
};

const syncAirbnbReservations = async () => {
  try {
    const apartamentos = await apartamentosModel.getAllApartamentos();
    const apartmentsComLinks = apartamentos.filter(a => a.link_airbnb_calendario);
    // Calcula a data limite (hoje + 3 meses)
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() + 3);

    for (const apartamento of apartmentsComLinks) {
      try {
        const response = await axios.get(apartamento.link_airbnb_calendario);
        const jcalData = new ical.parse(response.data);
        const comp = new ical.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        for (const vevent of vevents) {
          const event = {
            summary: vevent.getFirstPropertyValue('summary'),
            startDate: moment(vevent.getFirstPropertyValue('dtstart').toString()).tz('America/Sao_Paulo').toDate(),
            endDate: moment(vevent.getFirstPropertyValue('dtend').toString()).tz('America/Sao_Paulo').toDate(),
            description: vevent.getFirstPropertyValue('description') || '',
            uid: vevent.getFirstPropertyValue('uid'),
          };

          // Verifica se a data de início do evento está dentro do período permitido (3 meses)
          if (event.startDate > dataLimite) {
            continue;
          }

          let cod_reserva;
          let link_reserva;

          if (event.description) {
            const codReservaMatch = event.description.match(/\/details\/([A-Z0-9]+)/);
            const linkMatch = event.description.match(/Reservation URL:\s*(https:\/\/www\.airbnb\.com\/hosting\/reservations\/details\/[A-Z0-9]+)/);
            cod_reserva = codReservaMatch ? codReservaMatch[1] : null;
            link_reserva = linkMatch ? linkMatch[1] : null;
          } else {
            // Formata a endDate e combina com o nome do apartamento
            const formatDate = (date) => {
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}-${month}-${year}`;
            };

            cod_reserva = `${apartamento.nome}/${formatDate(event.endDate)}`;
            link_reserva = "https://www.admforest.com.br/";
          }

          if (!cod_reserva) {
            console.log('Não foi possível gerar código de reserva:', event);
            continue;
          }
          if (!link_reserva) {
            console.log('Não foi possível gerar link de reserva:', event);
            continue;
          }

          // Verificação de existência
          const [existing] = await connection.execute(
            'SELECT id FROM reservas WHERE cod_reserva = ?',
            [cod_reserva]
          );

          if (existing.length === 0) {
            await createReserva({
              apartamento_id: apartamento.id,
              description: event.summary,
              start_date: event.startDate,
              end_data: event.endDate,
              Observacoes: '',
              cod_reserva: cod_reserva,
              link_reserva: link_reserva,
              form_answered:false,
              credencial_made:false,
              informed:false,
              check_in:"15:00",
              check_out:"11:00",
            });
          }
        }
      } catch (error) {
        console.error(`Erro no apartamento ${apartamento.id}:`, error.message);
      }
    }
    return { success: true, message: 'Sincronização concluída' };
  } catch (error) {
    console.error('Erro geral na sincronização:', error.message);
    throw error;
  }
};

syncAirbnbReservations();

// Função para buscar uma reserva pelo ID
const getReservaById = async (id) => {
  const query = 'SELECT * FROM reservas WHERE id = ?';
  const [reservas] = await connection.execute(query, [id]);

  if (reservas.length > 0) {
    return reservas[0];
  } else {
    return null;
  }
};

// Função para buscar reservas pelo ID do apartamento
const getReservasByApartamentoId = async (apartamentoId) => {
  const query = 'SELECT * FROM reservas WHERE apartamento_id = ?';
  const [reservas] = await connection.execute(query, [apartamentoId]);
  return reservas;
};

const updateReserva = async (reserva) => {
  const {
    id,
    apartamento_id,
    description,
    end_data,
    start_date,
    Observacoes,
    cod_reserva,
    link_reserva,
    form_answered,
    credencial_made,
    informed,
    check_in,
    check_out,
  } = reserva;

  const updateReservaQuery = `
    UPDATE reservas 
    SET apartamento_id = ?, description = ?, end_data = ?, start_date = ?, Observacoes = ?, cod_reserva = ?, link_reserva = ?, form_answered = ?, credencial_made = ?, informed = ?, check_in = ?, check_out = ?
    WHERE id = ?
  `;

  // Certifique-se de que todos os valores estejam na ordem correta
  const values = [
    apartamento_id,
    description,
    end_data,
    start_date,
    Observacoes,
    cod_reserva,
    link_reserva,
    form_answered,
    credencial_made,
    informed,
    check_in,
    check_out,
    id, // O ID deve ser o último valor, pois corresponde ao WHERE id = ?
  ];

  try {
    const [result] = await connection.execute(updateReservaQuery, values);
    return result.affectedRows > 0; // Retorna true se a reserva foi atualizada com sucesso
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    throw error;
  }
};

// Função para deletar uma reserva pelo ID
const deleteReserva = async (id) => {
  const deleteReservaQuery = 'DELETE FROM reservas WHERE id = ?';

  try {
    const [result] = await connection.execute(deleteReservaQuery, [id]);
    return result.affectedRows > 0; // Retorna true se a reserva foi deletada com sucesso
  } catch (error) {
    console.error('Erro ao deletar reserva:', error);
    throw error;
  }
};

module.exports = {
  getAllReservas,
  createReserva,
  getReservaById,
  getReservasByApartamentoId,
  updateReserva,
  deleteReserva
};
