const usersRoutes = require('express').Router();
const users = require('../controllers/users.controller');
const { validarToken } = require('../middlewares/auth');
const upload = require('../middlewares/uploadImgUser');

usersRoutes.get("/all", validarToken, users.findAll);

usersRoutes.get("/show/:id", validarToken, users.findOne);

usersRoutes.post("/create", users.create);

usersRoutes.put("/update", validarToken, users.update);

usersRoutes.delete("/delete/:id", validarToken, users.delete);

usersRoutes.get("/view-profile/:id", validarToken, users.viewProfile);

usersRoutes.post("/login", users.login);

usersRoutes.put("/password", validarToken, users.password);

usersRoutes.put("/edit-profile-image", validarToken, upload.single('image'), users.editProfileImage);

usersRoutes.get("/validatoken", validarToken, users.validatoken);

module.exports = usersRoutes;