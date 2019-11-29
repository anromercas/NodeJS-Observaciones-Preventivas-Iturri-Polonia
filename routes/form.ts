import { Router, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Form } from '../models/formulario.model';

const formRoutes = Router();


// Obtener Form paginados por fabrica
formRoutes.get('/', [verificaToken], async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let usuario = req.query.usuario || req.usuario._id;
    let fabrica = req.query.fabrica || req.usuario.fabrica;

    const forms = await Form.find({ usuario: usuario, fabrica: fabrica })
                            .sort({ _id: -1 })
                            .skip(skip)
                            .limit(10)
                            .populate('usuario', '-pasword')
                            .populate('fabrica')
                            .exec();

    res.json({
        ok: true,
        pagina,
        forms
    });
});

// modificar formulario
formRoutes.put('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    let idForm = req.query.idForm;

    Form.findByIdAndUpdate(idForm, body, {new: true}, (err, formDB) => {

        if(err) throw err;

        if( !formDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un formulario con ese ID'
            });
        }

        res.json({
            ok: true,
            formDB,
        });
    });

});

// Obtener Form por idForm
formRoutes.get('/getForm', [ verificaToken ], async (req: any, res: Response) => {

    let idForm = req.query.idForm;

    const form = await Form.findById({ _id: idForm })
                            .exec();

    res.json({
        ok: true,
        form
    });
});


// Obtener Form por idUsuario
formRoutes.get('/getFormsByUser', [ verificaToken ], async (req: any, res: Response) => {

    const usuario = req.usuario;

    const form = await Form.find({ usuario: usuario._id })
                            .sort({ _id: -1 })
                            .populate('usuario', '-pasword')
                            .populate('fabrica')
                            .exec();

    res.json({
        ok: true,
        form
    });
});


// crear Form
formRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    Form.create( body ).then( async formDB =>{

        await formDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            form: formDB
        });
    }).catch( err => {
        res.json(err);
    });

});

formRoutes.delete('/', [verificaToken], async (req: any, res: Response) => {

    let idForm = req.query.idForm;

    const form = await Form.findByIdAndDelete({ _id: idForm })
                            .exec();
    res.json({
        ok: true,
        form
    })

});

formRoutes.delete('/borrar-ultimo', [verificaToken], async (req: any, res: Response) => {

//     let idUsuario = req.query.usuario;


    const form = await Form.findOneAndDelete()
                            .sort({ _id: -1 })
                            .limit(1)
                            .exec();
    res.json({
        ok: true,
        form
    })

});


export default formRoutes;