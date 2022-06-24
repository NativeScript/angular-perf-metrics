import {
  Component,
  inject,
  InjectFlags,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import {
  NativeScriptCommonModule,
  NativeScriptRouterModule,
  RouterExtensions,
} from "@nativescript/angular";
import { Page } from "@nativescript/core";
import { BENCHMARK_MODE, ROUTE_PROVIDER } from "./token";

@Component({
  selector: "benchmark-standalone",
  template: `
    <ng-container [ngSwitch]="benchmarkMode">
      <FlexBoxLayout *ngSwitchCase="'normal'" justifyContent="center">
        <Label text="Generating performance metrics"></Label>
        <ActivityIndicator [busy]="true"></ActivityIndicator>
      </FlexBoxLayout>

      <Label *ngSwitchCase="'fast'" text="Just running some benchmarks"></Label>
    </ng-container>
  `,
  imports: [NativeScriptCommonModule, NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
})
export class BenchmarkStandaloneComponent {
  nextRoute = inject(ROUTE_PROVIDER);
  benchmarkMode = inject(BENCHMARK_MODE, InjectFlags.Optional) || "normal";
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
