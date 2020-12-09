import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app.service';
import {Document} from '../models/document.model';
import {TreeNode} from '../models/tree-node.model';
import {BaseItem} from '../models/base-item.model';
import {TocItem} from '../models/toc-item.model';
import {ParametersStatus} from '../models/parameters-status.model';
import {Repository} from '../models/Repository.model';
import {NavBarService} from '../components/nav-bar/nav-bar.service';
import {Version} from '../models/version.model';
import {LocationStrategy} from '@angular/common';

@Component({
  selector: 'app-docs',
  templateUrl: './docs-page.component.html',
  styleUrls: ['./docs-page.component.scss']
})
export class DocsPageComponent implements OnInit {

  constructor(private appService: AppService,
              private navBarService: NavBarService,
              private router: Router,
              private location: LocationStrategy,
              private route: ActivatedRoute) {
  }

  repository: Repository;
  documents: Document[];
  treeNodes: TreeNode[];
  versions: Version[];
  expandedKeys: string[] = [];
  selectedKeys: string[] = [];
  tocItems: TocItem[];
  selectedDocument: Document;
  docContent: string;
  treeNodesIndexMap = new Map<string, string>();
  breadcrumbItems: BaseItem[];
  dimmerEnabled = false;
  selectedVersion: Version;
  showEditBtn: boolean;
  editBtnPath: string;
  private allRepoItemsMap: Map<string, BaseItem>;

  private static scrollToAnchorIfExists(): void {
    const anchorElement = document.getElementById(decodeURIComponent(window.location.hash).replace('#', ''));
    if (anchorElement != null) {
      anchorElement.scrollIntoView();
    }
  }

  private static getExpandedSidebarItemIndexes(str: string): string[] {
    const res: string[] = [];
    const splitterChar = '_';
    const collection: string[] = str.split(splitterChar);
    let temp = '';
    for (const char of collection) {
      temp += char;
      res.push(temp);
      temp += splitterChar;
    }
    return res;
  }

  private static getPathname(): string {
    return window.location.pathname;
  }

  private static getPassedParametersStatus(segments: string[]): ParametersStatus {
    const segmentsCount = segments.length;
    const noSegment = segmentsCount === 0;
    const onlyProduct = segmentsCount === 1;
    const productHasVersion = segmentsCount === 2;
    const hasSelectedDoc = segmentsCount > 2;
    return {noSegment, onlyRepository: onlyProduct, productHasVersion, hasSelectedDoc};
  }

  private static truncateAfterString(original: string, pattern: string): string {
    const regex = new RegExp('\\b' + pattern + '\\b');
    return original.substring(0, original.search(regex) + pattern.length);
  }

