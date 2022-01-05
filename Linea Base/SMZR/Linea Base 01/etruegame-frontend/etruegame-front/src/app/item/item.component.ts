import { Component, OnInit } from '@angular/core';
import { Item} from '../model/item'
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  items: Item[]

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getItems().subscribe( response =>{
      this.items = response
      console.log(this.items)
    })
  }

}
