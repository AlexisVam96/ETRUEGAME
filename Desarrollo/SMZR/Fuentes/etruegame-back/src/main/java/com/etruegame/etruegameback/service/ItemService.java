package com.etruegame.etruegameback.service;

import com.etruegame.etruegameback.entity.Item;
import com.etruegame.etruegameback.repository.ItemRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    @Autowired
    private ItemRespository itemRespository;

    public List<Item> getItemsAll(){
        return itemRespository.findAll();
    }

    public Item findItemById(Integer id){
        return itemRespository.findById(id).orElse(null);
    }

    public Item saveItem(Item item){
        return itemRespository.save(item);
    }

    public void deleteItemById(Integer id){
        itemRespository.deleteById(id);
    }
}
