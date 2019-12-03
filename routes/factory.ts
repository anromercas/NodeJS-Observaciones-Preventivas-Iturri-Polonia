import { Router, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { Factory } from './../models/fabrica.model';

const factoryRoutes = Router();


// obtener fabricas
factoryRoutes.get('/', [verificaToken], async (req: any, res: Response) => {

    const factories = await Factory.find().exec();

    res.json({
        ok: true,
        factories
    })

});

// obtener fabrica por id
factoryRoutes.get('/getFactory', [verificaToken], async (req: any, res: Response) => {

    let idFactory = req.query.idFactory;

    const factory = await Factory.findById( { _id: idFactory })
                                    .exec();

    res.json({
        ok: true,
        factory
    })

});

// crear fabrica
factoryRoutes.post('/', async (req: any, res: Response) => {

    const body = req.body;

    Factory.create( body ).then( factoryDB => {

        res.json({
            ok: true,
            form: factoryDB
        });
    }).catch( err => {
        res.json(err);
    });

});

// modificar fabrica
factoryRoutes.put('/', [verificaToken], async (req: any, res: Response) => {

    const body = req.body;
    let idFactory = req.query.idFactory;

    Factory.findByIdAndUpdate(idFactory, body, {new: true}, (err, FactoryDB) => {
        if(err) throw err;

        if( !FactoryDB ) {
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

});


// borrar fabrica
factoryRoutes.delete('/', [verificaToken], async (req: any, res: Response) => {

    let idFactory = req.query.idFactory;

    const factory = await Factory.findByIdAndDelete({ _id: idFactory})
                                .exec();

            res.json({
                ok: true,
                factory
            });

});





export default factoryRoutes;