import { Router, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { InitialObservation } from '../models/initialObservation.model';
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from '../classes/file-system';

const fileSystem = new FileSystem();
const iObservationRoutes = Router();


// Obtener todos los IObservation
iObservationRoutes.get('/', [verificaToken], async (req: any, res: Response) => {

    const iObser = await InitialObservation.find({ })
                            .sort({ _id: -1 })
                            .populate('form')
                            .exec();

    res.json({
        ok: true,
        iObser
    });
});


// Obtener todos los IObservation por IdForm
iObservationRoutes.get('/byIdForm', [verificaToken], async (req: any, res: Response) => {

    let idForm = req.query.idForm;


    const iObser = await InitialObservation.find({ form: idForm })
                            .sort({ _id: -1 })
                            .populate('form')
                            .exec();

    res.json({
        ok: true,
        iObser
    });
});


// crear IObservation
iObservationRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    const form = req.query.form;

    body.form = form;

    const imagenes = fileSystem.imagenesDeTempHaciaQuestion(req.usuario._id);
    body.img = imagenes;

    InitialObservation.create( body ).then( async iObserDB =>{

        await iObserDB.populate('form').execPopulate();

        res.json({
            ok: true,
            InitialObservation: iObserDB
        });
    }).catch( err => {
        res.json(err);
    });

});

// borrar los initial observations de un form
iObservationRoutes.delete('/', [ verificaToken ], async (req: any, res: Response) => {
    let idForm = req.query.idForm;

    const iObser = await InitialObservation.deleteMany({ form: idForm })
                            .exec();
    res.json({
        ok: true,
        iObser
    })
});




// Servicio para subir archivos
iObservationRoutes.post('/upload', [ verificaToken ], async (req: any, res: Response) => {

    if ( ! req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });
    }

    const file: FileUpload = req.files.image;

    if( !file ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo - image'
        });
    }

    if( !file.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id );

    res.json({
        ok: true,
        name: file.name,
        file: file.mimetype
    })
});

// obtener imagen
iObservationRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});



export default iObservationRoutes;