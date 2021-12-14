package com.etruegame.etruegameback.controller;

import com.etruegame.etruegameback.entity.Categoria;
import com.etruegame.etruegameback.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:4200","*"})
@RestController
@RequestMapping("/api")
public class CategoriaRestController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/categorias")
    public List<Categoria> index(){
        return categoriaService.findAll();
    }

    @GetMapping("/categorias/buscar/{nombre}")
    public Categoria filtarByNombre(@PathVariable String nombre) {
        return categoriaService.findByNombre(nombre);
    }

    @GetMapping("/categorias/{id}")
    //@ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> show(@PathVariable Long id) {

        Categoria categoria = null;
        Map<String, Object> response = new HashMap<>();

        try {
            categoria = categoriaService.findById(id);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar la consulta en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if(categoria == null) {
            response.put("mensaje", "El producto ID: ".concat(id.toString().concat(" no existe en la base de datos")));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Categoria>(categoria, HttpStatus.OK);

    }

    @PostMapping("/categorias")
    public ResponseEntity<?> crate(@Validated @RequestBody Categoria categoria, BindingResult result){
        Categoria categoriaNew = null;
        Map<String, Object> response = new HashMap<>();

        if(result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map( err -> "El campo '" + err.getField() + "' " + err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String,Object>>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            categoriaNew = categoriaService.save(categoria);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar el insert en la base de datos");
            //response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            response.put("error", e.getMostSpecificCause().getMessage());
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("mensaje", "La categoria ha sido creado con éxito!");
        response.put("categoria", categoriaNew);
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @PutMapping("/categorias/{id}")
    //@ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> update(@Validated @RequestBody Categoria categoria, BindingResult result, @PathVariable Long id) {
        Categoria categoriaActual = categoriaService.findById(id);

        Map<String, Object> response = new HashMap<>();

        Categoria categoriaUpdate = null;

        if(result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map( err -> "El campo '" + err.getField() + "' "+ err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }


        if(categoriaActual == null) {
            response.put("mensaje", "Error, no se pudo editar, el producto ID: ".concat(id.toString().concat(" no existe en la base de datos")));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }

        try {
            categoriaActual.setNombre(categoria.getNombre());

            categoriaUpdate = categoriaService.save(categoriaActual);

        } catch (DataAccessException e) {
            response.put("mensaje", "Error al actualizar la categoria en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }


        response.put("mensaje", "La categoria ha sido actualizado con éxito!" );
        response.put("producto", categoriaUpdate);

        return new ResponseEntity<Map<String,Object>>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        try {
            categoriaService.delete(id);

        } catch (DataAccessException e){
            response.put("mensaje", "Error al eliminar la categoria de la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("mensaje", "La categoria fue eliminada con éxito!");
        return new ResponseEntity<Map<String,Object>>(response, HttpStatus.OK);

    }
}
