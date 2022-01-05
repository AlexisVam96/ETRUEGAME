package com.etruegame.etruegameback.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "usuarios")
public class Usuario implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String username;

	@Column(length = 60)
	private String password;

	private Boolean enabled;

	private String nombre;

	private String apellido;

	private String movil;

	private String email;

	private String documento;

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinTable(name = "users_authorities", joinColumns = @JoinColumn(name = "usuario_id", nullable = false), inverseJoinColumns = @JoinColumn(name = "role_id", nullable = false), uniqueConstraints = {
			@UniqueConstraint(columnNames = { "usuario_id", "role_id" }) })
	private List<Role> roles;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "usuario", cascade = CascadeType.ALL)
	@JsonIgnoreProperties({ "usuario", "hibernateLazyInitializer", "handler" })
	private List<Compra> compras;

	@OneToMany(fetch = FetchType.LAZY, mappedBy="usuario", cascade = CascadeType.ALL)
	@JsonIgnoreProperties({"usuario","hibernateLazyInitializer", "handler"})
	private List<Producto> productos;

	public Usuario() {
		this.compras = new ArrayList<>();
	}

	public void addRole(Role role) {
		if (this.roles == null) {
			this.roles = new ArrayList<>();
		}

		this.roles.add(role);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellido() {
		return apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	public String getMovil() {
		return movil;
	}

	public void setMovil(String movil) {
		this.movil = movil;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDocumento() {
		return documento;
	}

	public void setDocumento(String documento) {
		this.documento = documento;
	}

	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public List<Compra> getCompras() {
		return compras;
	}

	public void setCompras(List<Compra> compras) {
		this.compras = compras;
	}

	public List<Producto> getProductos() {
		return productos;
	}

	public void setProductos(List<Producto> productos) {
		this.productos = productos;
	}
}
