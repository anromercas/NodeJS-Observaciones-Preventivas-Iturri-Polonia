import { Request, Response, NextFunction } from 'express';
import Token from '../classes/token';
import { Usuario } from '../models/usuario.model';


export const verificaToken = ( req: any , res: Response, next: NextFunction ) => {

    const userToken = req.get('token') || '';

    Token.comprobarToken( userToken )
        .then( (decoded: any) => {
            console.log('Decoded', decoded);
            req.usuario = decoded.usuario;
            next();
        })
        .catch( err => {
            res.json({
                ok: false,
                mensaje: 'Token no es correcto'
            })
        });

}