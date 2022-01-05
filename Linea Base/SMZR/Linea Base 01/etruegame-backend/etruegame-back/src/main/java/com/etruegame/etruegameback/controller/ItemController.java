package com.etruegame.etruegameback.controller;

import com.etruegame.etruegameback.entity.Item;
import com.etruegame.etruegameback.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping("/items")
    public List<Item> getItemsAll(){
        return itemService.getItemsAll();
    }

    @GetMapping("/items/{id}")
    public Item findItemById(@PathVariable Integer id){
        return itemService.findItemById(id);
    }

    @PostMapping("/items")
    public Item saveItem(@RequestBody Item item){
        return itemService.saveItem(item);
    }

    @PutMapping("items/{id}")
    public Item updateItem(@RequestBody Item item, @PathVariable Integer id) {
        Item itemActual = itemService.findItemById(id);
        Item itemUpdate = null;
        itemActual.setNombre(item.getNombre());
        itemActual.setDescripcion(item.getDescripcion());
        itemActual.setPrecio(item.getPrecio());
        itemActual.setStock(item.getStock());

        itemUpdate = itemService.saveItem(itemActual);

        return itemUpdate;
    }

    public String deleteItem(@PathVariable Integer id){
        itemService.deleteItemById(id);
        return "se elimino el producto con id: "+ id ;
    }
}
