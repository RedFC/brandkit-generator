import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import type { BrandProject } from "../../shared/models/project.models";
import { ProjectFacadeService } from "../../core/services/project-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card stack">
      <h2>Project History</h2>
      <button class="btn-secondary" (click)="load()">Refresh</button>
      <div class="card" *ngFor="let project of projects">
        <strong>{{ project.brief.projectName }}</strong>
        <p class="muted">{{ project.brief.businessName }} | {{ project.createdAt | date:'medium' }}</p>
      </div>
      <p class="muted" *ngIf="!projects.length">No projects found yet.</p>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  projects: BrandProject[] = [];

  constructor(private projectsApi: ProjectFacadeService) {}

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
}
