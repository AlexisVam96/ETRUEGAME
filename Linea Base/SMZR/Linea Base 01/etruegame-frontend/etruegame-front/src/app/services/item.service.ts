import { Injectable } from '@angular/core';
import {Item} from '../model/item';
import  {items}  from '../model/items.json'
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private urlEndPoint: string = 'http://localhost:8083/api/items';

  constructor(private http: HttpClient) { }

  getItems():Observable<Item[]>{
    return this.http.get<Item[]>(this.urlEndPoint);
  }

  create(item: Item) : Observable<Item>{
    return this.http.post<Item>(this.urlEndPoint, item)
  }

  update(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.urlEndPoint}/${item.id}`, item)
  }

  delete(id: number): Observable<Item>{
    return this.http.delete<Item>(`${this.urlEndPoint}/${id}`)
  }
}
