"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const form_1 = __importDefault(require("./routes/form"));
const question_1 = __importDefault(require("./routes/question"));
const factory_1 = __importDefault(require("./routes/factory"));
const initialObservation_1 = __importDefault(require("./routes/initialObservation"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use(express_fileupload_1.default());
// configurar CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// Rutas
server.app.use('/user', usuario_1.default);
server.app.use('/form', form_1.default);
server.app.use('/question', question_1.default);
server.app.use('/factory', factory_1.default);
server.app.use('/iobservation', initialObservation_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/prev-obs-iturri-pol', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) {
        throw err;
    }
    ;
    console.log('Base de datos ONLINE');
});
// Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
