import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from '../auth.service';
import { Usuario } from '../usuario';
import swal from 'sweetalert2'
import {Router} from '@angular/router'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: Usuario = new Usuario

  constructor(public socialAuthService: SocialAuthService,
    private authService: AuthService,
    private router: Router) {
   }

  ngOnInit(): void {

    if(this.socialAuthService.initState){
      this.socialAuthService.authState.subscribe(
        response => {
          this.usuario.apellido = response.lastName
          this.usuario.nombre = response.firstName
          this.usuario.email = response.email
        }
      )
    }


  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.email == null || this.usuario.password == null){
      swal.fire('Error Login','Username o password vacías!', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      response => {
        console.log(response);
        // let jsonPayload = JSON.parse(atob(response.access_token.split(".")[1]));
        // console.log(jsonPayload);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        let usuario = this.authService.usuario;

        //this.router.navigate(['/productos']);
        swal.fire('Login', `Hola ${usuario.nombre}, has iniciado sesión con éxito`, 'success')
      },
      err=>{
        if(err.status == 400){
          swal.fire('Error Login','Usuario o clave incorrectas!', 'error');
        }
      }
    )
  }





  create(): void{
    this.authService.create(this.usuario)
    .subscribe(
      _usuario => {
        this.login();
        this.router.navigate(['/productos']);
      })
  }

}
