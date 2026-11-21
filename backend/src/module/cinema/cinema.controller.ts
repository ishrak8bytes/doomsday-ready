import type { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/response.js";
import { 
  createCinemaService, 
  deleteCinemaService, 
  getAllCinemaService, 
  getCinemaBookingService, 
  getCinemaByIdService } from "./cinema.service.js";
import type { ICinema } from "./interface/index.js";


export const getAllCinemaController = async (req: Request, res: Response) => {
  try {
    const result = await getAllCinemaService();
    successResponse(res, 200, "cinemas retrieved", result.rows);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const getCinemaByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await getCinemaByIdService(id as string);
    successResponse(res, 200, "cinemas retrieved", result);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const getCinemaBookingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const groupSize = req.query.groupSize;

    const result = await getCinemaBookingService(id as string, Number(groupSize));

    successResponse(res, 200, "booking retrieved", result);
    
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const createCinemaController = async (req: Request, res: Response) => {
  try {
    const result = await createCinemaService(req.body as ICinema);

    successResponse(res, 201, "cinema created", result);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const deleteCinemaController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await deleteCinemaService(id as string);

    successResponse(res, 204, "cinema deleted", result);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}