/*
const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema)

module.exports = User
*/

const db = require("../config/db");

const UserModel = {
  // Criar novo usuário
  async criarUsuario({ name, email, password, profileImage, bio }) {
    const result = await db.query(
      "INSERT INTO users (name, email, password, profile_image, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, password, profileImage, bio]
    );
    return result.rows[0];
  },

  // Buscar usuário por email
  async buscarUsuarioPorEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  },

  // Buscar usuário por ID
  async findById(id) {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },
};

module.exports = UserModel;
