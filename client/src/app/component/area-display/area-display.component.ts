import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SafeHtml} from "@angular/platform-browser";
import {HtmlMapperService} from "../../service/html-mapper.service";

@Component({
  selector: 'app-area-display',
  templateUrl: './area-display.component.html',
  styleUrls: ['./area-display.component.scss']
})
export class AreaDisplayComponent implements OnInit {
  public area: string[] = [];
  public areaAsText: string='';
  public rows =0;

  constructor(private http: HttpClient, private htmlMapper:HtmlMapperService) {
  }

  public ngOnInit(): void {
    this.getNewArea().then();
  }

  public asImage(char: string): SafeHtml {
    return this.htmlMapper.asImage(char);
  }

  private async getNewArea(): Promise<void> {
    //TODO make url parameter
    // const rc = await this.http.get('/api/generate/continent/newColumns').toPromise();
    const rc = await this.http.get('/api/generate/continent/newRandom').toPromise();
    // console.log(rc);
    this.area = [];
    this.areaAsText = (rc as any).asText;
    this.rows = (rc as any).rows;
    ((rc as any).area as string[]).forEach(line => this.area.push(...line));
  }

}
