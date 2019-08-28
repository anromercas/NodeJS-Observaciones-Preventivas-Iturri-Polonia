"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pregunta_model_1 = require("../models/pregunta.model");
const autenticacion_1 = require("../middlewares/autenticacion");
const file_system_1 = __importDefault(require("../classes/file-system"));
const fileSystem = new file_system_1.default();
const questionRoutes = express_1.Router();
// Obtener Preguntas paginados
questionRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const preguntas = yield pregunta_model_1.Pregunta.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        preguntas
    });
}));
// Obtener Preguntas paginados por ID Form
questionRoutes.get('/getQuestions', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let idForm = req.query.idForm;
    const preguntas = yield pregunta_model_1.Pregunta.find({ form: idForm })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        preguntas
    });
}));
// Obtener Pregunta por ID
questionRoutes.get('/getQuestion', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idQuestion = req.query.idQuestion;
    const pregunta = yield pregunta_model_1.Pregunta.findById({ _id: idQuestion })
        .exec();
    res.json({
        ok: true,
        pregunta
    });
}));
// crear Pregunta
questionRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    const form = req.query.form;
    body.usuario = req.usuario._id;
    body.form = form;
    const imagenes = fileSystem.imagenesDeTempHaciaQuestion(req.usuario._id);
    body.img = imagenes;
    pregunta_model_1.Pregunta.create(body).then((preguntaDB) => __awaiter(this, void 0, void 0, function* () {
        yield preguntaDB.populate('form').execPopulate();
        res.json({
            ok: true,
            pregunta: preguntaDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Actualizar question
questionRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const pregunta = {
        texto: req.body.texto,
        ok: req.body.ok,
        comentario: req.body.comentario,
        form: req.body.form
    };
    const idPregunta = req.query.id;
    pregunta_model_1.Pregunta.findByIdAndUpdate(idPregunta, pregunta, { new: true }, (err, preguntaDB) => {
        if (err)
            throw err;
        if (!preguntaDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe una pregunta con ese ID'
            });
        }
        res.json({
            ok: true,
            preguntaDB,
        });
    });
});
// Servicio para subir archivos
questionRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
// obtener imagen
questionRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
questionRoutes.delete('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idForm = req.query.idForm;
    const pregunta = yield pregunta_model_1.Pregunta.deleteMany({ form: idForm })
        .exec();
    res.json({
        ok: true,
        pregunta
    });
}));
exports.default = questionRoutes;
