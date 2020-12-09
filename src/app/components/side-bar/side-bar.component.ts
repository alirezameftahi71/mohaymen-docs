import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { TreeNode } from '../../models/tree-node.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnChanges {
  @Input()
  items: TreeNode[];
  @Input()
  selectedKeys: string[] = [];
  @Input()
  expandedKeys: string[] = [];

  @Output()
  selectionChanged = new EventEmitter();

  searchTerm = '';
  dataSource: TreeNode[];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && changes.items.currentValue && changes.items.currentValue !== changes.items.previousValue) {
      this.searchTerm = '';
      this.dataSource = this.items;
    }
  }

  public search(items: TreeNode[], term: string): any[] {
    return items.reduce((acc: TreeNode[], item: TreeNode) => {
      if (this.contains(item.title, term)) {
        acc.push(item);
      } else if (item.children && item.children.length > 0) {
        const newItems = this.search(item.children, term);
        if (newItems.length > 0) {
          acc.push({ title: item.title, children: newItems });
        }
      }
      return acc;
    }, []);
  }

  public isItemSelected = (_: any, index: string) => this.selectedKeys.indexOf(index) > -1;

  public isItemExpanded = (_: any, index: string) => this.expandedKeys.indexOf(index) > -1;

  public contains(text: string, term: string): boolean {
    return text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
  }

  public onkeyup(value: string): void {
    this.dataSource = this.search(this.items, value);
  }

  public onSelectionChange(item: any): void {
    this.selectionChanged.emit(item);
  }
}
