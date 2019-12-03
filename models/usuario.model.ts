

import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    idioma: {
        type: String,
        required: [true, 'El idioma es necesario']
    },
    fabrica: {
        type: Schema.Types.ObjectId,
        ref: 'Factory',
    //    required: [true, 'Debe de existir una referencia a una fabrica']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    }
});

usuarioSchema.method('compararPassword', function( password: string = ''): boolean {
    if( bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }
});


interface IUsuario extends Document {
    nombre: string;
    email: string;
    password: string;
    idioma: string;
    fabrica: string;
    avatar: string;

    compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);