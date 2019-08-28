import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    constructor() {}

    guardarImagenTemporal( file: FileUpload, userId: string ) {

        return new Promise( (resolve, reject) => {

            // crear carpetas
            const path = this.crearCarpetaUsuario( userId );
    
            // Nombre Archivo
            const nombreArchivo = this.generarNombreUnico( file.name );
             
            // Mover el archivo del Temp a nuestra carpeta
            file.mv( `${ path }/${ nombreArchivo }`, (err: any) => {
                if ( err ) {
                    // no se pudo mover
                    reject(err);
                } else {
                    // todo salió bien
                    resolve();
                }
            });
        });
    }

    private generarNombreUnico( nombreOriginal: string) {

        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];

        const idUnico = uniqid();

        return `${ idUnico }.${ extension }`;

    }

    private crearCarpetaUsuario( userId: string ) {
        
        const pathUser = path.resolve( __dirname, '../uploads/', userId );
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync(pathUser);

        if ( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        return pathUserTemp;
    }

    imagenesDeTempHaciaQuestion( userId: string ) {

        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp' );
        const pathQuestion = path.resolve( __dirname, '../uploads/', userId, 'question' );

        if ( !fs.existsSync( pathTemp ) ) {
            return [];
        }

        if ( !fs.existsSync( pathQuestion ) ) {
            fs.mkdirSync( pathQuestion );
        }

        const imagenesTemp = this.obtenerImagenesEnTemp( userId );

        imagenesTemp.forEach( imagen => {
            fs.renameSync( `${ pathTemp }/${ imagen }`, `${ pathQuestion }/${ imagen }` )
        });

        return imagenesTemp;

    }


    private obtenerImagenesEnTemp( userId: string ) {

        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp' );

        return fs.readdirSync( pathTemp ) || [];
        
    }

    getFotoUrl( userId: string, img: string ) {

        // Path Forms
        const pathFoto = path.resolve( __dirname, '../uploads', userId, 'question', img);

        // si la imagen existe
        const existe = fs.existsSync( pathFoto );
        if ( !existe ) {
            return path.resolve( __dirname, '../assets/400x250.jpg');
        }

        return pathFoto;

    }

}