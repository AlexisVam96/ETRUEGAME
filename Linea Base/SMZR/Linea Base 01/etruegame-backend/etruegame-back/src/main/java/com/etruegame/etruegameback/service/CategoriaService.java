package com.etruegame.etruegameback.service;

import com.etruegame.etruegameback.entity.Categoria;
import com.etruegame.etruegameback.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService{


    @Autowired
    private CategoriaRepository categoriaDao;

    @Transactional(readOnly = true)
    public List<Categoria> findAll() {
        return (List<Categoria>) categoriaDao.findAll();
    }

    @Transactional
    public Categoria save(Categoria categoria) {
        return categoriaDao.save(categoria);
    }

    @Transactional
    public Categoria findByNombre(String nombre) {
        return categoriaDao.findByNombre(nombre);
    }

    @Transactional
    public Categoria findById(Long id) {
        return categoriaDao.findById(id).orElse(null);
    }

    @Transactional
    public void delete(Long id) {
        categoriaDao.deleteById(id);
    }



}
