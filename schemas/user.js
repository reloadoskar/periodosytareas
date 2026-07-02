import {Schema} from 'mongoose'

var UserSchema = Schema({
    nombre: {
        type: String,
        trim: true
    },
    apellido1: {type: String, trim: true},
    apellido2: {type: String, trim: true},
    telefono: {type: String,  trim: true},
    email: { type: String, required: [true, 'El correo es requerido'], unique: true },
    password: { type: String, select: false },
    database: String,
    level: Number,
    fechaInicio: String,
    tryPeriodEnds: String,
    paidPeriodEnds: String
},{
    timestamps: true
});

export default UserSchema