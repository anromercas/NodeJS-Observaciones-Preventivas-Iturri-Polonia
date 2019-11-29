"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const formSchema = new mongoose_1.Schema({
    queVes: {
        type: String
    },
    tipoRiesgo: {
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
exports.InitialObservation = mongoose_1.model('InitialObservation', formSchema);
