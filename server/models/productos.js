const mongoose = require("mongoose");
const {Schema} = mongoose;

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    precioUnitario: {
        type: Number,
        required: [true, "El precio unitario es necesario"]
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: [true, "La disponibilidad es necesaria"],
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria"
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
});


module.exports = mongoose.model("Producto", productoSchema);