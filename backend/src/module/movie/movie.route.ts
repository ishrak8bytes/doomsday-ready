import { Router } from "express";
import { 
  createMovieController, 
  getAllMovieController, 
  getMovieByIdController,
  getRewatchOrderController, 
  updateMovieController } from "./movie.controller.js";

const movieRouter = Router();

movieRouter.get("/movies", getAllMovieController);
movieRouter.get("/movies/:id", getMovieByIdController);
movieRouter.patch("/movies/:id", updateMovieController);
movieRouter.get("/movies/:id/rewatch-order", getRewatchOrderController);
movieRouter.post("/movies", createMovieController);


export default movieRouter;