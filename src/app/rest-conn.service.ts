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

  getConsumptionValuesHandler(type:String, res:String, date:Date): Observable<any>
  {
    let startStr = "";
    let endStr = "";

    if ( res == "day" )
    {
      let year = date.getFullYear();
      let month = date.getMonth();

      let start = new Date(year, month, 1);
      let end = new Date(start);
      end.setMonth(start.getMonth() + 1);

      let a = start.getUTCMonth() + 1;
      let b = end.getUTCMonth() + 1;

      startStr = start.getUTCFullYear() + "-" + String(a).padStart(2, "0") + "-" + String(start.getUTCDate()).padStart(2, "0") + "%20" + start.getUTCHours() + "%3A00%3A00";
      endStr = end.getUTCFullYear() + "-" + String(b).padStart(2, "0") + "-" + String(end.getUTCDate()).padStart(2, "0") + "%20" + end.getUTCHours() + "%3A00%3A00";
    }
    else if ( res == "hour" )
    {
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();

      let start = new Date(year, month, day);
      let end = new Date(start);
      end.setDate(start.getDate() + 1);

      let a = start.getUTCMonth() + 1;
      let b = end.getUTCMonth() + 1;
      let c = start.getUTCHours() ;
      let d = end.getUTCHours() ;

      startStr = start.getUTCFullYear() + "-" + String(a).padStart(2, "0") + "-" + String(start.getUTCDate()).padStart(2, "0") + "%20" + String(c).padStart(2, "0") + "%3A00%3A00";
      endStr = end.getUTCFullYear() + "-" + String(b).padStart(2, "0") + "-" + String(end.getUTCDate()).padStart(2, "0") + "%20" + String(d).padStart(2, "0") + "%3A00%3A00";
    }
    console.log(startStr);
    console.log(endStr);
    console.log(this._url+"values/"+type+"/"+res+"/1/"+startStr+"/"+endStr+"");

    return this._httpClient.get(this._url+"values/"+type+"/"+res+"/1/"+startStr+"/"+endStr+"");
  }

  public getValues(type:String, res:String, date:Date): Observable<any>
  {
    let startStr = "";
    let endStr = "";

    if ( res == "day" )
    {
      let year = date.getFullYear();
      let month = date.getMonth();

      let start = new Date(year, month, 1);
      let end = new Date(start);
      end.setMonth(start.getMonth() + 1);

      let a = start.getUTCMonth() + 1;
      let b = end.getUTCMonth() + 1;

      startStr = start.getUTCFullYear() + "-" + String(a).padStart(2, "0") + "-" + String(start.getUTCDate()).padStart(2, "0") + "%20" + start.getUTCHours() + "%3A00%3A00";
      endStr = end.getUTCFullYear() + "-" + String(b).padStart(2, "0") + "-" + String(end.getUTCDate()).padStart(2, "0") + "%20" + end.getUTCHours() + "%3A00%3A00";
    }
    else if ( res == "hour" )
    {
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();

      let start = new Date(year, month, day);
      let end = new Date(start);
      end.setDate(start.getDate() + 1);

      let a = start.getUTCMonth() + 1;
      let b = end.getUTCMonth() + 1;
      let c = start.getUTCHours() ;
      let d = end.getUTCHours() ;

      startStr = start.getUTCFullYear() + "-" + String(a).padStart(2, "0") + "-" + String(start.getUTCDate()).padStart(2, "0") + "%20" + String(c).padStart(2, "0") + "%3A00%3A00";
      endStr = end.getUTCFullYear() + "-" + String(b).padStart(2, "0") + "-" + String(end.getUTCDate()).padStart(2, "0") + "%20" + String(d).padStart(2, "0") + "%3A00%3A00";
    }
    console.log(startStr);
    console.log(endStr);
    console.log(this._url+"values/"+type+"/"+res+"/1/"+startStr+"/"+endStr+"");

    return this._httpClient.get(this._url+"values/"+type+"/"+res+"/1/"+startStr+"/"+endStr+"");
  }


  get url() : string{
    return this._url;
  }

  get port() : number {
    return this._port;
  }
}
