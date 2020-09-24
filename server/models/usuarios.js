const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "El {VALUE} no es un rol válido",
};

let usuarioSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es requerido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos,
  },
  status: {
    type: Boolean,
    required: [true, "El estatus es necesario"],
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;

  return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
  message: "El {PATH} debe de ser único",
});

module.exports = mongoose.model("Usuario", usuarioSchema);
