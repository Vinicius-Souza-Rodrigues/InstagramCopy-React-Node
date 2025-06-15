const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const User = require("../models/User");
const db = require("../config/db");

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.buscarUsuarioPorEmail(email);
    if (existingUser) {
      return res.status(422).json({ errors: ["Por favor, utilize outro email!"] });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.criarUsuario({
      name,
      email,
      password: passwordHash,
      profileImage: "",
      bio: "",
    });

    return res.status(201).json({
      id: newUser.id,
      token: generateToken(newUser.id),
    });

  } catch (error) {
    console.error("Erro ao registrar:", error);
    return res.status(500).json({ errors: ["Erro no servidor."] });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.buscarUsuarioPorEmail(email);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(422).json({ errors: ["Senha inválida!"] });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profile_image,
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ errors: ["Erro no servidor."] });
  }
};

const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

const update = async (req, res) => {
  const { name, password, bio } = req.body;
  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser.id);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    const updatedFields = {
      name: name || user.name,
      bio: bio || user.bio,
      profileImage: profileImage || user.profile_image,
    };

    if (password) {
      const salt = await bcrypt.genSalt();
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(updatedFields)) {
      const column = key === "profileImage" ? "profile_image" : key;
      fields.push(`${column} = $${index}`);
      values.push(value);
      index++;
    }

    values.push(reqUser.id);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, name, email, bio, profile_image
    `;

    const result = await db.query(query, values);
    const updatedUser = result.rows[0];

    res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profileImage: updatedUser.profile_image,
    });

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ errors: ["Erro no servidor."] });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado"] });
    }

    delete user.password;

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    return res.status(500).json({ errors: ["Erro no servidor"] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
