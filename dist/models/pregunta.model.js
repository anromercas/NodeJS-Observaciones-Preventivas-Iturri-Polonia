"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const preguntaShema = new mongoose_1.Schema({
    texto: {
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Form',
    }
});
exports.Pregunta = mongoose_1.model('Pregunta', preguntaShema);
