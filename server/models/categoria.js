const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [ true, "La Descripcion es requerida"]
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

// categoriaSchema.plugin( uniqueValidator, { message: 'La {PATH} {VALUE} ya se encuentra registrada'})

module.exports = mongoose.model('Categoria', categoriaSchema);

