"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const factorySchema = new mongoose_1.Schema({
    nombre: {
        type: String
    },
    pais: {
        type: String
    },
    ciudad: {
        type: String
    }
});
exports.Factory = mongoose_1.model('Factory', factorySchema);
