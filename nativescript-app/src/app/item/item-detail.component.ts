import { Component, inject, NO_ERRORS_SCHEMA, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Item } from "./item";
import { ItemService } from "./item.service";

@Component({
  selector: "ns-details",
  template: `
    <ActionBar title="Details"></ActionBar>

    <FlexboxLayout flexDirection="column">
      <FlexboxLayout class="m-15">
        <Label class="h2" [text]="item.id + '. '"></Label>
        <Label class="h2" [text]="item.name"></Label>
      </FlexboxLayout>
      <Label class="h4 m-15" [text]="item.role"></Label>
    </FlexboxLayout>
  `
})
export class ItemDetailComponent implements OnInit {
  item: Item;

  itemService = inject(ItemService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    this.item = this.itemService.getItem(id);
  }
}
