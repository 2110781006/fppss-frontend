import { Component, OnInit } from '@angular/core';

import {RestConnService} from "../rest-conn.service";

@Component({
  selector: 'app-day-chart',
  templateUrl: './day-chart.component.html',
  styleUrls: ['./day-chart.component.scss']
})
export class DayChartComponent implements OnInit {

  basicData:any;
  basicOptions: any;

  constructor(private restConn: RestConnService) { }

  ngOnInit(): void {

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#15599c'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#501065'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      }
    };

    var userId = 1;

    //var restConn : RestConn;

    //get provideraccounts of user
    console.log(this.restConn.port);
    console.log(this.restConn.url);
    this.restConn.getConsumptionValuesHandler().subscribe((response)=>{

      /*this.basicData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'My First dataset',
                  backgroundColor: '#42A5F5',
                  data: [65, 59, 80, 81, 56, 55, 40]
              },
              {
                  label: 'My Second dataset',
                  backgroundColor: '#FFA726',
                  data: [28, 48, 40, 19, 86, 27, 90]
              }
          ]
      };*/
      console.log(response);

      this.basicData = {
        labels: [],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: '#42A5F5',
          data: []
        }]
      }

      for ( var z of response )
      {
        this.basicData.labels.push(z.timestamp);
        this.basicData.datasets[0].data.push(z.value);
      }


      for ( var z of response )
      {
        var x = {name:z.timestamp, series:[]};
        var k = {name:z.name='feedin', value:z.value};
        x.series.push(k);
      }

      console.log(x);
      //this.multi.push(x);
    });
  }

}
