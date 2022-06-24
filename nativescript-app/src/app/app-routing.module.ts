import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { ROUTE_PROVIDER } from "./token";
import { BenchmarkStandaloneComponent } from "./benchmark.standalone.component";

const routes: Routes = [
  { path: "", redirectTo: "/benchmark", pathMatch: "full" },
  { path: "items", component: ItemsComponent },
  { path: "item/:id", component: ItemDetailComponent },
  {
    path: "benchmark",
    component: BenchmarkStandaloneComponent,
    providers: [{ provide: ROUTE_PROVIDER, useValue: "/items" }],
  },
  {
    path: "lazy",
    loadComponent: () =>
      import("./lazy.standalone.component").then(
        (m) => m.LazyStandaloneComponent
      ),
    providers: [
      { provide: ROUTE_PROVIDER, useValue: "Hello from the route provider!" },
    ],
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
