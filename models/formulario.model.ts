import { Schema, Document, model } from 'mongoose';


const formSchema = new Schema({

    created: {
        type: Date
    },
    area: {
        type: String
    },
    fabrica: {
        type: Schema.Types.ObjectId,
        ref: 'Factory',
        required: [true, 'Debe de existir una referencia a una fabrica']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }

});

formSchema.pre<IForm>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IForm extends Document {
    created: Date;
    area: string;
    fabrica: string;
    usuario: string; 
}

export const Form = model<IForm>('Form', formSchema);