import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Usuario} from './usuario'
import {tap, map, catchError} from 'rxjs/operators';
import { SocialAuthService } from 'angularx-social-login';
import {URL_BACKEND} from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;
  private urlEndPoint: string = URL_BACKEND + '/api/usuarios';

  constructor( private http: HttpClient,
    private socialAuthService: SocialAuthService) { }

  public get usuario(): Usuario{
    if(this._usuario !=null){
      return this._usuario;
    } else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string{
    if(this._token !=null){
      return this._token;
    } else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any>{
    const urlEndPoint = URL_BACKEND + '/oauth/token';

    const credenciales = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + credenciales
    });

    console.log(usuario);

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.email);
    params.set('password', usuario.password);

    console.log(params.toString())

    return this.http.post<any>(urlEndPoint, params.toString() , {headers: httpHeaders});
  }

  findByUser(user: string) : Observable<Usuario>{
    return this.http.get<Usuario>(`${this.urlEndPoint}/${user}`);
  }

  findByEmail(email: string): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.urlEndPoint}/email/${email}`);
  }


  create(usuario: Usuario) : Observable<Usuario>{
    return this.http.post(this.urlEndPoint, usuario).pipe(
      map( (response:any) => response.usuario as Usuario),
      catchError( e => {

        if(e.status == 400){
          return throwError(e);
        }

        if( e.error.mensaje){
        console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    )
  }

  guardarUsuario(accsessToken: string): void{
    let payload = this.obtenerDatosPayload(accsessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.firstName;
    this._usuario.apellido = payload.lastName;
    this._usuario.email = payload.email;
    this._usuario.username = payload.name;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accsessToken: string): void{
    this._token = accsessToken;
    sessionStorage.setItem('token', accsessToken)
  }

  obtenerDatosPayload(accessToken: string): any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated():boolean {
    let payload = this.obtenerDatosPayload(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }

  hasrole(role: string): boolean{
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  logout():void {
    this._token = null;
    this._usuario = null;

    this.socialAuthService.signOut();
    sessionStorage.clear();
  }

}
