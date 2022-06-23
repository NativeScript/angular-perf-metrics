import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { ROUTE_PROVIDER } from "./token";

const routes: Routes = [
  { path: "", redirectTo: "/items", pathMatch: "full" },
  { path: "items", component: ItemsComponent },
  { path: "item/:id", component: ItemDetailComponent },
  {
    path: "lazy",
    loadComponent: () =>
      import("./lazy.standalone.component").then(
        (m) => m.LazyStandaloneComponent
      ),
    providers: [{ provide: ROUTE_PROVIDER, useValue: "Hello from the route provider!" }],
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
