import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { CarritoService } from '../compras/carrito.service';
import { Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})


export class MapsComponent {

  lat: number = 51.678418
  lng: number = 7.809007
  ubicacion : string

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  constructor(public carritoService: CarritoService,
    public dialogRef: MatDialogRef<MapsComponent>) { }



  public handleAddressChange(address: Address) {
    console.log(address);
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.ubicacion = address.formatted_address;
  }

  guardarUbicacion(){
    this.carritoService.guardarUbicacion(this.ubicacion);
    this.dialogRef.close();
    console.log('ubicacion desde el mapa', this.ubicacion)
  }



  cerrarModal(){
    this.dialogRef.close();
  }



}
