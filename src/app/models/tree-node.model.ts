import { BaseItem } from './base-item.model';

export class TreeNode extends BaseItem {
  children?: TreeNode[];
}
