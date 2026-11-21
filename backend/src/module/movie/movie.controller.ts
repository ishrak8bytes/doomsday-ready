import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/response.js";
import { MovieSchema } from "./validation/index.js";
import type { IMovie, IUpdateMovie } from "./interface/index.js";
import { 
  createMovieService, 
  getAllMovieService, 
  getMovieByIdService,
  getRewatchOrderService,
  updateMovieService
} from "./movie.service.js";


export const getAllMovieController = async (req: Request, res: Response) => {
  try {
    const result = await getAllMovieService();
    successResponse(res, 200, "movies retrieved", result.rows);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const getRewatchOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await getRewatchOrderService(id as string);
    successResponse(res, 200, "rewatch order retrieved", result);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const getMovieByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getMovieByIdService(id as string);

    successResponse(res, 200, "movie found", result);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const updateMovieController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { watched, preRequisiteIds, movieBody } = req.body as IUpdateMovie;

    if(preRequisiteIds === undefined && watched === undefined && movieBody === undefined) {
      errorResponse(res, 400, "watched or preRequisiteIds or movieBody must be provided", "validation error");
      return;
    }

    if(preRequisiteIds !== undefined && !Array.isArray(preRequisiteIds)) {
      errorResponse(res, 400, "preRequisiteIds must be an array", "validation error");
      return;
    }

    if(watched !== undefined && typeof watched !== "boolean") {
      errorResponse(res, 400, "watched must be a boolean", "validation error");
      return;
    }

    const movie = await updateMovieService(id as string, req.body as IUpdateMovie);

    res.status(200).json({ success: true, message: "movie updated", data: movie });
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

export const createMovieController = async (req: Request, res: Response) => {
  try {
    const validationResult = MovieSchema.safeParse(req.body as IMovie);

    if (!validationResult.success) {
      const validationErrors = validationResult.error.issues.map(
        (issue) => issue.message
      );

      errorResponse(res, 400, validationErrors, "validation error");
    }

    const result = await createMovieService(req.body as IMovie);

    successResponse(res, 201, "movie created", result.rows[0]);
  } catch (error) {
    errorResponse(res, 500, error);
  }
}

