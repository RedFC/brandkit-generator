import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import type { BrandProject } from "../../shared/models/project.models";
import { ProjectFacadeService } from "../../core/services/project-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stack fade-in">
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <h2 class="text-gradient">Project History</h2>
            <p class="muted" style="margin-top:4px;">All your brand projects in one place</p>
          </div>
          <button class="btn-secondary" style="padding:8px 14px;font-size:13px;" (click)="load()">Refresh</button>
        </div>
      </div>

      <div *ngFor="let project of projects"
           class="card"
           style="cursor:pointer;transition:all 0.2s;"
           (click)="openWorkspace(project)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <strong style="font-size:15px;">{{ project.brief.projectName }}</strong>
            <p class="muted" style="margin-top:2px;">{{ project.brief.businessName }} · {{ project.brief.niche }}</p>
            <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">{{ project.createdAt | date:'mediumDate' }}</p>
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <span class="badge badge-purple">{{ project.brief.tone }}</span>
            <span *ngFor="let ch of project.brief.channels.slice(0, 2)" class="badge badge-blue" style="font-size:11px;">{{ ch }}</span>
            <span style="color:var(--text-muted);font-size:20px;">→</span>
          </div>
        </div>
      </div>

      <div class="card" *ngIf="!projects.length" style="text-align:center;padding:48px;">
        <p style="font-size:32px;margin-bottom:8px;">📋</p>
        <p class="muted">No projects found yet. <a routerLink="/dashboard">Create your first project</a></p>
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  projects: BrandProject[] = [];

  constructor(private projectsApi: ProjectFacadeService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.projectsApi.listProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      }
    });
  }

  openWorkspace(project: BrandProject): void {
    this.router.navigate(["/workspace", project._id]);
  }
}
