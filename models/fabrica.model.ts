import { Schema, Document, model } from 'mongoose';

const factorySchema = new Schema({

    nombre: {
        type: String
    },
    pais: {
        type: String
    },
    ciudad: {
        type: String
    }

});

interface IFactory extends Document {
    nombre: string;
    pais: string;
    ciudad: string; 
}

export const Factory = model<IFactory>('Factory', factorySchema);