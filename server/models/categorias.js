const mongoose = require("mongoose");
const {Schema} = mongoose;

const categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
});

module.exports = mongoose.model("Categoria", categoriaSchema);