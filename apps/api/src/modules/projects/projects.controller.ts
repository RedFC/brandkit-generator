import type { Request, Response } from "express";
import { CreateProjectSchema, GenerateRequestSchema } from "@studio/contracts";
import { ok, created } from "../../common/utils/response.js";
import { projectsService } from "./projects.service.js";

class ProjectsController {
  async createProject(req: Request, res: Response): Promise<Response> {
    const parsed = CreateProjectSchema.parse(req.body);
    const project = await projectsService.createProject(req.user!.id, parsed.brief);
    return created(res, "Project created", { project });
  }

  async listProjects(req: Request, res: Response): Promise<Response> {
    const projects = await projectsService.listProjects(req.user!.id);
    return ok(res, "Projects fetched", { projects });
  }

  async getProject(req: Request, res: Response): Promise<Response> {
    const project = await projectsService.getProject(req.user!.id, req.params.projectId);
    return ok(res, "Project fetched", { project });
  }

  async generateStarterKit(req: Request, res: Response): Promise<Response> {
    GenerateRequestSchema.parse(req.body ?? {});
    const output = await projectsService.generate(req.user!.id, req.params.projectId, "starter-kit");
    return created(res, "Starter kit generated", { output });
  }

  async generateLogoDirection(req: Request, res: Response): Promise<Response> {
    GenerateRequestSchema.parse(req.body ?? {});
    const output = await projectsService.generate(req.user!.id, req.params.projectId, "logo-direction");
    return created(res, "Logo direction generated", { output });
  }

  async generateCampaignPack(req: Request, res: Response): Promise<Response> {
    GenerateRequestSchema.parse(req.body ?? {});
    const output = await projectsService.generate(req.user!.id, req.params.projectId, "campaign-pack");
    return created(res, "Campaign pack generated", { output });
  }

  async getOutputs(req: Request, res: Response): Promise<Response> {
    const outputs = await projectsService.getOutputs(req.user!.id, req.params.projectId);
    return ok(res, "Outputs fetched", { outputs });
  }
}

export const projectsController = new ProjectsController();
