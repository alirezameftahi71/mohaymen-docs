import {BaseItem} from './base-item.model';

export class Document extends BaseItem {
  documents?: Document[];
  editUrl?: string;
}
