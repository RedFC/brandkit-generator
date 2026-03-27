import type { BrandBriefInput, GenerationOutputType } from "@studio/contracts";
import { ApiError } from "../../common/errors/api-error.js";
import { generationService } from "../generation/generation.service.js";
import { twistService } from "../twist/twist.service.js";
import { BrandOutputModel } from "./output.model.js";
import { BrandProjectModel } from "./project.model.js";

class ProjectsService {
  async createProject(userId: string, brief: BrandBriefInput): Promise<any> {
    return BrandProjectModel.create({
      userId,
      brief,
      status: "active"
    });
  }

  async listProjects(userId: string): Promise<any[]> {
    return BrandProjectModel.find({ userId }).sort({ updatedAt: -1 }).exec();
  }

  async getProject(userId: string, projectId: string): Promise<any> {
    const project = await BrandProjectModel.findOne({ _id: projectId, userId }).exec();
    if (!project) {
      throw new ApiError(404, "Project not found", "PROJECT_NOT_FOUND");
    }
    return project;
  }

  async generate(userId: string, projectId: string, outputType: GenerationOutputType): Promise<any> {
    const project = await this.getProject(userId, projectId);
    const brief = project.brief as BrandBriefInput;

    let generated: { output: unknown; prompt: string };
    if (outputType === "starter-kit") {
      generated = await generationService.generateStarterKit(brief);
    } else if (outputType === "logo-direction") {
      generated = await generationService.generateLogoDirection(brief);
    } else {
      generated = await generationService.generateCampaignPack(brief);
    }

    const validation = await twistService.validateOutput(JSON.stringify(generated.output));

    const record = await BrandOutputModel.create({
      projectId,
      outputType,
      content: generated.output,
      twistValidation: validation
    });

    return {
      id: String(record._id),
      projectId,
      outputType,
      content: generated.output,
      prompt: generated.prompt,
      twistValidation: validation,
      createdAt: record.createdAt
    };
  }

  async getOutputs(userId: string, projectId: string): Promise<any[]> {
    await this.getProject(userId, projectId);
    return BrandOutputModel.find({ projectId }).sort({ createdAt: -1 }).exec();
  }
}

export const projectsService = new ProjectsService();
