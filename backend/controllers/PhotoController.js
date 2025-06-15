const Photo = require("../models/Photo");
const User = require("../models/User");

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file ? req.file.filename : null;

  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser.id);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }

    const newPhoto = await Photo.criarFoto({
      image,
      title,
      userId: user.id,
      userName: user.name,
    });

    return res.status(201).json(newPhoto);
  } catch (error) {
    console.error("Erro ao inserir foto:", error);
    return res.status(500).json({ errors: ["Erro ao inserir a foto."] });
  }
};

const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.buscarFotoPorId(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada!"] });
    }

    if (photo.user_id !== reqUser.id) {
      return res.status(403).json({
        errors: ["Você não tem permissão para excluir esta foto."],
      });
    }

    await Photo.deletarFoto(id);

    return res.status(200).json({ id, message: "Foto excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar foto:", error);
    return res.status(500).json({ errors: ["Erro ao deletar a foto."] });
  }
};

const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll();
    return res.status(200).json(photos);
  } catch (error) {
    console.error("Erro ao buscar todas as fotos:", error);
    return res.status(500).json({ errors: ["Erro ao buscar as fotos"] });
  }
};

const getUserPhotos = async (req, res) => {
  try {
    const { id } = req.params;

    const photos = await Photo.findByUserId(id);

    return res.status(200).json(photos);
  } catch (error) {
    console.error("Erro ao buscar fotos do usuário:", error);
    return res.status(400).json({ errors: ["Erro ao buscar as fotos do usuário!"] });
  }
};

// Get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada!"] });
    }

    return res.status(200).json(photo);
  } catch (error) {
    console.error("Erro ao buscar a foto por ID:", error);
    return res.status(500).json({ errors: ["Erro ao buscar a foto!"] });
  }
};

// Update a photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ erros: ["Foto não encontrada!"] });
    }

    if (photo.user_id !== reqUser.id) {
      return res.status(422).json({ erros: ["Você não tem permissão para editar esta foto!"] });
    }

    const updatedPhoto = await Photo.update(id, { title });

    return res.status(200).json({ photo: updatedPhoto, message: "Foto atualizada com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar a foto:", error);
    return res.status(500).json({ erros: ["Erro no servidor"] });
  }
};

const likePhoto = async(req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    // Verifica se o user já curtiu
    if (photo.likes.includes(reqUser.id)) {
      return res.status(422).json({ errors: ["Você já curtiu a foto."] });
    }

    // Adiciona o like
    const updatedPhoto = await Photo.addLike(id, reqUser.id);

    return res.status(200).json({
      message: "Foto curtida com sucesso!",
      photoId: id,
      userId: reqUser.id,
      likes: updatedPhoto.likes,
    });

  } catch (err) {
    console.error("Erro ao curtir a foto:", err);
    return res.status(500).json({ errors: ["Erro ao curtir a foto."] });
  }
}

const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser.id);
    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    const userComment = {
      comment,
      userName: user.name,
      userImage: user.profile_image,
      userId: user.id,
    };

    const updatedPhoto = await Photo.addComment(id, userComment);

    return res.status(200).json({
      comment: userComment,
      message: "Comentário adicionado com sucesso!",
    });
  } catch (err) {
    console.error("Erro ao adicionar comentário:", err);
    return res.status(500).json({ errors: ["Erro ao adicionar comentário."] });
  }
};

const searchPhotos = async (req, res) => {
  const { q } = req.query;

  try {
    const photos = await Photo.searchByTitle(q);

    res.status(200).json(photos);
  } catch (error) {
    console.error("Erro ao buscar fotos:", error);
    res.status(500).json({ errors: ["Erro ao buscar fotos."] });
  }
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
