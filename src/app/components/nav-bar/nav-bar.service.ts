import {Injectable} from '@angular/core';
import {Document} from '../../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {
  public navbarButtons: Document[];

}
