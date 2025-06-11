const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const User = require("../models/User");

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Verifica se existe token
  if (!token) {
    return res.status(401).json({ errors: ["Acesso negado"] });
  }

  try {
    // Verifica e decodifica o token
    const verified = jwt.verify(token, jwtSecret);

    // Busca usuário no PostgreSQL pelo ID
    const user = await User.findById(verified.id);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado"] });
    }

    // Remove a senha antes de continuar
    delete user.password;

    req.user = user;

    next();
  } catch (error) {
    console.error("Erro no authGuard:", error);
    res.status(401).json({ errors: ["Token inválido"] });
  }
};

module.exports = authGuard;
