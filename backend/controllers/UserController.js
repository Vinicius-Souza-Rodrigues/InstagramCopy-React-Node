/*
const User = require("../models/User")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: "7d",
    });
};

// Register user and sign in
const register = async(req, res) => {

    const {name, email, password} = req.body

    //check if user exists
    const user = await User.findOne({email})

    if (user) {
        res.status(422).json({errors: ["Por f avor, utilize outro email!"]})
        return
    }

    // Generate password hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    //iF user was created sucessfuly = token
    if (!newUser) {
        res.status(422).json({errors: ["houve um erro!"]})

        res.status(201).json({
            _id: newUser._id,
            token: generateToken(newUser._id),
        })
    }
    
};

module.exports = {
    register,
}
*/
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Importa funções do model
const {
  buscarUsuarioPorEmail,
  criarUsuario
} = require("../models/User");

// Gera token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Registro
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se já existe usuário
    const existingUser = await buscarUsuarioPorEmail(email);
    if (existingUser) {
      return res.status(422).json({ errors: ["Por favor, utilize outro email!"] });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Cria usuário
    const newUser = await criarUsuario({
      name,
      email,
      password: passwordHash,
      profileImage: "", // valor padrão
      bio: ""
    });

    // Se tudo ok, retorna token
    return res.status(201).json({
      id: newUser.id,
      token: generateToken(newUser.id),
    });

  } catch (error) {
    console.error("Erro ao registrar:", error);
    return res.status(500).json({ errors: ["Erro no servidor."] });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await buscarUsuarioPorEmail(email);

    // Checar se usuário existe
    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(422).json({ errors: ["Senha inválida!"] });
    }

    // Retorna dados e token
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

module.exports = {
  register,
  login,
};

