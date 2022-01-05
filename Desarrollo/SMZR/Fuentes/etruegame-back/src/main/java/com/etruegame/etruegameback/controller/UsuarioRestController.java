package com.etruegame.etruegameback.controller;

import com.vampiro.springboot.backen.apirest.models.entity.Role;
import com.vampiro.springboot.backen.apirest.models.entity.Usuario;
import com.vampiro.springboot.backen.apirest.models.services.RoleServiceImpl;
import com.vampiro.springboot.backen.apirest.models.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:4200","*"})
@RestController
@RequestMapping("/api")
public class UsuarioRestController {
	
	@Autowired
	private UsuarioService usuarioService;
	
	@Autowired
	private RoleServiceImpl roleService;
	
	@Autowired
	private BCryptPasswordEncoder passswordEncoder;

	
	@GetMapping("/usuarios")
	public List<Usuario> listar(){
		return usuarioService.findAll();
	}

	@GetMapping("/usuarios/email/{email}")
	//@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> getByEmail(@PathVariable String email) {

		Usuario usuario = null;
		Map<String, Object> response = new HashMap<>();

		try {
			usuario = usuarioService.findByEmail(email);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al realizar la consulta en la base de datos");
			response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		if(usuario == null) {
			response.put("mensaje", "El email : ".concat(email.concat(" no existe en la base de datos")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);

	}
	
	@GetMapping("/usuarios/{username}")
	//@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> show(@PathVariable String username) {
		
		Usuario usuario = null;
		Map<String, Object> response = new HashMap<>();
		
		try {
			usuario = usuarioService.findByUsername(username);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al realizar la consulta en la base de datos");
			response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		if(usuario == null) {
			response.put("mensaje", "El usuario : ".concat(username.concat(" no existe en la base de datos")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);
		
	}

	@PostMapping("/usuarios")
	//@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> create(@Valid @RequestBody Usuario usuario, BindingResult result) {
		
		Usuario usuarioNew = null;
		Map<String, Object> response = new HashMap<>();
		
		if(result.hasErrors()) {
			List<String> errors = result.getFieldErrors()
					.stream()
					.map( err -> "El campo '" + err.getField() + "' "+ err.getDefaultMessage())
					.collect(Collectors.toList());
				
			response.put("errors", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}
		
		try {
			
			if(usuarioService.existsByEmail(usuario.getEmail()))
				//usuarioNew = usuarioService.findByEmail(usuario.getEmail());
				usuarioNew = updateUsuario(usuario);
			else 
				usuarioNew = saveUsuario(usuario);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al realizar el insert en la base de datos");
			response.put("error", e.getMostSpecificCause().getMessage());
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		response.put("mensaje", "El cliente ha sido creado con éxito!" );
		response.put("usuario", usuarioNew);
		return new ResponseEntity<Map<String,Object>>(response, HttpStatus.CREATED);
	}
	
	
	
	
	private Usuario updateUsuario(Usuario usuario) {
		
		Usuario usuarioActual = usuarioService.findByEmail(usuario.getEmail());
		Role role = roleService.findByName("ROLE_USER");
		
		List<Role> roles = new ArrayList<>();
		
		usuarioActual.setNombre(usuario.getNombre());
		usuarioActual.setApellido(usuario.getApellido());
		usuarioActual.setEnabled(usuario.getEnabled());
		usuarioActual.setPassword(passswordEncoder.encode(usuario.getPassword()));
		usuarioActual.setEmail(usuario.getEmail());
		usuarioActual.setMovil(usuario.getMovil());
		usuarioActual.setDocumento(usuario.getDocumento());

		roles.add(role);
		usuarioActual.setRoles(roles);
		return usuarioService.save(usuarioActual);
	}
	
	private Usuario saveUsuario(Usuario usuario) {
		Role role = roleService.findByName("ROLE_USER");
		usuario.setUsername(UUID.randomUUID().toString()+"-"+usuario.getNombre());
		List<Role> roles = new ArrayList<>();
		roles.add(role);
		usuario.setRoles(roles);
		usuario.setEnabled(true);
		usuario.setDocumento(usuario.getPassword());
		usuario.setPassword(passswordEncoder.encode(usuario.getDocumento()));
		return usuarioService.save(usuario);
	}

}
