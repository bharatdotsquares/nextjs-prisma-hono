import { Document, Schema, model } from 'mongoose'

interface IUser {
  name: string
  email: string
  password: string
  isAdmin: boolean
}

interface IUserDoc extends IUser, Document {
  mathPassword: (pass: string) => Promise<boolean>
}

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
)

 

const User = model('User', userSchema)
export default User