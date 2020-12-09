import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import AnchorJS from 'anchor-js';
import * as hljs from 'highlight.js';

@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.scss']
})
export class DocumentContentComponent implements OnChanges {
  @Input()
  docContent: string;
  @Output()
  anchorsAdded = new EventEmitter<any[]>();

  wordCount: number;
  anchors: any;

  constructor() {
  }

  private static getWordsCount(str: string): number {
    if (!str) {
      return 0;
    }
    str = str.replace(/<[^>]*>/g, ' ');
    str = str.replace(/\s+/g, ' ');
    str = str.trim();
    return str.split(' ').length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setWordCount();
    setTimeout(() => {
      this.initCodeBlockHeaders();
      this.initAnchorsjs();
      this.initHighlightJs();
    });
  }

  private initAnchorsjs() {
    this.anchors = new AnchorJS();
    this.anchors.options = {
      placement: 'right',
      class: 'custom-anchor',
    };
    this.anchors.add('h2');
    this.anchorsAdded.emit(this.anchors.elements);
  }

  private initCodeBlockHeaders() {
    const languagePrefix = 'language-';

    document.querySelectorAll('pre').forEach(block => {
      const classList = block.querySelector('code').classList;
      const classListArray = Array.from(classList);
      const languageClass = classListArray.find(x => x.includes(languagePrefix));
      if (languageClass) {
        const language = languageClass.replace(languagePrefix, '');
        const headerBlock = `<div dir="auto" class="code-block-header">
                                <span class="language">${language}</span>
                            </div>`;
        const headerElement = this.createElementFromHTML(headerBlock);
        block.before(headerElement);
      }
    });
  }

  private createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  private setWordCount(): void {
    this.wordCount = DocumentContentComponent.getWordsCount(this.docContent);
  }

  private initHighlightJs() {
    document.querySelectorAll('pre code').forEach(block => {
      hljs.highlightBlock(block as HTMLElement);
    });
  }
}
