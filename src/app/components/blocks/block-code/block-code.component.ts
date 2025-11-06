import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as shiki from 'shiki';
import type { Highlighter } from 'shiki';

@Component({
  selector: 'block-code',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './block-code.component.html',
  styleUrl: './block-code.component.scss'
})
export class BlockCodeComponent implements AfterViewInit, OnChanges {
  @ViewChild('codeElement', { static: false }) codeElement!: ElementRef<HTMLElement>;
  
  @Input() code?: string;
  @Input() language: string = 'typescript';
  
  private highlighter: Highlighter | null = null;
  private highlighterPromise: Promise<Highlighter> | null = null;
  private isHighlighted = false;

  ngAfterViewInit(): void {
    this.initHighlighter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] || changes['language']) {
      this.isHighlighted = false;
      if (this.codeElement) {
        setTimeout(() => this.highlightCode(), 0);
      }
    }
  }

  private async initHighlighter(): Promise<void> {
    if (!this.highlighterPromise) {
      this.highlighterPromise = shiki.createHighlighter({
        themes: ['aurora-x'],
        langs: ['typescript', 'javascript', 'html', 'css', 'tsx', 'jsx', 'json', 'bash', 'shell'],
      }).then((hl: Highlighter) => {
        this.highlighter = hl;
        return hl;
      });
    }
    
    await this.highlighterPromise;
    await this.highlightCode();
  }

  private async highlightCode(): Promise<void> {
    if (this.isHighlighted || !this.codeElement?.nativeElement) {
      return;
    }

    const codeEl = this.codeElement.nativeElement;
    let textContent = this.code;
    
    // If no code prop, get from ng-content
    if (!textContent) {
      textContent = codeEl.textContent?.trim();
    }

    if (!textContent) {
      return;
    }

    try {
      if (!this.highlighter && this.highlighterPromise) {
        await this.highlighterPromise;
      }

      if (this.highlighter) {
        const langMap: { [key: string]: string } = {
          'typescript': 'ts',
          'javascript': 'js',
          'html': 'html',
          'css': 'css',
          'tsx': 'tsx',
          'jsx': 'jsx',
          'json': 'json',
          'bash': 'bash',
          'shell': 'shell'
        };

        const shikiLang = langMap[this.language] || 'ts';
        const html = this.highlighter.codeToHtml(textContent, {
          lang: shikiLang,
          theme: 'aurora-x'
        });

        codeEl.innerHTML = html;
        this.isHighlighted = true;
      }
    } catch (error) {
      console.error('Shiki highlighting error:', error);
      codeEl.textContent = textContent;
    }
  }

  get displayCode(): string {
    return this.code || '';
  }
}
