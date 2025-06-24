const {body} = require("express-validator")

const userCreateValidation = () => {
    return [
        body("name").isString().withMessage("Nome obrigatoriO!").isLength({min: 3}).withMessage("o nome precisa ter no minimo 3 caracteres"), 
        body("email").isString().withMessage("O me-mail é obrigatroriao!").isEmail().withMessage("insira um email valido!"), 
        body("password").isString().withMessage("A senha é obrigatirua").isLength({ min: 5 }).withMessage("A senha deve ter no minimo 5 caracteres"),
        body("confirmPassword").isString().withMessage("A confirmação da senha é obrigatoria").custom((value, {req}) => {
            if (value != req.body.password) {
                throw new Error("As senha nao sao iguais!")
            }
            return true;
        }),
    ];
};

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O email é obrigatorio")
            .isEmail()
            .withMessage("Insira um e-mail válido!"),
        body("password")
             .isString()
             .withMessage("A senha é obrigatoria!"),
    ]
}

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({min:3})
            .withMessage("O nome precisa de pelo menos 3 caracteres"),
        body("password")
            .optional()
            .isLength({min: 5})
            .withMessage("precisa ter no minimo 5"),
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
}