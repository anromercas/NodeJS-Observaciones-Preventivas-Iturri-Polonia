import { Schema, Document, model } from "mongoose";


const preguntaShema = new Schema({
    texto:{
        type: String
    },
    ok: {
        type: Boolean
    },
    comentario: {
        type: String
    },
    img: [{
        type: String
    }],
    form: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
    }
});

interface IPregunta extends Document {
    texto: string;
    ok: Boolean;
    comentario: string;
    img: string[];
}

export const Pregunta = model<IPregunta>('Pregunta', preguntaShema);
