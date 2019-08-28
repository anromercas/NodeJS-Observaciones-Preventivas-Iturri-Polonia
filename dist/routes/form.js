"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const formulario_model_1 = require("../models/formulario.model");
const formRoutes = express_1.Router();
// Obtener Form paginados
formRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const forms = yield formulario_model_1.Form.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-pasword')
        .exec();
    res.json({
        ok: true,
        pagina,
        forms
    });
}));
// Obtener Form por idForm
formRoutes.get('/getForm', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idForm = req.query.idForm;
    const form = yield formulario_model_1.Form.findById({ _id: idForm })
        .exec();
    res.json({
        ok: true,
        form
    });
}));
// crear Form
formRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    formulario_model_1.Form.create(body).then((formDB) => __awaiter(this, void 0, void 0, function* () {
        yield formDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            form: formDB
        });
    })).catch(err => {
        res.json(err);
    });
});
formRoutes.delete('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idForm = req.query.idForm;
    const form = yield formulario_model_1.Form.findByIdAndDelete({ _id: idForm })
        .exec();
    res.json({
        ok: true,
        form
    });
}));
formRoutes.delete('/borrar-ultimo', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    //     let idUsuario = req.query.usuario;
    const form = yield formulario_model_1.Form.findOneAndDelete()
        .sort({ _id: -1 })
        .limit(1)
        .exec();
    res.json({
        ok: true,
        form
    });
}));
exports.default = formRoutes;
