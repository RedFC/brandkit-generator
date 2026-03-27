import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import type { BrandProject } from "../../shared/models/project.models";
import { ProjectFacadeService } from "../../core/services/project-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="stack">
      <div class="card stack">
        <h2>New Brand Project</h2>
        <form class="stack" [formGroup]="form" (ngSubmit)="createProject()">
          <div class="row">
            <input placeholder="Project Name" formControlName="projectName" />
            <input placeholder="Business Name" formControlName="businessName" />
          </div>
          <div class="row">
            <input placeholder="Niche" formControlName="niche" />
            <input placeholder="Target Audience" formControlName="targetAudience" />
          </div>
          <div class="row">
            <select formControlName="tone">
              <option value="professional">professional</option>
              <option value="playful">playful</option>
              <option value="bold">bold</option>
              <option value="minimal">minimal</option>
              <option value="friendly">friendly</option>
            </select>
            <input placeholder="Channels (comma separated)" formControlName="channels" />
          </div>
          <textarea rows="4" placeholder="Value Proposition" formControlName="valueProposition"></textarea>
          <textarea rows="3" placeholder="Additional Context" formControlName="additionalContext"></textarea>
          <button class="btn-primary" [disabled]="loading || form.invalid">{{ loading ? 'Creating...' : 'Create Project' }}</button>
        </form>
        <p class="error" *ngIf="error">{{ error }}</p>
      </div>

      <div class="card stack">
        <h2>Recent Projects</h2>
        <button class="btn-secondary" (click)="loadProjects()">Refresh</button>
        <div class="card" *ngFor="let project of projects">
          <strong>{{ project.brief.projectName }}</strong>
          <p class="muted">{{ project.brief.businessName }} | {{ project.brief.niche }}</p>
          <button class="btn-primary" (click)="openWorkspace(project)">Open Workspace</button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  loading = false;
  error = "";
  projects: BrandProject[] = [];

  form = this.fb.group({
    projectName: ["", [Validators.required]],
    businessName: ["", [Validators.required]],
    niche: ["", [Validators.required]],
    targetAudience: ["", [Validators.required]],
    tone: ["professional", [Validators.required]],
    channels: ["instagram,email", [Validators.required]],
    valueProposition: ["", [Validators.required]],
    additionalContext: [""]
  });

  constructor(private fb: FormBuilder, private projectsApi: ProjectFacadeService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectsApi.listProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        this.error = err?.error?.message ?? "Failed to fetch projects";
      }
    });
  }

  createProject(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = "";

    const raw = this.form.getRawValue();
    const channels = String(raw.channels ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    this.projectsApi
      .createProject({
        projectName: raw.projectName ?? "",
        businessName: raw.businessName ?? "",
        niche: raw.niche ?? "",
        targetAudience: raw.targetAudience ?? "",
        tone: (raw.tone as any) ?? "professional",
        channels,
        valueProposition: raw.valueProposition ?? "",
        additionalContext: raw.additionalContext ?? ""
      })
      .subscribe({
        next: (project) => {
          this.loading = false;
          this.form.reset({
            tone: "professional",
            channels: "instagram,email"
          });
          this.loadProjects();
          this.router.navigate(["/workspace", project._id]);
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? "Failed to create project";
        }
      });
  }

  openWorkspace(project: BrandProject): void {
    this.router.navigate(["/workspace", project._id]);
  }
}
