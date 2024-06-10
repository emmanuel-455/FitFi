import express from "express";
import Workout from "./routes/workouts.js"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import userRoutes from "./routes/user.js"


dotenv.config()
const PORT = process.env.PORT;
//express app
const app = express();


//middleware
app.use(cors(
  {
    origin: ["https://deploy-mern-frontend.vercel.app"],
    methods: ["POST", "GET", "DELETE", "PATCH"],
    credentials: true
  }
));
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})


//routes
app.use("/api/workout", Workout)
app.use("/api/user", userRoutes)


//connecting to a database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is Connected")
  })
  .catch((error) => {
    console.error(error)
  })

//listen to the port
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
