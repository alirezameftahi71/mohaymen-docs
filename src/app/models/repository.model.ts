import {BaseItem} from './base-item.model';
import {Version} from './version.model';

export class Repository  extends BaseItem {
  versions: Version[];
}
