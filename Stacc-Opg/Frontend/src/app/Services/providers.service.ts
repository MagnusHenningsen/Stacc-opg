import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  AUTH_SERVER = "http://localhost:3000";
  constructor(private http:HttpClient) { }
  getProviders() {
    return this.http.get(this.AUTH_SERVER+"/providers");
  }
}
