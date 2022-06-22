import { AfterViewInit, Component } from '@angular/core'

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit() {
    console.timeEnd('bootstrap took');
  }
}
