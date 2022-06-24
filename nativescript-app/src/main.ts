import {
  platformNativeScript,
  runNativeScriptAngularApp,
} from "@nativescript/angular";
import { enableProdMode } from "@angular/core";

import { AppModule } from "./app/app.module";

console.time('JS to full navigation');
console.time("JS to full ui");

enableProdMode();

runNativeScriptAngularApp({
  appModuleBootstrap: () => {
    console.time("bootstrap took");
    console.time("bootstrap to full ui");
    return platformNativeScript().bootstrapModule(AppModule);
  },
});

