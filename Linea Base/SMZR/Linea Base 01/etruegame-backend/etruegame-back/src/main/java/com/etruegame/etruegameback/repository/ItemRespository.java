package com.etruegame.etruegameback.repository;

import com.etruegame.etruegameback.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRespository extends JpaRepository<Item, Integer> {
}
