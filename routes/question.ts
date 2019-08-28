import { Router, Response } from "express";
import { Pregunta } from '../models/pregunta.model';
import { verificaToken } from "../middlewares/autenticacion";

import { FileUpload } from "../interfaces/file-upload";
import FileSystem from '../classes/file-system';

const fileSystem = new FileSystem();
const questionRoutes = Router();

// Obtener Preguntas paginados
questionRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const preguntas = await Pregunta.find()
                            .sort({ _id: -1 })
                            .skip(skip)
                            .limit(10)
                            .exec();

    res.json({
        ok: true,
        pagina,
        preguntas
    });
});


// Obtener Preguntas paginados por ID Form
questionRoutes.get('/getQuestions', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    let idForm = req.query.idForm;

    const preguntas = await Pregunta.find({ form: idForm })
                            .sort({ _id: -1 })
                            .skip(skip)
                            .limit(10)
                            .exec();

    res.json({
        ok: true,
        pagina,
        preguntas
    });
});

// Obtener Pregunta por ID
questionRoutes.get('/getQuestion', [ verificaToken ], async (req: any, res: Response) => {

    let idQuestion = req.query.idQuestion;

    const pregunta = await Pregunta.findById({ _id: idQuestion })
                                    .exec();

    res.json({
        ok: true,
        pregunta
    });
});

// crear Pregunta
questionRoutes.post('/', [ verificaToken ], (req: any, res: Response) => {

    const body = req.body;
    const form = req.query.form;

    body.usuario = req.usuario._id;
    body.form = form;

    const imagenes = fileSystem.imagenesDeTempHaciaQuestion(req.usuario._id);
    body.img = imagenes;

    Pregunta.create( body ).then( async preguntaDB =>{

        await preguntaDB.populate('form').execPopulate();

        res.json({
            ok: true,
            pregunta: preguntaDB
        });
    }).catch( err => {
        res.json(err);
    });

});

// Actualizar question
questionRoutes.post('/update', verificaToken, (req: any, res: Response) => {

    const pregunta = {
        texto: req.body.texto,
        ok: req.body.ok,
        comentario: req.body.comentario,
        form: req.body.form
    }

    const idPregunta = req.query.id;

    Pregunta.findByIdAndUpdate( idPregunta, pregunta, {new: true}, (err, preguntaDB) =>{
        
        if(err) throw err;

        if( !preguntaDB ) {
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
questionRoutes.post('/upload', [ verificaToken ], async (req: any, res: Response) => {

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
        file: file.mimetype
    })
});

// obtener imagen
questionRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});

questionRoutes.delete('/', [ verificaToken ], async (req: any, res: Response) => {
    let idForm = req.query.idForm;

    const pregunta = await Pregunta.deleteMany({ form: idForm })
                            .exec();
    res.json({
        ok: true,
        pregunta
    })
});


export default questionRoutes;