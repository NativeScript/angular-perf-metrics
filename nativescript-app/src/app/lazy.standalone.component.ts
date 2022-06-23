import { Component, inject, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { ROUTE_PROVIDER } from "./token";

@Component({
  selector: "hello-standalone",
  template: ` <StackLayout>
    <Label
      [textWrap]="true"
      text="Hello, I'm a lazy standalone component. This is a value provided in my route and injected with inject():"
    ></Label>
    <Label [text]="routeProvider"></Label>
  </StackLayout>`,
  styles: [
    `
      StackLayout {
        padding: 20;
        vertical-align: middle;
      }
    `,
  ],
  imports: [NativeScriptCommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
})
export class LazyStandaloneComponent {
  routeProvider = inject(ROUTE_PROVIDER);
}
