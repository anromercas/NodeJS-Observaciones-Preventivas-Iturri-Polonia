import { Schema, Document, model } from 'mongoose';

const formSchema = new Schema({

    queVes: {
        type: String
    },
    tipoRiesgo: {
        type: String
    },
    img: [{
        type: String
    }],
    form: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
    }

});


interface IObservation extends Document {
    queVes: string;
    tipoRiesgo: string;
    img: string; 
}

export const InitialObservation = model<IObservation>('InitialObservation', formSchema);
