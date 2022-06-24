import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { HelloStandaloneComponent } from './hello.standalone.component';
import { HighlightDirective } from './highlight.directive';
import { BenchmarkStandaloneComponent } from './benchmark.standalone.component'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, HelloStandaloneComponent, BenchmarkStandaloneComponent],
  declarations: [AppComponent, ItemsComponent, ItemDetailComponent, HighlightDirective],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
