import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SafeHtml} from "@angular/platform-browser";
import {HtmlMapperService} from "../../service/html-mapper.service";

@Component({
  selector: 'app-landscape-display',
  templateUrl: './landscape-display.component.html',
  styleUrls: ['./landscape-display.component.scss']
})
export class LandscapeDisplayComponent implements OnInit {
  public landscape: string[] = [];

  constructor(private http: HttpClient, private htmlMapper:HtmlMapperService) {
  }

  public ngOnInit(): void {
    this.getNewLandscape().then();
  }

  public asImage(char: string): SafeHtml {
    return this.htmlMapper.asImage(char);
  }

  private async getNewLandscape(): Promise<void> {
    const rc = await this.http.get('/api/generate/new').toPromise();
    console.log(rc);
    this.landscape = [];
    ((rc as any).landscape as string[]).forEach(line => this.landscape.push(...line));
  }

}
