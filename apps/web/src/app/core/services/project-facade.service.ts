import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiClientService } from "./api-client.service";
import type { BrandBrief, BrandProject, OutputRecord } from "../../shared/models/project.models";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: "root" })
export class ProjectFacadeService {
  constructor(private api: ApiClientService) {}

  createProject(brief: BrandBrief): Observable<BrandProject> {
    return this.api
      .post<ApiEnvelope<{ project: BrandProject }>>("/projects", { brief })
      .pipe(map((response) => response.data.project));
  }

  listProjects(): Observable<BrandProject[]> {
    return this.api
      .get<ApiEnvelope<{ projects: BrandProject[] }>>("/projects")
      .pipe(map((response) => response.data.projects));
  }

  getProject(projectId: string): Observable<BrandProject> {
    return this.api
      .get<ApiEnvelope<{ project: BrandProject }>>(`/projects/${projectId}`)
      .pipe(map((response) => response.data.project));
  }

  generate(projectId: string, outputType: "starter-kit" | "logo-direction" | "campaign-pack"): Observable<OutputRecord> {
    return this.api
      .post<ApiEnvelope<{ output: OutputRecord }>>(`/projects/${projectId}/generate/${outputType}`, {})
      .pipe(map((response) => response.data.output));
  }

  outputs(projectId: string): Observable<OutputRecord[]> {
    return this.api
      .get<ApiEnvelope<{ outputs: OutputRecord[] }>>(`/projects/${projectId}/outputs`)
      .pipe(map((response) => response.data.outputs));
  }
}
