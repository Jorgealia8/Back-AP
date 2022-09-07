/* istanbul ignore file */
import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose.js';
(async () => {
    await mongooseConnect();
})();
const userSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    passwd: {
        type: mongoose.SchemaTypes.String,
        required: true,
        minLength: 5,
    },
    workouts: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Workout',
        },
    ],
    done: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Workout',
        },
    ],
    rol: {
        type: mongoose.SchemaTypes.String,
        enum: ['Admin', 'User'],
        default: 'User',
    },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.passwd;
    },
});
export const User = mongoose.model('User', userSchema);
