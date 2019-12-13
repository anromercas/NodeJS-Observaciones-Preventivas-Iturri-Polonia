import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from '../middlewares/autenticacion';


const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res: Response) => {
    
    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {
        
        if ( err ) throw err;

        if ( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if( userDB.compararPassword( body.password )) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar,
                idioma: userDB.idioma,
                fabrica: userDB.fabrica
            });

            res.json({
                ok: true,
                token: tokenUser
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ***'
            });
        }
    });

})



// Crear un usuario
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
        idioma: req.body.idioma,
        fabrica: req.body.fabrica
    };

    Usuario.create( user ).then( userDB => {


        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar,
            idioma: userDB.idioma,
            fabrica: userDB.fabrica
        });

        res.json({
            ok: true,
            userDB,
            token: tokenUser
        });
    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });

});

// Actualizar usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar,
        idioma: req.body.idioma || req.usuario.idioma,
        fabrica: req.body.fabrica || req.usuario.fabrica
    }

    Usuario.findByIdAndUpdate( req.usuario._id, user, {new: true}, (err, userDB) =>{
        
        if(err) throw err;

        if( !userDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar,
            fabrica: userDB.fabrica
        });

        res.json({
            ok: true,
            userDB,
            token: tokenUser
        });

    });

});

// Get de todos los usuarios
userRoutes.get('/', [ verificaToken ], async ( req: any, res: Response ) => {

    const usuarios = await Usuario.find({}).exec();
            res.json({
                ok: true,
                usuarios
            });
});


// usuario por token
userRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => {

    const usuario = req.usuario;
    res.json({
        ok: true,
        message: 'usuario por token',
        usuario
    });
});

export default userRoutes;