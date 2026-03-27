import { Router } from "express";
import { authGuard } from "../../common/middleware/auth.js";
import { projectsController } from "./projects.controller.js";

export const projectRoutes = Router();

projectRoutes.use(authGuard);
projectRoutes.post("/", (req, res) => projectsController.createProject(req, res));
projectRoutes.get("/", (req, res) => projectsController.listProjects(req, res));
projectRoutes.get("/:projectId", (req, res) => projectsController.getProject(req, res));
projectRoutes.get("/:projectId/outputs", (req, res) => projectsController.getOutputs(req, res));
projectRoutes.post("/:projectId/generate/starter-kit", (req, res) =>
  projectsController.generateStarterKit(req, res)
);
projectRoutes.post("/:projectId/generate/logo-direction", (req, res) =>
  projectsController.generateLogoDirection(req, res)
);
projectRoutes.post("/:projectId/generate/campaign-pack", (req, res) =>
  projectsController.generateCampaignPack(req, res)
);
