import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
  RouterExtensions,
} from "@nativescript/angular";
import { Page } from "@nativescript/core";
import { ROUTE_PROVIDER } from "./token";

@Component({
  selector: "benchmark-standalone",
  template: `<Label text="Generating performance metrics"></Label>`,
  imports: [NativeScriptCommonModule, NativeScriptRouterModule],
  standalone: true,
})
export class BenchmarkStandaloneComponent {
  nextRoute = inject(ROUTE_PROVIDER);
  constructor(page: Page, router: RouterExtensions) {
    page.once("navigatedTo", () => {
      console.timeEnd("JS to full navigation");
      setTimeout(
        () =>
          router.navigate([this.nextRoute], {
            clearHistory: true,
            animated: false,
          }),
        1000
      );
    });
  }
}