  private static checkRtl(str: string) {
    const RTL = ['آ', 'ا', 'ب', 'پ', 'ت', 'س', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش'
      , 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی'];
    return str.split('').some(x => RTL.includes(x));
  }

  ngOnInit(): void {
    this.route.url.subscribe(segments =>
      this.initPage(segments.map(x => x.path))
    );
  }

  onAnchorsAdd(els: HTMLElement[]): void {
    this.setTocItems(els);
    DocsPageComponent.scrollToAnchorIfExists();
  }

  onSidebarToggleClick(): void {
    this.showSidebar();
  }

  onSelectedVersionChange(versionParam: string): void {
    const selectedDocFullUrl = this.selectedDocument ? this.selectedDocument.url : '';
    const selectedVersionUrl = this.selectedVersion ? this.selectedVersion.url : '';
    const returnToUrl = selectedDocFullUrl.replace(selectedVersionUrl, '');
    this.redirectTo(`docs/${versionParam}/${returnToUrl}`);
  }

  onDimmerClick(): void {
    this.hideSidebar();
  }

  async onSidebarSelectionChange(item: any): Promise<void> {
    const node: TreeNode = item.dataItem as TreeNode;
    if (node.type === 'file') {
      await this.redirectTo(`docs/${node.url}`);
      this.hideSidebar();
    } else {
      const index = this.treeNodesIndexMap.get(node.url);
      this.expandedKeys = DocsPageComponent.getExpandedSidebarItemIndexes(index);
    }
  }

  showSidebar(): void {
    document.getElementById('floating-sidebar').style.display = 'block';
    this.dimmerEnabled = true;
  }

  hideSidebar(): void {
    document.getElementById('floating-sidebar').style.display = 'none';
    this.dimmerEnabled = false;
  }

  private async initPage(params: string[]): Promise<void> {
    this.setNavBarItems();
    const purePath = this.getPurePathname();
    const parametersStatus = DocsPageComponent.getPassedParametersStatus(params);

    if (parametersStatus.noSegment) {
      this.redirectTo('404');
    }

    const repositoryParam = DocsPageComponent.truncateAfterString(purePath, params[0]);
    await this.setRepository(repositoryParam);
    await this.setVersions(repositoryParam);

    const versionParam = !parametersStatus.onlyRepository ? DocsPageComponent.truncateAfterString(purePath, params[1]) : null;
    this.setSelectedVersion(versionParam);

    await this.setDocuments();

    this.setItemMaps();

    this.setSidebarItems();
    this.setBreadcrumbItems(params);

    const selectedDocumentParam = this.getMapKeyByValue(this.treeNodesIndexMap, this.selectedKeys[0]);
    this.setSelectedDocument(selectedDocumentParam);
    await this.setDocumentContent();
    this.setEditBtnConfig();
  }

  private getPurePathname(): string {
    return this.extractPurePath(DocsPageComponent.getPathname());
  }

  private extractPurePath(path: string): string {
    const baselessPath = this.getBaselessUrl(path);
    return baselessPath.replace('/docs/', '');
  }

  private getBaselessUrl(path: string): string {
    return `/${path.replace(this.location.getBaseHref(), '')}`;
  }

  private async setDocumentContent() {
    this.docContent = '';
    if (this.selectedDocument) {
      try {
        this.docContent = await this.appService.getHTMLContent(this.selectedDocument.url);
      } catch (e) {
        this.docContent = `<h1>خطا</h1><p>صفحه‌ی مورد نظر وجود ندارد یا در دریافت آن خطا رخ داده است.</p>`;
      }
    }
  }

  private async setRepository(repositoryParam: string): Promise<void> {
    this.repository = await this.appService.getRepositoryByRepoParam(repositoryParam);
  }

  private async setVersions(repositoryId: string): Promise<void> {
    try {
      this.versions = await this.appService.getVersionsByRepoParam(repositoryId);
    } catch (e) {
      this.versions = [];
    }
  }

  private async setDocuments(): Promise<void> {
    try {
      const documents = this.selectedVersion ?
        await this.appService.getDocumentsByRepoVersionParam(this.selectedVersion.url) : [];
      this.documents = this.fixDocumentUrl(documents);
    } catch (e) {
      this.documents = [];
    }
  }

  private async setSelectedDocument(selectedDocumentParam: string): Promise<void> {
    if (selectedDocumentParam) {
      this.selectedDocument = this.allRepoItemsMap.get(selectedDocumentParam);
    } else {
      this.selectedDocument = null;
    }
  }

  private setNavBarItems(): void {
    this.navBarService.navbarButtons = [
      {title: 'مستندات', url: ''},
      {title: 'پرونده‌ها', url: this.getBaselessUrl(DocsPageComponent.getPathname())}
    ];
  }

  private setBreadcrumbItems(params: string[]): void {
    const pathname = DocsPageComponent.getPathname();
    const breadcrumbItems: BaseItem[] = [];
    params.forEach(param => {
      const path = DocsPageComponent.truncateAfterString(pathname, param);
      const url = this.extractPurePath(path);
      const object = this.allRepoItemsMap.get(url) as Document;
      if (object) {
        const _path = object.documents && object.documents.length > 0 ? null : this.getBaselessUrl(path);
        breadcrumbItems.push({
          title: object.title,
          url: _path,
          type: object.type
        });
      }
    });
    this.breadcrumbItems = breadcrumbItems;
  }

  private setSidebarItems(): void {
    this.setTreeNodes();
    const toBeSelectedItemIndex = this.getActiveSidebarItemFromPath();
    this.selectedKeys = [toBeSelectedItemIndex];
    this.expandedKeys = DocsPageComponent.getExpandedSidebarItemIndexes(toBeSelectedItemIndex);
  }

  private setTocItems(els: HTMLElement[]): void {
    this.tocItems = els.map((element: HTMLElement) => {
      const title = element.innerText;
      const isRtl = DocsPageComponent.checkRtl(title);
      const fragment = element.getAttribute('id');
      const url = this.getBaselessUrl(element.querySelector('a.anchorjs-link').getAttribute('href').replace(`#${fragment}`, ''));
      return {title, fragment, url, isRtl};
    });
  }

  private getActiveSidebarItemFromPath(): string {
    const pathname = this.getPurePathname();
    return this.treeNodesIndexMap.get(pathname) || '0';
  }

  private getNodeUrl(url: string) {
    return `${this.selectedVersion.url}/${url}`;
  }

  private convertDocumentToTreeNode(documents: Document[] = []): TreeNode[] {
    return documents.map(doc => (
      {
        title: doc.title,
        url: doc.url,
        type: doc.type,
        children: this.convertDocumentToTreeNode(doc.documents || [])
      }
    ));
  }

  private fixDocumentUrl(documents: Document[] = []): Document[] {
    return documents.map(doc => (
      {
        title: doc.title,
        url: this.getNodeUrl(doc.url),
        editUrl: doc.editUrl,
        type: doc.type,
        documents: this.fixDocumentUrl(doc.documents || [])
      }
    ));
  }

  private setSelectedVersion(versionParam: string): void {
    if (versionParam != null) {
      this.selectedVersion = this.versions.find(x => x.url === versionParam);
    } else if (this.versions.length > 0) {
      this.selectedVersion = this.versions[0];
    }
  }

  private setTreeNodes(): void {
    this.treeNodes = this.convertDocumentToTreeNode(this.documents);
  }

  private setItemMaps(): void {
    this.treeNodesIndexMap = this.calculateTreeNodesIndexMap(this.documents, null);
    this.allRepoItemsMap = this.calculateAllRepoItemsMap();
  }

  private getMapKeyByValue(map, value): any {
    let res: any = '';
    map.forEach((val: any, key: any) => {
      if (val === value) {
        res = key;
      }
    });
    return res;
  }

  private redirectTo(url: string): void {
    this.router.navigate([url]).then(() => false);
  }

  private calculateTreeNodesIndexMap(items: Document[] = [], basePath: string): Map<string, string> {
    const res = new Map<string, string>();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const pathString = basePath ? `${basePath}_${i}` : i.toString();
      res.set(item.url, pathString);
      if (item.documents && item.documents.length > 0) {
        const tmpRes = this.calculateTreeNodesIndexMap(item.documents, pathString);
        tmpRes.forEach((value, key) => {
          res.set(key, value);
        });
      }
    }
    return res;
  }

  private calculateAllRepoItemsMap(): Map<string, BaseItem> {
    const res = new Map<string, BaseItem>();
    res.set(this.repository.url, this.repository);
    if (this.documents && this.documents.length > 0) {
      const map = this.calculateNodesDocumentsDictionary(this.documents);
      map.forEach((value, key) => {
        res.set(key, value);
      });
    }
    return res;
  }

  private calculateNodesDocumentsDictionary(items: Document[]): Map<string, BaseItem> {
    const res = new Map<string, BaseItem>();
    for (const item of items) {
      res.set(item.url, item);
      if (item.documents && item.documents.length > 0) {
        const tmpRes = this.calculateNodesDocumentsDictionary(item.documents);
        tmpRes.forEach((value, key) => {
          res.set(key, value);
        });
      }
    }
    return res;
  }

  private setEditBtnConfig(): void {
    this.showEditBtn = this.selectedDocument ?
      (this.selectedDocument.type === 'file' && !!this.selectedDocument.editUrl) : false;
    this.editBtnPath = this.showEditBtn ? this.selectedDocument.editUrl : null;
  }
}
