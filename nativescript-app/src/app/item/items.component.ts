import { Component, inject, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';

import { Item } from './item'
import { ItemService } from './item.service'

@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  items: Array<Item>;
  birthday = new Date(1980, 3, 16); 
  private itemService = inject(ItemService);

  constructor(page: Page) {
    page.once('navigatedTo', () => {
      console.timeEnd('JS to full navigation');
    });
  }

  ngOnInit(): void {
    this.items = this.itemService.getItems()
  }
}
