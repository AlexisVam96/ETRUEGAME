import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import { CarritoService} from '../compras/carrito.service'
import { ComprasService} from '../compras/services/compras.service'
import { Compra} from '../compras/models/compra'
import swal from 'sweetalert2'
import {ActivatedRoute, Router} from '@angular/router'
import { AuthService } from '../usuarios/auth.service';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { Usuario } from '../usuarios/usuario';
import { MapsComponent } from '../maps/maps.component';
import { MatDialog } from '@angular/material/dialog';
import {URL_BACKEND} from '../config/config'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripeCardComponent} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { PaymentService } from '../services/stripe.service';
import { Payment} from '../payment/payment'
import Swal from 'sweetalert2';


declare var paypal;

@Component({
  selector: 'app-ckeckout',
  templateUrl: './ckeckout.component.html',
  styleUrls: ['./ckeckout.component.css']
})
export class CkeckoutComponent implements OnInit , AfterViewChecked{

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  stripeTest: FormGroup;

  //@ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  compra: Compra = new Compra();
  check: boolean = false
  checkPaypal: boolean = false;
  panelOpenState = false;
  urlBackend: string = URL_BACKEND

  isOn:boolean=true;

  constructor( public carritoService: CarritoService,
    private comprasService: ComprasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder, private stripeService: StripeService,
    private paymentService: PaymentService
    ) { }

  ngAfterViewChecked(): void{}

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        padding: '2rem',
        lineHeight: '60px',
        iconColor: '#f2f2f2',
        color: '#f1f1f1',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '1.2rem',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  ngOnInit(): void {

    console.log(this.carritoService.items.length)



    this.isOn= false;

    if(this.authService.isAuthenticated() ){
      this.activatedRoute.paramMap.subscribe(params =>{
        let username = params.get('user');

        if(username){
          this.authService.findByUser(username).subscribe(
            usuario =>{
              this.compra.usuario = usuario;
              this.compra.nombre = usuario.nombre;
              this.compra.apellido = usuario.apellido;
              this.compra.email = usuario.email;
              this.compra.movil = usuario.movil;
              this.compra.dni = usuario.documento;
              console.log('usuario compra', usuario)
            })
        }
      })


    }

    this.compra = this.carritoService.compra;
    console.log('compra -->',this.compra)

    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

  }

  createToken(): void {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          const paymentIntentDto: Payment = {
            token: result.token.id,
            amount: this.subtotal*100,
            currency: 'pen',
            description: "compras varias en etruegame"
          };
          this.paymentService.pagar(paymentIntentDto).subscribe(
            data => {
              //this.abrirModal(data[`id`], this.nombre, data[`description`], data[`amount`]);

              this.confirmBuy(data[`id`])
              console.log('paymento buy ->', data);
            }
          );
         // this.error = undefined;
        } else if (result.error) {
          //this.error = result.error.message;
        }
      });
  }

  confirmBuy(idToken): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Confirme el pago?',
      text: `¿Desea confirmar el pago de S/${this.subtotal}.00 en etruegame`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, Confirmar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.paymentService.confirmar(idToken).subscribe(
          data => {
            swalWithBootstrapButtons.fire('Listo','se ha confirmado el pago con el id ' + data[`id`], 'success')
            console.log('confirm payment', data)
            this.comprasService.create(this.compra).subscribe(
              compra =>{
                console.log('compra ->', compra )
                this.carritoService.carNew();
                this.router.navigate(['/mis-compras',this.compra.usuario.username]);
              })
          },
          error =>{
            swalWithBootstrapButtons.fire('Error','se ha confirmado el pago con el id ' + idToken, 'error')
            console.log("error ->", error)
          }
        )

      }else{

        this.paymentService.cancelar(idToken).subscribe(
          data => {
            swalWithBootstrapButtons.fire('Pago Cancelado','se ha cancelado el pago con el id ' + data[`id`], 'success')
            console.log('cancel payment', data)
          },
          err => {
            console.log(err);
            swalWithBootstrapButtons.fire('Error','se ha confirmado el pago con el id ' + idToken, 'error')
          }
        );

      }
    })
  }

  get subtotal(): number{
    return this.carritoService.calcularGranTotal() ;
  }

  create(): void{
      console.log(this.compra)
      this.comprasService.create(this.compra).subscribe(
        compra =>{
          swal.fire('Listo','Tu compra se ha generado correctamente','success')
          console.log('compra ->', compra )
          this.carritoService.carNew();
          this.router.navigate(['/productos']);
        })
  }


  abrirModalMaps():void{
    //this.authService.abrirModal();
    let dialogRef;

    console.log(screen.width)

    if(screen.width < 400){
      dialogRef= this.dialog.open(MapsComponent,{
        maxWidth: '100vw',
        width: '100vw',
        height: '100%',
        panelClass: 'map-modal'
      })
    }else{
      dialogRef= this.dialog.open(MapsComponent,{
        width: '686px',
        panelClass: 'map-modal'
      })
    }
  }

  openCheck(){
    this.check =true;
    this.checkPaypal=false;
  }

  openCheckPaypal(){
    this.checkPaypal = true;
    this.check=false;
  }
}

