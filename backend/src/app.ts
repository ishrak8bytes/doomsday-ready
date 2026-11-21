import express, { type  Application } from "express";
import movieRouter from "./module/movie/movie.route.js";
import cinemaRouter from "./module/cinema/cinema.route.js";


const app: Application = express();

// middlewares
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/", movieRouter);
app.use("/api/", cinemaRouter);


export default app;