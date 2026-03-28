import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import type { BrandProject } from "../../shared/models/project.models";
import { ProjectFacadeService } from "../../core/services/project-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="stack fade-in">
      <!-- Create Project -->
      <div class="card stack">
        <div>
          <h2 class="text-gradient">New Brand Project</h2>
          <p class="muted" style="margin-top:4px;">Fill in your brand brief to start generating</p>
        </div>
        <form class="stack" [formGroup]="form" (ngSubmit)="createProject()">
          <div class="row">
            <div class="stack" style="gap:6px;">
              <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Project Name</label>
              <input placeholder="My Brand Project" formControlName="projectName" />
            </div>
            <div class="stack" style="gap:6px;">
              <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Business Name</label>
              <input placeholder="Acme Inc." formControlName="businessName" />
            </div>
          </div>
          <div class="row">
            <div class="stack" style="gap:6px;">
              <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Niche</label>
              <input placeholder="e.g. Health & Fitness" formControlName="niche" />
            </div>
            <div class="stack" style="gap:6px;">
              <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Target Audience</label>
              <input placeholder="e.g. Young professionals" formControlName="targetAudience" />
            </div>
          </div>
          <div class="row">
            <div class="stack" style="gap:6px;">
              <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Tone</label>
              <select formControlName="tone">
                <option value="professional">Professional</option>
                <option value="playful">Playful</option>
                <option value="bold">Bold</option>
                <option value="minimal">Minimal</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>
            <div class="stack" style="gap:6px;">
              <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Channels</label>
              <input placeholder="instagram, email, linkedin" formControlName="channels" />
            </div>
          </div>
          <div class="stack" style="gap:6px;">
            <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Value Proposition</label>
            <textarea rows="3" placeholder="What makes your brand unique?" formControlName="valueProposition"></textarea>
          </div>
          <div class="stack" style="gap:6px;">
            <label class="muted" style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Additional Context (optional)</label>
            <textarea rows="2" placeholder="Any other details..." formControlName="additionalContext"></textarea>
          </div>
          <button class="btn-primary" [disabled]="loading || form.invalid">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : '✦ Create Project' }}
          </button>
        </form>
        <p class="error" *ngIf="error">{{ error }}</p>
      </div>

      <!-- Project List -->
      <div class="card stack">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <h2>Recent Projects</h2>
          <button class="btn-secondary" style="padding:8px 14px;font-size:13px;" (click)="loadProjects()">Refresh</button>
        </div>
        <div *ngFor="let project of projects"
             class="card"
             style="cursor:pointer;transition:all 0.2s;"
             (click)="openWorkspace(project)">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div>
              <strong style="font-size:15px;">{{ project.brief.projectName }}</strong>
              <p class="muted" style="margin-top:2px;">{{ project.brief.businessName }} · {{ project.brief.niche }}</p>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="badge badge-purple">{{ project.brief.tone }}</span>
              <span style="color:var(--text-muted);font-size:20px;">→</span>
            </div>
          </div>
        </div>
        <p class="muted" *ngIf="!projects.length" style="text-align:center;padding:24px 0;">No projects yet. Create your first brand project above!</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

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

  constructor(private projectsApi: ProjectFacadeService, private router: Router) {}

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
