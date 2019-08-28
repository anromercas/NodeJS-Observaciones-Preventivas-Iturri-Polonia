import { Router, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Form } from '../models/formulario.model';

const formRoutes = Router();


// Obtener Form paginados
formRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const forms = await Form.find()
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