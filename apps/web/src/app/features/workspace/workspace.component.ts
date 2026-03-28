import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import type { BrandProject, OutputRecord } from "../../shared/models/project.models";
import { ProjectFacadeService } from "../../core/services/project-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stack fade-in" *ngIf="project">
      <!-- Project Header -->
      <div class="card">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h2 class="text-gradient">{{ project.brief.projectName }}</h2>
            <p class="muted" style="margin-top:4px;">{{ project.brief.businessName }} · {{ project.brief.niche }}</p>
            <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;">
              <span class="badge badge-purple">{{ project.brief.tone }}</span>
              <span class="badge badge-blue" *ngFor="let ch of project.brief.channels">{{ ch }}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn-primary" [disabled]="loading" (click)="generate('starter-kit')">
              <span class="spinner" *ngIf="loading && generating === 'starter-kit'"></span>
              ✦ Starter Kit
            </button>
            <button class="btn-primary" [disabled]="loading" style="background:var(--gradient-cool);" (click)="generate('logo-direction')">
              <span class="spinner" *ngIf="loading && generating === 'logo-direction'"></span>
              ◎ Logo Pack
            </button>
            <button class="btn-primary" [disabled]="loading" style="background:var(--gradient-warm);" (click)="generate('campaign-pack')">
              <span class="spinner" *ngIf="loading && generating === 'campaign-pack'"></span>
              ⚡ Campaign
            </button>
            <button class="btn-secondary" [disabled]="loading" (click)="reloadOutputs()" style="padding:12px 14px;">↻</button>
          </div>
        </div>
        <p class="error" *ngIf="error" style="margin-top:12px;">{{ error }}</p>
      </div>

      <!-- Loading State -->
      <div class="card" *ngIf="loading" style="text-align:center;padding:48px;">
        <div class="spinner" style="width:32px;height:32px;border-width:3px;margin:0 auto;"></div>
        <p class="muted" style="margin-top:16px;">Generating {{ generating }}...</p>
      </div>

      <!-- Outputs -->
      <div *ngFor="let output of outputs" class="output-section fade-in" style="margin-bottom:4px;">
        <div class="output-header" (click)="toggleOutput(output._id)">
          <div style="display:flex;align-items:center;gap:10px;">
            <span [ngSwitch]="output.outputType" style="font-size:18px;">
              <span *ngSwitchCase="'starter-kit'">✦</span>
              <span *ngSwitchCase="'logo-direction'">◎</span>
              <span *ngSwitchCase="'campaign-pack'">⚡</span>
            </span>
            <strong style="font-size:15px;">{{ formatType(output.outputType) }}</strong>
            <span class="muted" style="font-size:12px;">{{ output.createdAt | date:'medium' }}</span>
          </div>
          <span class="muted" style="font-size:18px;">{{ expandedOutputs[output._id] ? '−' : '+' }}</span>
        </div>

        <div class="output-body" *ngIf="expandedOutputs[output._id]">
          <!-- ==================== STARTER KIT ==================== -->
          <ng-container *ngIf="output.outputType === 'starter-kit'">
            <ng-container *ngIf="asStarterKit(output.content) as kit">
              <!-- Brand Names -->
              <div style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Brand Name Ideas</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span *ngFor="let name of kit.brandNames"
                        style="padding:8px 18px;border-radius:100px;background:linear-gradient(135deg,rgba(168,85,247,0.15),rgba(59,130,246,0.15));color:var(--text-primary);font-weight:600;font-size:15px;">
                    {{ name }}
                  </span>
                </div>
              </div>

              <!-- Taglines -->
              <div style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Taglines</h3>
                <div class="stack" style="gap:8px;">
                  <div *ngFor="let tagline of kit.taglines"
                       style="padding:12px 16px;border-left:3px solid var(--accent-purple);background:rgba(168,85,247,0.04);border-radius:0 8px 8px 0;font-style:italic;color:var(--text-primary);">
                    "{{ tagline }}"
                  </div>
                </div>
              </div>

              <!-- Mission -->
              <div style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Mission Statement</h3>
                <div style="padding:16px 20px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.12);border-radius:12px;line-height:1.7;color:var(--text-primary);">
                  {{ kit.mission }}
                </div>
              </div>

              <!-- Voice Pillars -->
              <div style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Voice Pillars</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span *ngFor="let pillar of kit.voicePillars" class="badge badge-emerald" style="font-size:13px;padding:6px 14px;">
                    {{ pillar }}
                  </span>
                </div>
              </div>

              <!-- Social Bios -->
              <div>
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Social Media Bios</h3>
                <div class="stack" style="gap:8px;">
                  <div *ngFor="let bio of kit.socialBios; let i = index"
                       style="padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;display:flex;gap:12px;align-items:flex-start;">
                    <span style="color:var(--accent-blue);font-weight:700;font-size:13px;min-width:20px;">{{ i + 1 }}.</span>
                    <span style="color:var(--text-primary);">{{ bio }}</span>
                  </div>
                </div>
              </div>
            </ng-container>
          </ng-container>

          <!-- ==================== LOGO DIRECTION ==================== -->
          <ng-container *ngIf="output.outputType === 'logo-direction'">
            <ng-container *ngIf="asLogoDirection(output.content) as logo">
              <div class="stack" style="gap:16px;">
                <div *ngFor="let dir of logo.directions; let i = index"
                     style="padding:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <h3 style="font-size:16px;">{{ dir.title }}</h3>
                    <span class="badge badge-purple">Direction {{ i + 1 }}</span>
                  </div>

                  <!-- Style Keywords -->
                  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
                    <span *ngFor="let kw of dir.styleKeywords"
                          style="padding:4px 10px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid var(--border);font-size:12px;color:var(--text-secondary);">
                      {{ kw }}
                    </span>
                  </div>

                  <!-- Color Palette -->
                  <div style="margin-bottom:14px;">
                    <span class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Color Palette</span>
                    <div style="display:flex;gap:10px;margin-top:8px;align-items:center;">
                      <div *ngFor="let color of dir.colorPalette" style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                        <span class="color-swatch" [style.background]="color" [title]="color"></span>
                        <span style="font-size:10px;color:var(--text-muted);font-family:monospace;">{{ color }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Typography Notes -->
                  <div style="margin-bottom:14px;">
                    <span class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Typography</span>
                    <p style="margin-top:4px;color:var(--text-primary);font-size:14px;">{{ dir.typographyNotes }}</p>
                  </div>

                  <!-- Image Prompt -->
                  <div>
                    <span class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Image Prompt</span>
                    <p style="margin-top:4px;color:var(--text-secondary);font-size:13px;font-style:italic;line-height:1.6;">{{ dir.imagePrompt }}</p>
                  </div>
                </div>
              </div>
            </ng-container>
          </ng-container>

          <!-- ==================== CAMPAIGN PACK ==================== -->
          <ng-container *ngIf="output.outputType === 'campaign-pack'">
            <ng-container *ngIf="asCampaignPack(output.content) as campaign">
              <!-- Hero Headlines -->
              <div style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Hero Headlines</h3>
                <div class="stack" style="gap:8px;">
                  <div *ngFor="let headline of campaign.heroHeadlines"
                       style="padding:16px 20px;background:linear-gradient(135deg,rgba(249,115,22,0.06),rgba(236,72,153,0.06));border:1px solid rgba(249,115,22,0.1);border-radius:12px;font-size:18px;font-weight:700;letter-spacing:-0.01em;color:var(--text-primary);">
                    {{ headline }}
                  </div>
                </div>
              </div>

              <!-- Ad Copies -->
              <div style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Ad Copy</h3>
                <div class="stack" style="gap:8px;">
                  <div *ngFor="let copy of campaign.adCopies; let i = index"
                       style="padding:14px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;">
                    <div style="display:flex;gap:10px;align-items:flex-start;">
                      <span class="badge badge-orange" style="min-width:fit-content;">Ad {{ i + 1 }}</span>
                      <span style="color:var(--text-primary);line-height:1.6;">{{ copy }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Email Subject Lines -->
              <div style="margin-bottom:20px;">
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Email Subject Lines</h3>
                <div class="stack" style="gap:6px;">
                  <div *ngFor="let subject of campaign.emailSubjectLines"
                       style="padding:10px 14px;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.08);border-radius:8px;display:flex;gap:8px;align-items:center;">
                    <span style="color:var(--accent-blue);">✉</span>
                    <span style="color:var(--text-primary);">{{ subject }}</span>
                  </div>
                </div>
              </div>

              <!-- CTAs -->
              <div>
                <h3 style="margin-bottom:10px;color:var(--text-secondary);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Call to Actions</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span *ngFor="let cta of campaign.ctas"
                        style="padding:10px 20px;border-radius:100px;background:var(--gradient-warm);color:#fff;font-weight:600;font-size:14px;box-shadow:var(--shadow-sm);">
                    {{ cta }}
                  </span>
                </div>
              </div>
            </ng-container>
          </ng-container>

          <!-- Twist Validation -->
          <div *ngIf="output.twistValidation" style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
            <span class="badge" [class.badge-emerald]="output.twistValidation.passed" [class.badge-pink]="!output.twistValidation.passed">
              Twist: {{ output.twistValidation.passed ? 'Passed ✓' : 'Failed ✗' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="card" *ngIf="!outputs.length && !loading" style="text-align:center;padding:48px;">
        <p style="font-size:32px;margin-bottom:8px;">✦</p>
        <p class="muted">No outputs yet. Generate your first brand asset above!</p>
      </div>
    </div>
  `
})
export class WorkspaceComponent implements OnInit {
  projectId = "";
  project: BrandProject | null = null;
  outputs: OutputRecord[] = [];
  loading = false;
  generating = "";
  error = "";
  expandedOutputs: Record<string, boolean> = {};

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
        // Auto-expand first output of each type
        for (const o of outputs) {
          if (this.expandedOutputs[o._id] === undefined) {
            this.expandedOutputs[o._id] = true;
          }
        }
      }
    });
  }

  generate(type: "starter-kit" | "logo-direction" | "campaign-pack"): void {
    if (this.loading) return;
    this.loading = true;
    this.generating = type;
    this.error = "";

    this.projectsApi.generate(this.projectId, type).subscribe({
      next: () => {
        this.loading = false;
        this.generating = "";
        this.reloadOutputs();
      },
      error: (err) => {
        this.loading = false;
        this.generating = "";
        this.error = err?.error?.message ?? "Generation failed";
      }
    });
  }

  toggleOutput(id: string): void {
    this.expandedOutputs[id] = !this.expandedOutputs[id];
  }

  formatType(type: string): string {
    return type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  asStarterKit(content: unknown): any {
    return content as any;
  }

  asLogoDirection(content: unknown): any {
    return content as any;
  }

  asCampaignPack(content: unknown): any {
    return content as any;
  }
}
