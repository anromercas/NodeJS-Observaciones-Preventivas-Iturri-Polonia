"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const formSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    area: {
        type: String
    },
    fabrica: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Factory',
        required: [true, 'Debe de existir una referencia a una fabrica']
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }
});
formSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Form = mongoose_1.model('Form', formSchema);
