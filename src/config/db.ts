import mongoose from 'mongoose'


const connectDB = async () => {
  try {
    if (process.env.DATABASE_URL !== undefined) {
      const conn = await mongoose.connect("mongodb://localhost:27017/")
      console.log(process.env.DATABASE_URL)

      console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

export default connectDB