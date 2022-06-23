# NativeScript for Angular

## Overview

NativeScript empowers JavaScript with native platform APIs which means it also works with Angular in delightful ways.

For example, you can use your Angular skills to build rich iOS and Android experiences without ever leaving your TypeScript driven codebase.

## Bootstrap Comparisons (Eduardo)
    * compare/contrast differences - discuss what happens from device vs. web app perhaps

Web apps usually don't have to worry about the browser lifecycle, as the flow is pretty simple: load page, user interacts with page, leave page. The user can even have multiple copies of the same application open. If the application is open, some UI is showing.

Mobile apps are a bit different. The app can be launched in the background, exit the app UI while the app itself is still running, the app may be on the background, and many other lifecycle details that the developer has to take in consideration.

To make this a bit more clear, let's look at the differences in bootstrapping:

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// locate the app-root and bootstrap the component in it's place
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

```ts
import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import { AppModule } from './app/app.module';

// runs the NativeScript application, nothing is bootstrapped yet, as we're only setting up the platform and callbacks
runNativeScriptAngularApp({
  // this function will be called when we need to display the application UI
  // a major difference from the web is that this module may be destroyed when the user leaves the application and recreated when the user opens it again
  // so remember to implement all the needed ngOnDestroy to cleanup any events that were bound here!
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
```

On NativeScript, your angular application is a part of a bigger application. providedIn: 'root' services are singletons for that single angular instance, so if you need an actual singleton you can use providedIn: 'platform'. When does this happen exactly:
1. On Android, when the user leaves the app with the back button the Activity is destroyed, so your ApplicationRef will be destroyed.
2. On both platforms, if the app is woken up by some kind of event, like a background fetch, your `main.ts` code will run, but the angular application will not be bootstrapped.

## Using Standalone Components (Eduardo)

Using standalone components works just like the web! Example:

```ts
import { Component } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

@Component({
  selector: "hello-standalone",
  template: `<Label text="Hello, I'm a standalone component"></Label>`,
  imports: [NativeScriptCommonModule],
  standalone: true,
})
export class HelloStandaloneComponent {}
```

## Using Directives (Nathan)
    
## Using Pipes (Nathan)

## Performance Metrics
    * time to boot/time to interactive (start metric before calling boostrap, stop it after app component ngAfterViewInit fires)
    * time to interactive
    * various marshalling metrics for extra context (Nathan)

* any other interesting details (perhaps code sharing - driving codebases from typescript based workspaces)
    * Nathan and Eduardo

* closing thoughts