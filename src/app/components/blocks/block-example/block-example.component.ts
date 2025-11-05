import { Component, Input, TemplateRef, ViewChild, AfterViewChecked, ElementRef, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges, ContentChild, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../base/button/button.component';
import { TabsetComponent, Tab } from '../../base/tabset/tabset.component';
import { TabsetItemComponent } from '../../base/tabset/tabset-item/tabset-item.component';
import { TabContentComponent } from '../../base/tabset/tab-content/tab-content.component';
import { DialogComponent } from '../../base/dialog/dialog.component';
import * as shiki from 'shiki';
import type { Highlighter } from 'shiki';

@Component({
  selector: 'block-example',
  imports: [ CommonModule, RouterLink, ButtonComponent, TabsetComponent, TabsetItemComponent, TabContentComponent, DialogComponent],
  standalone:true,
  templateUrl: './block-example.component.html',
  styleUrl: './block-example.component.scss'
})
export class BlockExampleComponent implements AfterViewChecked, OnInit, OnChanges, AfterContentInit {
  @ViewChild('exampleDialog') exampleDialog!: DialogComponent;
  @ViewChild('codeBlock', { static: false }) codeBlock!: ElementRef<HTMLElement>;
  @ContentChild('code', { static: false }) codeTemplate!: TemplateRef<any>;

  @Input() title?: string;
  @Input() description?: string;
  @Input() codeString?: string;
  @Input() language: string = 'html';
  @Input() content?: TemplateRef<any>;
  @Input() onRetrigger?: () => void;
  @Input() showBreadcrumbs: boolean = false;
  @Input() exampleTitle?: string;
  @Input() prevExample?: { path: string; title: string };
  @Input() nextExample?: { path: string; title: string };

  private codeHighlighted = false;
  private highlighter: Highlighter | null = null;
  private highlighterPromise: Promise<Highlighter> | null = null;

  tabs: Tab[] = [
    { id: 'content', title: 'Preview' },
    { id: 'code', title: 'Code' }
  ];

  activeTab = 'content';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize Shiki highlighter with aurora-x theme
    this.highlighterPromise = shiki.createHighlighter({
      themes: ['aurora-x'],
      langs: ['typescript', 'javascript', 'html', 'css', 'tsx', 'jsx'],
    }).then((hl: Highlighter) => {
      this.highlighter = hl;
      return hl;
    });
    console.log('BlockExampleComponent ngOnInit - codeString:', this.codeString, 'codeTemplate:', !!this.codeTemplate);
  }

  ngAfterContentInit(): void {
    console.log('BlockExampleComponent ngAfterContentInit - codeTemplate:', !!this.codeTemplate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['codeString']) {
      console.log('BlockExampleComponent ngOnChanges - codeString changed:', this.codeString);
      this.codeHighlighted = false; // Reset highlighting when code changes
    }
  }

  handleTabChange(tabId: string) {
    this.activeTab = tabId;
  }

  async toggleDialog(): Promise<void> {
    if (this.exampleDialog.isOpen) {
      await this.exampleDialog.closeDialog();
      this.codeHighlighted = false;
    } else {
      await this.exampleDialog.openDialog();
      this.codeHighlighted = false; // Reset to re-highlight on open
      // Use setTimeout to ensure DOM is rendered before highlighting
      setTimeout(async () => {
        await this.highlightCode();
      }, 0);
    }
  }

  ngAfterViewChecked(): void {
    if (this.exampleDialog?.isOpen && !this.codeHighlighted && this.codeBlock) {
      // Small delay to ensure content is rendered
      setTimeout(async () => {
        await this.highlightCode();
      }, 10);
    }
  }

  private async highlightCode(): Promise<void> {
    if (this.codeBlock?.nativeElement) {
      const codeElement = this.codeBlock.nativeElement.querySelector('code');
      if (codeElement) {
        const textContent = codeElement.textContent?.trim();
        console.log('highlightCode - textContent:', textContent?.substring(0, 50));
        
        if (textContent) {
          try {
            // Wait for highlighter to be ready
            if (!this.highlighter && this.highlighterPromise) {
              await this.highlighterPromise;
            }

            if (this.highlighter) {
              // Map language names
              const langMap: { [key: string]: string } = {
                'typescript': 'ts',
                'javascript': 'js',
                'html': 'html',
                'css': 'css',
                'tsx': 'tsx',
                'jsx': 'jsx'
              };
              
              const shikiLang = langMap[this.language] || 'ts';
              const html = this.highlighter.codeToHtml(textContent, {
                lang: shikiLang,
                theme: 'aurora-x'
              });
              
              codeElement.innerHTML = html;
              this.codeHighlighted = true;
              console.log('Code highlighted successfully with Shiki');
            }
          } catch (error) {
            console.error('Shiki highlighting error:', error);
          }
        } else {
          console.warn('Code element is empty, cannot highlight');
        }
      } else {
        console.warn('Code element not found');
      }
    }
  }

  get displayCode(): string {
    console.log('displayCode - codeString:', this.codeString);
    if (this.codeString) {
      return this.codeString;
    }
    // Extract code from template if available
    return '';
  }

  get hasCode(): boolean {
    return !!this.codeString || !!this.codeTemplate;
  }

  get code(): TemplateRef<any> | undefined {
    return this.codeTemplate;
  }
}
