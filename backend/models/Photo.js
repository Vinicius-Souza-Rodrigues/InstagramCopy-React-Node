
/*
const mongoose = require("mongoose")
const {Schema} = mongoose

const photoSchema = new Schema ({
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: mongoose.ObjectId,
    userName: String
}, {
    timestamps: true
})

const Photo = mongoose.model("Photo", photoSchema)

module.exports = Photo;
*/

const db = require("../config/db");

const PhotoModel = {
  // Buscar todas as fotos
  async findAll() {
    const result = await db.query("SELECT * FROM photos ORDER BY created_at DESC");
    return result.rows;
  },

  // Criar nova foto
  async create({ image, title, userId, userName }) {
    const result = await db.query(
      "INSERT INTO photos (image, title, user_id, user_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [image, title, userId, userName]
    );
    return result.rows[0];
  },

  // Buscar foto por ID
  async findById(id) {
    const result = await db.query("SELECT * FROM photos WHERE id = $1", [id]);
    return result.rows[0];
  },

  // Deletar foto
  async delete(id) {
    await db.query("DELETE FROM photos WHERE id = $1", [id]);
  },
};

module.exports = PhotoModel;
