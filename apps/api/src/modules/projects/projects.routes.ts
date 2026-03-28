import { Router, type Request, type Response, type NextFunction } from "express";
import { authGuard } from "../../common/middleware/auth.js";
import { projectsController } from "./projects.controller.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export const projectRoutes = Router();

projectRoutes.use(authGuard);
projectRoutes.post("/", asyncHandler((req, res) => projectsController.createProject(req, res)));
projectRoutes.get("/", asyncHandler((req, res) => projectsController.listProjects(req, res)));
projectRoutes.get("/:projectId", asyncHandler((req, res) => projectsController.getProject(req, res)));
projectRoutes.get("/:projectId/outputs", asyncHandler((req, res) => projectsController.getOutputs(req, res)));
projectRoutes.post("/:projectId/generate/starter-kit", asyncHandler((req, res) =>
  projectsController.generateStarterKit(req, res)
));
projectRoutes.post("/:projectId/generate/logo-direction", asyncHandler((req, res) =>
  projectsController.generateLogoDirection(req, res)
));
projectRoutes.post("/:projectId/generate/campaign-pack", asyncHandler((req, res) =>
  projectsController.generateCampaignPack(req, res)
));

