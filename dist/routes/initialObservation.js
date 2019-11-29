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
const autenticacion_1 = require("../middlewares/autenticacion");
const initialObservation_model_1 = require("../models/initialObservation.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const fileSystem = new file_system_1.default();
const iObservationRoutes = express_1.Router();
// Obtener todos los IObservation
iObservationRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const iObser = yield initialObservation_model_1.InitialObservation.find({})
        .sort({ _id: -1 })
        .populate('form')
        .exec();
    res.json({
        ok: true,
        iObser
    });
}));
// Obtener todos los IObservation por IdForm
iObservationRoutes.get('/byIdForm', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idForm = req.query.idForm;
    const iObser = yield initialObservation_model_1.InitialObservation.find({ form: idForm })
        .sort({ _id: -1 })
        .populate('form')
        .exec();
    res.json({
        ok: true,
        iObser
    });
}));
// crear IObservation
iObservationRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    const form = req.query.form;
    body.form = form;
    const imagenes = fileSystem.imagenesDeTempHaciaQuestion(req.usuario._id);
    body.img = imagenes;
    initialObservation_model_1.InitialObservation.create(body).then((iObserDB) => __awaiter(this, void 0, void 0, function* () {
        yield iObserDB.populate('form').execPopulate();
        res.json({
            ok: true,
            InitialObservation: iObserDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// borrar los initial observations de un form
iObservationRoutes.delete('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idForm = req.query.idForm;
    const iObser = yield initialObservation_model_1.InitialObservation.deleteMany({ form: idForm })
        .exec();
    res.json({
        ok: true,
        iObser
    });
}));
// Servicio para subir archivos
iObservationRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        name: file.name,
        file: file.mimetype
    });
}));
// obtener imagen
iObservationRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = iObservationRoutes;
