import { Router } from "express";
import { 
  getAllCinemaController, 
  getCinemaByIdController, 
  getCinemaBookingController, 
  createCinemaController, 
  deleteCinemaController } from "./cinema.controller.js";

const cinemaRouter = Router();

cinemaRouter.get("/cinemas", getAllCinemaController);
cinemaRouter.get("/cinemas/:id", getCinemaByIdController);
cinemaRouter.delete("/cinemas/:id", deleteCinemaController);
cinemaRouter.get("/cinemas/:id/booking", getCinemaBookingController);
cinemaRouter.post("/cinemas/", createCinemaController);

export default cinemaRouter;