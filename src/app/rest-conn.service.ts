import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestConnService {

  private _url : string;
  private _port : number = 8080;

  constructor(private _httpClient : HttpClient)
  {
    this._url = "http://"+window.location.hostname+":"+this._port+"/api/v1/";
  }

  getConsumptionValuesHandler(): Observable<any>
  {
    var today = new Date();

    var year = today.getFullYear();
    var month = today.getMonth()

    var start = new Date(year,month,1);
    var end = new Date(start);
    end.setMonth(start.getMonth()+1);
console.log(start);
    console.log(":::"+start.getUTCFullYear()+"-"+start.getUTCMonth()+"-"+start.getUTCDate()+":::"+end.toUTCString());

    var a = start.getUTCMonth() + 1;
    var b = end.getUTCMonth() + 1;

    var startStr = start.getUTCFullYear()+"-"+String(a).padStart(2,"0")+"-"+String(start.getUTCDate()).padStart(2,"0")+"%20"+start.getUTCHours()+"%3A00%3A00";
    var endStr = end.getUTCFullYear()+"-"+String(b).padStart(2,"0")+"-"+String(end.getUTCDate()).padStart(2,"0")+"%20"+end.getUTCHours()+"%3A00%3A00";
console.log(startStr);
console.log(endStr);

    return this._httpClient.get(this._url+"values/feedin/day/1/"+startStr+"/"+endStr+"");
    //return this._httpClient.get(this._url+"values/feedin/day/1/2022-10-01%2000%3A00%3A00/2022-10-10%2000%3A00%3A00");
  }


  get url() : string{
    return this._url;
  }

  get port() : number {
    return this._port;
  }
}
