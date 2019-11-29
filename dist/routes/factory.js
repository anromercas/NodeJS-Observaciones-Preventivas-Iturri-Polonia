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
const fabrica_model_1 = require("./../models/fabrica.model");
const factoryRoutes = express_1.Router();
// obtener fabricas
factoryRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const factories = yield fabrica_model_1.Factory.find().exec();
    res.json({
        ok: true,
        factories
    });
}));
// obtener fabrica por id
factoryRoutes.get('/getFactory', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idFactory = req.query.idFactory;
    const factory = yield fabrica_model_1.Factory.findById({ _id: idFactory })
        .exec();
    res.json({
        ok: true,
        factory
    });
}));
// crear fabrica
factoryRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const body = req.body;
    fabrica_model_1.Factory.create(body).then(factoryDB => {
        res.json({
            ok: true,
            form: factoryDB
        });
    }).catch(err => {
        res.json(err);
    });
}));
// modificar fabrica
factoryRoutes.put('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const body = req.body;
    let idFactory = req.query.idFactory;
    fabrica_model_1.Factory.findByIdAndUpdate(idFactory, body, { new: true }, (err, FactoryDB) => {
        if (err)
            throw err;
        if (!FactoryDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un formulario con ese ID'
            });
        }
        res.json({
            ok: true,
            FactoryDB,
        });
    });
}));
// borrar fabrica
factoryRoutes.delete('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let idFactory = req.query.idFactory;
    const factory = yield fabrica_model_1.Factory.findByIdAndDelete({ _id: idFactory })
        .exec();
    res.json({
        ok: true,
        factory
    });
}));
exports.default = factoryRoutes;
