import { Schema, model } from 'mongoose';

import { handleMongooseError, addUpdateSettings } from '../helpers/index.js';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 7,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    avatar: {
      type: String,
      default: '',
    },
    adminGroups: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Conversation',
        },
      ],
      default: [],
    },
    groups: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Conversation',
        },
      ],
      default: [],
    },
    pinnedGroups: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Conversation',
        },
      ],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);
userSchema.pre('findOneAndUpdate', addUpdateSettings);
userSchema.post('findOneAndUpdate', handleMongooseError);

const User = model('User', userSchema);

export default User;
