import { Component, OnInit } from '@angular/core';
import {Usuario} from './usuario';
import swal from 'sweetalert2'
import {AuthService} from './auth.service'
import {Router} from '@angular/router'
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = "Por favor inicie sesión!"
  hide = true;
  usuario: Usuario;

  //ATRIBUTOS DE SOCIAL USERS
  socialUser : SocialUser;
  usserLogged : SocialUser;
  isLogged : boolean;

  constructor(public authService: AuthService,
     private router: Router,
     private socialAuthService: SocialAuthService,
     public dialogRef: MatDialogRef<LoginComponent>
    ) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      swal.fire('Login', `Hola ${this.authService.usuario.nombre} ya estas autenticado!`, 'info');
      //this.router.navigate(['/productos'])
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
        this.dialogRef.close();
        swal.fire('Login', `Hola ${usuario.nombre} ${usuario.apellido}, has iniciado sesión con éxito`, 'success')
      },
      err=>{
        if(err.status == 400){
          swal.fire('Error Login','Usuario o clave incorrectas!', 'error');
        }
      }
    )
  }

  cerrarModal():void{
    this.dialogRef.close();
  }


  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data =>{
        console.log(data);
        this.router.navigate(['/registro']);
        this.dialogRef.close();
      }
    );
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      data =>{
        console.log(data);
        this.router.navigate(['/registro']);
        this.dialogRef.close();
      }
    );
  }


}
