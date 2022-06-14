import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SafeHtml} from "@angular/platform-browser";
import {HtmlMapperService} from "../../service/html-mapper.service";

@Component({
  selector: 'app-meadow-display',
  templateUrl: './meadow-display.component.html',
  styleUrls: ['./meadow-display.component.scss']
})
export class MeadowDisplayComponent implements OnInit {
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
    const rc = await this.http.get('/api/generate/meadow/newWaveformCollapse').toPromise();
    // const rc = await this.http.get('/api/generate/meadow/newNatural').toPromise();
    // console.log(rc);
    this.area = [];
    this.areaAsText = (rc as any).asText;
    this.rows = (rc as any).rows;
    ((rc as any).area as string[]).forEach(line => this.area.push(...line));
  }

}
