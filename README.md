# NativeScript for Angular

NativeScript empowers JavaScript with native platform APIs which means it also works with Angular in delightful ways (past v2 - v13, current v14 and future releases!).

For example, you can use your Angular skills to build rich Android and iOS experiences leveraging the full scope and versatility of your TypeScript skills.

To better illustrate what is meant by this, let's cover a few comparisons between standard web targeted Angular apps vs. NativeScript enabled Angular apps targeting iOS and Android platforms.

- [Bootstrap](#bootstrap)
  - [Angular Web Bootstrap](#angular-web-bootstrap)
  - [Angular for iOS and Android via NativeScript Bootstrap](#angular-for-ios-and-android-via-nativescript-bootstrap)
- [Understanding the Lifecycle](#understanding-the-lifecycle)
- [Using Standalone Components](#using-standalone-components)
- [Using Directives](#using-directives)
  - [Event Considerations](#event-considerations)
- [Using Pipes](#using-pipes)
- [Performance Metrics](#performance-metrics)
  - [Performance Angular Web Bootstrap](#performance-angular-web-bootstrap)
  - [Performance Angular for iOS and Android via NativeScript Bootstrap](#performance-angular-for-ios-and-android-via-nativescript-bootstrap)
  - [Performance Pure Native](#performance-pure-native)
- [StackBlitz learn by example](#stackBlitz-learn-by-example)
- [Summary](#summary)

## Bootstrap

Web apps usually don't have to worry much about the browser lifecycle as the flow is pretty straight-forward:

1. load page
2. user interacts with page
3. leave page

The user can even have multiple copies of the same application open across different browser tabs or windows. If the application is open, some UI is showing.

Mobile apps are a bit different.

For example the app can be launched in the background. In other words, we can exit the app UI while the app itself is still running in the background whereby other lifecycle details may need to be taken into consideration by the developer.

To make this a bit more clear, let's look at the differences in app bootstrap:

### Angular Web Bootstrap

```ts
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

// locate the app-root and bootstrap the component in it's place
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

### Angular for iOS and Android via NativeScript Bootstrap

```ts
import {
  platformNativeScript,
  runNativeScriptAngularApp,
} from "@nativescript/angular";
import { AppModule } from "./app/app.module";

// runs the NativeScript application, nothing is bootstrapped yet, as we're only setting up the platform and callbacks
runNativeScriptAngularApp({
  // this function will be called when we need to display the application UI
  // a major difference from the web is that this module may be destroyed when the user leaves the application and recreated when the user opens it again
  // so remember to implement all the needed ngOnDestroy to cleanup any events that were bound here!
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
```

On NativeScript, your Angular app is a part of a broader picture (_an entirely new platform enriched picture_).

It's good to understand `providedIn: 'root'` services are singletons for that _singlular_ Angular app instance, so if you need a singleton for the broader "platform picture" you can use `providedIn: 'platform'`.

Let us elaborate:

1. On Android, when the user leaves the app with the back button the Activity is destroyed, so your ApplicationRef will be destroyed. This behavior has changed in Android 12 (https://developer.android.com/about/versions/12/behavior-changes-all#back-press), so from 12 and up the angular instance should not be destroyed anymore.

2. On both platforms, if the app is woken up by some kind of event, like a background fetch, your `main.ts` code will run, but the angular application will not be bootstrapped.

## Understanding the Lifecycle

Having direct access to the native platform is a powerful tool, but it's important to understand how the platform itself works.

1. The platform launches your application.
   1. This can be either in the background or the foreground. This is where android's Application is created and iOS' main function is called.
2. The runtime (V8) is initialized at the earliest possible time.
3. Your application entrypoint is called (main.ts)
   1. Everything from this point onwards happens in JS through the NativeScript Runtime
4. Application is initialized in `runNativeScriptAngularApp`
   1. This calls `UIApplicationMain` on iOS and sets up the Application and Activity callbacks for Android.
5. (optional) `appModuleBootstrap` is called
   1. If the app has been launched in the background, maybe because of a background fetch event, or a firebase Data push notification, the angular application may not be bootstrapped at all unless the user opens the app during this time.

What this means in practice is that you have the best of both worlds. You can use the full platform capabilities to run the minimum amount of code necessary for the task at hand while having the full power of Angular for building your UI.

We're often accustomed to just calling `platformBrowserDynamic().bootstrapModule(AppModule)` to get the job done without thinking much about it, but you could, for example, create a very minimal non-UI module that just contains the few services required for a background fetch. For example:

```ts
@NgModule({
  imports: [NativeScriptModule],
})
export class BackgroundModule {
  ngDoBootstrap() {
    // do nothing, this is not an UI module
  }
}

const moduleRefPromise = platformNativeScript().bootstrapModule(AppModule);

@JavaProxy("com.example.SomeEventReceiver")
@NativeClass()
class SomeEventReceiver extends android.content.BroadcastReceiver {
  onReceive(
    context: android.content.Context,
    intent: android.content.Intent
  ): void {
    console.log("INTENT RECEIVED");
    this.doBackgroundFetch();
  }

  async doBackgroundFetch() {
    const moduleRef = await moduleRefPromise;
    moduleRef.injector.get(BackgroundService).fetchLatestDataAndSaveToDisk();
  }
}
```

You can also use [rxjs](https://rxjs.dev) or `providedIn: 'platform'` services to exchange events between the background module and the main angular app in case it's running.

**This is similar to what a Service Worker would look like on the web, but we're sharing the same JS context!**

## Using Standalone Components

Using standalone components work just like the web as shown in the Angular doc [here](https://angular.io/guide/standalone-components).

```ts
import { Component } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

@Component({
  standalone: true,
  selector: "hello-standalone",
  imports: [NativeScriptCommonModule],
  template: `<Label text="Hello, I'm a standalone component"></Label>`,
  schemas: [NO_ERRORS_SCHEMA],
})
export class HelloStandaloneComponent {}
```

Here we can use any NativeScript View components we desire with our standalone components whereby importing the `NativeScriptCommonModule` and they will work completely standalone.

Take note that custom schemas are not supported by the angular compiler, so we also use [NO_ERRORS_SCHEMA](https://angular.io/api/core/NO_ERRORS_SCHEMA).

## Using Directives

To understand how natural Angular development is with NativeScript let's look at a few additional examples from the Angular docs: https://angular.io/guide/attribute-directives

```
import { Directive, ElementRef, inject } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective {
    private el = inject(ElementRef);

    constructor() {
        this.el.nativeElement.style.backgroundColor = "yellow";
    }
}
```

Directives work exactly as you would expect within the scope of iOS and Android development with NativeScript.

That is precisely the `highlight.directive.ts`, bearing in mind the visuals on screen are pure platform native views such as [UILabel](https://developer.apple.com/documentation/uikit/uilabel) on iOS and [TextView](https://developer.android.com/reference/android/widget/TextView) on Android represented simply via a [Label](https://docs.nativescript.org/ui-and-styling.html#label) view component provided by @nativescript/core:

```
<Label appHighlight text="Attribute Directive"></Label>
```

![Directives with NativeScript](./images/directives.png?raw=true "Directives with NativeScript")

### Event Considerations

The directive is further enhanced in the Angular docs with `mouseenter` and `mouseleave` events via the [HostListener](https://angular.io/api/core/HostListener) decorator.

This works the same in NativeScript regarding the `HostListener` decorator however only for events that are applicable for mobile platforms such as iOS and Android. For example, [tap](https://docs.nativescript.org/interaction.html#tap) is a supported event binding (aka _gestures_) on mobile platforms:

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

![Directives HostListener with NativeScript](./images/directives-tap.gif?raw=true "Directives HostListener with NativeScript")

## Using Pipes

Pipes are also incredibly useful for Angular developers and work exactly as you would expect as well; taken directly from the Angular docs [here](https://angular.io/guide/pipe-template) for the web:

```
<p>The hero's birthday is {{ birthday | date }}</p>
```

This would transform the value to display the formatted date and you can use them exactly the same with NativeScript:

```
<Label text="The hero's birthday is {{ birthday | date }}"></Label>
```

![Pipes with NativeScript](./images/pipes.png?raw=true "Pipes with NativeScript")

## Performance Metrics

NativeScript performance is impressive resulting in delightful outcomes. As with all performance optimizations, understanding your programming language and tech stack are key to unlocking it's full potential.

Here are some out of the box performance metrics comparing:

**Angular Web Bootstrap** vs. **Angular for iOS/Android via NativeScript Bootstrap** vs. **Pure Native Bootstrap**

Note: All metrics regarding Angular bootstrap are measured after the JavaScript engine is ready, whether it be in the browser or on a mobile device.

### Performance Angular Web Bootstrap

*Environment details*: `iPhone 13 Pro, iOS 15.5, Mobile Safari browser`

* mobile browser time to bootstrap Angular app: `10.417 ms`

[App can be found here](https://github.com/NativeScript/angular-perf-metrics/tree/main/web-app) and run on your own:

```
ng serve --open --host 0.0.0.0
```

Using the `host` argument will allow you to connect using your local IP address in the mobile device web browser.

### Performance Angular for iOS and Android via NativeScript Bootstrap

#### iOS

*Environment details*: `iPhone 13 Pro, iOS 15.5`

* time to bootstrap Angular app: `8.357ms`
* time from native iOS application creation to when the UI is created (aka `loaded` event in NativeScript): `44.695ms`
* time from native iOS application creation to when the app is ready (aka `viewDidAppear` of UIViewController): `63.917ms`

[App can be found here](https://github.com/NativeScript/angular-perf-metrics/tree/main/nativescript-app) and run on your own:

```
ns run ios --no-hmr
```

The difference between `Angular bootstrap` vs. `native iOS application creation` in the following metrics represent the time it takes for JavaScript to boot the Angular app on the iOS device vs. the time it takes for iOS to start the [UIApplicationMain](https://developer.apple.com/documentation/uikit/1622933-uiapplicationmain?language=objc) after the native [Application](https://developer.android.com/reference/android/app/Application) creation.

#### Android

*Environment details*: `Android Samsung Galaxy S20, Android 12`

* time to bootstrap Angular app: `17.244ms`
* time from native iOS application creation to when the UI is created (aka `loaded` event in NativeScript): `160.039ms`
* time from the native Android application to when the app is ready: `239.359ms`

[App can be found here](https://github.com/NativeScript/angular-perf-metrics/tree/main/nativescript-app) and run on your own:

```
ns run android --no-hmr
```

The difference between `Angular bootstrap` vs. `native Android application creation` represents the time it takes for JavaScript to boot the Angular app on the Android device vs. the time it takes for Android to start the [Main Activity](https://developer.android.com/guide/components/activities/intro-activities?authuser=1) after the native [Application](https://developer.android.com/reference/android/app/Application) creation.

### Performance Pure Native

We can measure similar metrics with a pure native application, for example iOS using Objective C alone.

* time from native iOS application creation to when the UI is created (aka `viewDidLoad` of UIViewController): `30.651583 ms`
* time from native iOS application creation to when the app is ready (aka `viewDidAppear` of UIViewController): `54.013500 ms`

[App can be found here](https://github.com/NativeScript/angular-perf-metrics/tree/main/Native) and run on your own by opening the Xcode project to run.

## StackBlitz learn by example

You can learn by example from [this StackBlitz](https://stackblitz.com/edit/nativescript-angular-14) which dives deeper into all these topics and more.

This is an advanced example which illustrates fascinating points around how Angular/JavaScript is handled in a pure native mobile app such as...

* How bootstrap differs between web apps and native mobile platform handling with NativeScript to consider advanced mobile platform cases (background services, etc.)
* How subscriptions can leak if not properly handled during ngOnDestroy with `providedIn: 'root'` regarding mobile app exit
* How native callbacks are not patched by `NgZone` whereby native functions may fall outside of zone so you want to make sure native callbacks are handled inside zone if UI changes are desired as a result of them
* Android less than version 12 behavior regarding hardware back vs. Android version 12 or greater

## Summary

Combining Angular with NativeScript makes for a powerful tech stack with expansive versatility. You can enable your team to take advantage of broad app distribution options and opportunities for creative programming angles.

When building for the web and wanting to enable rich mobile platform features, NativeScript makes a great choice. It can also be used [alongside Capacitor](https://docs.nativescript.org/capacitor/index.html) in both directions: a. starting with Ionic and mixing it's abilities in via [@nativescript/capacitor](https://capacitor.nativescript.org/) or, b. starting with NativeScript and mixing Capacitor abilities in via [@nativescript/ionic-portals](https://docs.nativescript.org/plugins/ionic-portals.html).

Additionally it can be combined within workspace style developments to enable wonderful architectural scalability by sharing JavaScript for increased reusability.

## Credits

NativeScript Technical Steering Committe (TSC) Members:

* [Eduardo Speroni](https://github.com/edusperoni), [@eduardosperoni](https://twitter.com/eduardosperoni)
  * [Valor Software Github](https://github.com/valor-software), [@ValorSoft](https://twitter.com/ValorSoft)
* [Nathan Walker](https://github.com/NathanWalker), [@wwwalkerrun](https://twitter.com/wwwalkerrun)
  * [nStudio Github](https://github.com/nstudio), [@teamnstudio](https://twitter.com/teamnstudio)