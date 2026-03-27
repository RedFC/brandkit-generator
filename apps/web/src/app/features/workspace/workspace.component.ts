import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import type { BrandProject, OutputRecord } from "../../shared/models/project.models";
import { ProjectFacadeService } from "../../core/services/project-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stack" *ngIf="project">
      <div class="card stack">
        <h2>{{ project.brief.projectName }}</h2>
        <p class="muted">{{ project.brief.businessName }} | {{ project.brief.niche }}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn-primary" [disabled]="loading" (click)="generate('starter-kit')">Generate Starter Kit</button>
          <button class="btn-primary" [disabled]="loading" (click)="generate('logo-direction')">Generate Logo Direction</button>
          <button class="btn-primary" [disabled]="loading" (click)="generate('campaign-pack')">Generate Campaign Pack</button>
          <button class="btn-secondary" [disabled]="loading" (click)="reloadOutputs()">Refresh Outputs</button>
        </div>
        <p class="error" *ngIf="error">{{ error }}</p>
      </div>

      <div class="card stack">
        <h3>Outputs</h3>
        <div class="card" *ngFor="let output of outputs">
          <strong>{{ output.outputType }}</strong>
          <p class="muted">{{ output.createdAt | date:'medium' }}</p>
          <pre style="white-space:pre-wrap;max-height:350px;overflow:auto;">{{ output.content | json }}</pre>
          <p class="muted">Twist pass: {{ output.twistValidation?.passed ? 'yes' : 'no' }}</p>
        </div>
        <p class="muted" *ngIf="!outputs.length">No outputs yet.</p>
      </div>
    </div>
  `
})
export class WorkspaceComponent implements OnInit {
  projectId = "";
  project: BrandProject | null = null;
  outputs: OutputRecord[] = [];
  loading = false;
  error = "";

  constructor(private route: ActivatedRoute, private projectsApi: ProjectFacadeService) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("projectId") ?? "";
    this.loadProject();
    this.reloadOutputs();
  }

  loadProject(): void {
    this.projectsApi.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => {
        this.error = err?.error?.message ?? "Project not found";
      }
    });
  }

  reloadOutputs(): void {
    this.projectsApi.outputs(this.projectId).subscribe({
      next: (outputs) => {
        this.outputs = outputs;
      }
    });
  }

  generate(type: "starter-kit" | "logo-direction" | "campaign-pack"): void {
    if (this.loading) return;
    this.loading = true;
    this.error = "";

    this.projectsApi.generate(this.projectId, type).subscribe({
      next: () => {
        this.loading = false;
        this.reloadOutputs();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? "Generation failed";
      }
    });
  }
}
