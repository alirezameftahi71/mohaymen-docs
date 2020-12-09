import { Injectable } from '@angular/core';
import {Repository} from './models/Repository.model';
import {SiteConfig} from './models/site-config.model';
import {Version} from './models/version.model';
import {Document} from './models/document.model';

const rootPath = 'assets';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() {
    this.setSiteConfig();
  }
  siteConfig: SiteConfig;

  
  private static async sendRequest(url: string): Promise<Response> {
    const response = await fetch(url, {
      cache: 'no-cache'
    });
    if (!response.ok) {
      throw response;
    }
    return response;
  }

  async getRepositories(): Promise<Repository[]> {
    const response = await AppService.sendRequest(`${rootPath}/docs/repository.json`);
    const json = await response.json();
    return (json as Repository[]);
  }

  async getVersionsByRepoParam(repositoryParam: string): Promise<Version[]> {
    const response = await AppService.sendRequest(`${rootPath}/docs/${repositoryParam}/version.json`);
    const json = await response.json();
    return (json as Version[]);
  }

  async getRepositoryByRepoParam(repositoryParam: string): Promise<Repository> {
    const repos = await this.getRepositories();
    return repos.find(x => x.url === repositoryParam);
  }

  async getDocumentsByRepoVersionParam(versionParam: string): Promise<Document[]> {
    const response = await AppService.sendRequest(`${rootPath}/docs/${versionParam}/doc.json`);
    const json = await response.json();
    return (json as Document[]);
  }

  async getHTMLContent(url: string): Promise<string> {
    const response = await AppService.sendRequest(`${rootPath}/docs/${url}.html`);
    return await response.text();
  }

  async setSiteConfig(): Promise<void> {
    const response = await AppService.sendRequest(`${rootPath}/site.json`);
    this.siteConfig = await response.json();
  }
}
