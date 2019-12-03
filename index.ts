import Server from "./classes/server";
import mongoose from 'mongoose';

import cors from 'cors';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'

import userRoutes from "./routes/usuario";
import formRoutes from "./routes/form";
import questionRoutes from "./routes/question";
import factoryRoutes from "./routes/factory";
import iObservationRoutes from "./routes/initialObservation";

const server = new Server();


// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// FileUpload
server.app.use( fileUpload() );

// configurar CORS
server.app.use( cors({ origin: true, credentials: true }) );

// Rutas
server.app.use( '/user', userRoutes );
server.app.use( '/form', formRoutes );
server.app.use( '/question', questionRoutes );
server.app.use( '/factory', factoryRoutes );
server.app.use( '/iobservation', iObservationRoutes );

// Conectar DB
mongoose.connect('mongodb://mongo:27017/prev-obs-iturri-pol',
                { useNewUrlParser: true, useCreateIndex: true }, (err: any) => {

                    if ( err ){ throw err};
                    console.log('Base de datos ONLINE');
                });

// Levantar express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});