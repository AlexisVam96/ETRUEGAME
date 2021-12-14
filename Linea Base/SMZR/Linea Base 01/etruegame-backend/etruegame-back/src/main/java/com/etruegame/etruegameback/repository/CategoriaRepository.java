package com.etruegame.etruegameback.repository;

import com.etruegame.etruegameback.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    public Categoria findByNombre(String nombre);

}
