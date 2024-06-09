import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import validator from "validator"


const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// static signup method
userSchema.statics.signup = async function (email, password) {

  //Validation of Email and Password
  if (!email | !password) {
    throw Error("All fields must be filled")
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid")
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough")
  }

  //Checking of the email already exist
  const exists = await this.findOne({ email })
  if (exists) {
    throw Error('Email already in use')
  }

  //Hashing of password
  const salt = await bcryptjs.genSalt(10)
  const hash = await bcryptjs.hash(password, salt)

  const user = await this.create({ email, password: hash })

  return user
}

//Static Login Method
userSchema.statics.login = async function (email, password) {
  if (!email | !password) {
    throw Error("All fields must be filled")
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect Email')
  }
  const match = await bcryptjs.compare(password, user.password)

  if (!match) {
    throw Error("Incorrect Password")
  }
  return user
}

export default mongoose.model('User', userSchema);