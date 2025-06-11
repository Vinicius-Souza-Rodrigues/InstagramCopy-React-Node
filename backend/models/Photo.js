const db = require("../config/db");

const PhotoModel = {
  // Buscar todas as fotos
  async findAll() {
    const result = await db.query("SELECT * FROM photos ORDER BY created_at DESC");
    return result.rows;
  },

  // Criar nova foto
  async criarFoto({ image, title, userId, userName }) {
    const result = await db.query(
      "INSERT INTO photos (image, title, user_id, user_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [image, title, userId, userName]
    );
    return result.rows[0];
  },

  // Buscar foto por ID
  async buscarFotoPorId(id) {
    const result = await db.query("SELECT * FROM photos WHERE id = $1", [id]);
    return result.rows[0];
  },

  // Deletar foto
  async deletarFoto(id) {
    await db.query("DELETE FROM photos WHERE id = $1", [id]);
  },

  // Bucas pelo usuario
  async findByUserId(userId) {
  const result = await db.query(
    "SELECT * FROM photos WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
},

async findById(id) {
  const result = await db.query("SELECT * FROM photos WHERE id = $1", [id]);
  return result.rows[0];
},

async update(id, { title }) {
  const result = await db.query(
    "UPDATE photos SET title = $1 WHERE id = $2 RETURNING *",
    [title, id]
  );
  return result.rows[0];
},

// Adiciona um like
async addLike(photoId, userId) {
  const result = await db.query(
    "UPDATE photos SET likes = array_append(likes, $1) WHERE id = $2 RETURNING *",
    [userId, photoId]
  );
  return result.rows[0];
},

async addComment(photoId, commentData) {
  const result = await db.query(
    `UPDATE photos
     SET comments = comments || $1::jsonb
     WHERE id = $2
     RETURNING *`,
    [JSON.stringify([commentData]), photoId]
  );

  return result.rows[0];
},

async searchByTitle(query) {
  const result = await db.query(
    "SELECT * FROM photos WHERE title ILIKE $1 ORDER BY created_at DESC",
    [`%${query}%`]
  );
  return result.rows;
}

};

module.exports = PhotoModel;
