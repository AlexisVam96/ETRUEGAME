import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Compra } from 'src/app/compras/models/compra';
import { ComprasService } from 'src/app/compras/services/compras.service';
import { AuthService } from '../auth.service';
import { Usuario } from '../usuario';
import swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  compra: Compra = new Compra();
  usuario: Usuario

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private comprasService: ComprasService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params =>{
      let username = params.get('user');

      if(username){
        this.authService.findByUser(username).subscribe(
          usuario => {
            this.usuario = usuario
            console.log('usuario compra >',usuario)
          })
      }
    })

  }

  delete(compra: Compra): void{
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar la compra ${this.usuario.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.comprasService.delete(compra.id).subscribe(
          () => {
            this.usuario.compras = this.usuario.compras.filter(pro => pro !== compra)
            swalWithBootstrapButtons.fire(
              'Compra Eliminada!',
              `Tu compra ${this.usuario.nombre} fue eliminada con éxito!`,
              'success'
            )
          }
        )
      }
    })
  }


}
