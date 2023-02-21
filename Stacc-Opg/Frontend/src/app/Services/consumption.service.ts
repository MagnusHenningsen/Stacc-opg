import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Consumption } from '../Consumption';
@Injectable({
  providedIn: 'root'
})
export class ConsumptionService {
  AUTH_SERVER = "http://localhost:3000";
  DayOfWeekArr: any[] = [];
  DateArr: Consumption[][] = [];
  HoursArr: Consumption[][] = [];

  constructor(private http: HttpClient) { }
  /**
   * 
   * @returns JSON array of consumption items
   */
  getConsumption() {
    return this.http.get(this.AUTH_SERVER+"/consumption");
  }
  
}

