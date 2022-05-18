import {Injectable} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HtmlMapperData} from "./mapping-data";

@Injectable({
  providedIn: 'root'
})
export class HtmlMapperService {

  constructor(private sanitizer: DomSanitizer) {
  }

  public asImage(char: string): SafeHtml {
    let rc = char;
    const mapping = HtmlMapperData.MAPPINGS.mappings.find(mapping=>mapping.char==char);
    if (mapping && mapping.base64) {
      rc = '<img alt="' + char + '" src="data:image/gif;base64,' + mapping.base64 + '" width="25" height="25"/>'
    }else if (char===' ') {
      rc = '&nbsp;'
    }else{
      console.log(`No image mapping for '${char}'.`);
    }
    return this.sanitizer.bypassSecurityTrustHtml(rc);
  }

}
