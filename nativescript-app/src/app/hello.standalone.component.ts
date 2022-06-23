import { Component } from "@angular/core";
import { NativeScriptCommonModule, NativeScriptRouterModule } from "@nativescript/angular";

@Component({
  selector: "hello-standalone",
  template: `<Button [nsRouterLink]="'/lazy'" text="Hello, I'm a standalone component, click me"></Button>`,
  imports: [NativeScriptCommonModule, NativeScriptRouterModule],
  standalone: true,
})
export class HelloStandaloneComponent {}
