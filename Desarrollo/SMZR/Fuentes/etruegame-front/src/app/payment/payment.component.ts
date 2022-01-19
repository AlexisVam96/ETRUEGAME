import { Component, OnInit, Input } from '@angular/core';
import { PaymentService } from '../services/stripe.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Input() id;
  @Input() nombre;
  @Input() descripcion;
  @Input() precio;

  constructor(
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
  }

  confirmar(id: string): void {
    this.paymentService.confirmar(id).subscribe(
      data => {
        console.log(data)
      },
      err => {
        console.log(err);

      }
    );
  }

  cancelar(id: string): void {
    this.paymentService.cancelar(id).subscribe(
      data => {
        console.log(data)
      },
      err => {
        console.log(err);

      }
    );
  }

}
