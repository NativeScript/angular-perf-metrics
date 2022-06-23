# NativeScript for Angular

NativeScript empowers JavaScript with native platform APIs which means it also works with Angular in delightful ways.

For example, you can use your Angular skills to build rich iOS and Android experiences without ever leaving your TypeScript driven codebase.

To better illustrate what is meant by this, let's cover a few comparisons between standard web targeted Angular apps vs. NativeScript enabled Angular apps targeting iOS and Android platforms.

## Bootstrap

Web apps usually don't have to worry about the browser lifecycle, as the flow is pretty simple:
1. load page
2. user interacts with page
3. leave page

The user can even have multiple copies of the same application open. If the application is open, some UI is showing.

Mobile apps are a bit different. The app can be launched in the background, for example we can exit the app UI while the app itself is still running, the app may be in the background, whereby other lifecycle details may need to be taken into consideration by the developer.

To make this a bit more clear, let's look at the differences in bootstrapping:

### Angular Web Bootstrap

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// locate the app-root and bootstrap the component in it's place
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### Angular for iOS and Android via NativeScript Bootstrap

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

On NativeScript, your Angular app is a part of a broader picture (*an entirely new platform enriched picture*). 

It's good to understand `providedIn: 'root'` services are singletons for that single Angular app instance, so if you need a singleton for the broader "platform picture" you can use `providedIn: 'platform'`.

Let us elaborate on each platform:

1. On Android, when the user leaves the app with the back button the Activity is destroyed, so your ApplicationRef will be destroyed. This behavior has changed in Android 12 (https://developer.android.com/about/versions/12/behavior-changes-all#back-press), so from 12 and up the angular instance should not be destroyed anymore.

2. On both platforms, if the app is woken up by some kind of event, like a background fetch, your `main.ts` code will run, but the angular application will not be bootstrapped.

## Using Standalone Components

Using standalone components works just like the web!

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

Here we can use any NativeScript View components we desire with our standalone components whereby importing the `NativeScriptCommonModule` and they will work completely standalone.

## Using Directives

To understand how natural Angular development is with NativeScript let's look at a few additional examples directly from the Angular docs: https://angular.io/guide/attribute-directives

Directives work exactly as you would expect within the scope of iOS and Android development with NativeScript:

```
import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = "yellow";
  }
}
```

That is precisely the `highlight.directive.ts` example shown in the Angular docs and it works 100% the same when targeting iOS and Android with NativeScript, bearing in mind the visuals on screen are pure platform native views such as [UILabel](https://developer.apple.com/documentation/uikit/uilabel) on iOS and [TextView](https://developer.android.com/reference/android/widget/TextView) on Android represented simply via a [Label](https://docs.nativescript.org/ui-and-styling.html#label) view component provided by @nativescript/core:

```
<Label appHighlight text="Attribute Directive"></Label>
```

![Directives with NativeScript](./images/directives.png?raw=true "Directives with NativeScript")

### Event Considerations

In the Angular docs the directive is further enhanced with `mouseenter` and `mouseleave` events via the [HostListener](https://angular.io/api/core/HostListener) decorator.

This works the same in NativeScript regarding `HostListener`'s however only for events that are applicable for mobile platforms such as iOS and Android. For example we can do the following since [tap]() is a supported event binding (aka *gestures*) on the target platform:

```
import { Directive, ElementRef, HostListener, inject } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective {
  currentColor = "";
  private el = inject(ElementRef);

  @HostListener("tap") onTap() {
    if (this.currentColor) {
      this.currentColor = "";
    } else {
      this.currentColor = "yellow";
    }
    this.highlight(this.currentColor);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```
    
## Using Pipes

Pipes are also incredibly useful for Angular developers and work exactly as you would expect as well; taken directly from the Angular docs [here](https://angular.io/guide/pipe-template)

```

```

## Performance Metrics
    * time to boot/time to interactive (start metric before calling boostrap, stop it after app component ngAfterViewInit fires)
    * time to interactive
    * various marshalling metrics for extra context (Nathan)

* any other interesting details (perhaps code sharing - driving codebases from typescript based workspaces)
    * Nathan and Eduardo

* closing thoughts