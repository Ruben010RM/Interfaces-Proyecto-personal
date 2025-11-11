import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
//Este archivo js se encarga de conectar con la base de datos y las peticiones

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; //Utiliza el puerto del entorno o por defecto el 5000

//Middelware
app.use(cors(), express.json());

//Conexión con base de datos MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => {
    console.error("No se pudo conectar a MongoDB", err);
  });

//Inicier servidor express en el puerto definido
app.listen(PORT, () => {
  console.log(`Server express está corriendo en el puerto ${PORT}`);
});
