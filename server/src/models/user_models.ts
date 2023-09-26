import { Schema, model } from 'mongoose';
import { UserInterface } from '../interface/interfaces';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, 'Username already in use'],
      required: [true, 'Username cannot be empty'],
    },
    password: {
      type: String,
      required: true,
      maxlength: [60, 'Password must less or equal than 60 character'],
      minlength: [6, 'Password must greater or equal than 6 characters'],
    },
    role: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'User',
    timestamps: true,
    versionKey: false,
  }
);

const User_Model = model<UserInterface>('User', UserSchema);

export default User_Model;
