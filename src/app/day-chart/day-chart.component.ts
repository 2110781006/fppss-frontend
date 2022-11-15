import {Component, OnInit, ViewChild} from '@angular/core';

import {RestConnService} from "../rest-conn.service";
import {UIChart} from "primeng/chart";



@Component({
  selector: 'app-day-chart',
  templateUrl: './day-chart.component.html',
  styleUrls: ['./day-chart.component.scss']
})
export class DayChartComponent implements OnInit {

  @ViewChild('chart')
  chart: UIChart;

  selectedDate:any;

  basicData:any;
  basicOptions: any;

  constructor(private restConn: RestConnService) { }

  ngOnInit(): void {

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#333333'
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#501065'
          },
          grid: {
            color: 'rgba(211,211,211,0.85)'
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: '#501065',
            callback: function(value, index, ticks) {
              return value+' kWh';}
          },
          grid: {
            color: 'rgba(211,211,211,0.85)'
          }
        }
      }
    };

    let yesterday = new Date();

    yesterday.setDate(yesterday.getDate()-1);

    this.selectedDate = yesterday;

    this.onRefresh(this.chart);
  }

  onRefresh(chart:UIChart)
  {
    let selDate = this.selectedDate;

    this.basicData = {
      labels: [],
      datasets: []
    }

    for ( let i = 0; i < 24; i++ )
    {
      let timeStr: String = String(i).padStart(2, "0") + ":00";
      this.basicData.labels.push(timeStr);
    }

    this.restConn.getConsumptionValuesHandler("feedin", "hour", selDate).subscribe((response)=>{

      this.addDataset(response, 'Einspeisung [kWh]', 'rgba(129,201,91,0.85)', true);

      this.restConn.getConsumptionValuesHandler("production", "hour", selDate).subscribe((response2)=>{

        this.addDataset(response2, 'Verbrauch aus Produktion [kWh]', 'rgba(14,169,252,0.85)', false);

        this.restConn.getConsumptionValuesHandler("consumption", "hour", selDate).subscribe((response)=>{

          this.addDataset(response, 'Zukauf [kWh]', 'rgba(252,133,14,0.85)', false);
          this.chart.refresh();


        });
      });
    });




  }

  addDataset(response, type, color, minus)
  {

    console.log(response);

    this.basicData.datasets.push({
      label: type,
      backgroundColor: color,
      data: []
    });

    let idx : number = 0;

    for ( let i = 0; i < this.basicData.datasets.length; i++ ) {
      if (this.basicData.datasets[i].label == type) {
        idx = i;
        break;
      }
    }

    let idxFeedin : number = 0;

    for ( let i = 0; i < this.basicData.datasets.length; i++ ) {
      if (this.basicData.datasets[i].label == "Einspeisung [kWh]") {
        idxFeedin = i;
        break;
      }
    }

    for ( let entries of response )
    {
      let dateUTC = new Date(entries.timestamp);
      let dateLocal = new Date(Date.UTC(dateUTC.getFullYear(), dateUTC.getMonth(), dateUTC.getDate(), dateUTC.getHours(), 0, 0, 0));

      let timeStr : String = String(dateLocal.getUTCHours()).padStart(2, "0")+":00";

      if ( !this.basicData.labels.includes(timeStr) )
        this.basicData.datasets[idx].data.push(0);
      else {
        if ( type == "Verbrauch aus Produktion [kWh]" )
        {
          let valFeedin = this.basicData.datasets[idxFeedin].data[this.basicData.datasets[idx].data.length];
          let valProd = entries.value;
          let delta = valProd+valFeedin;

          this.basicData.datasets[idx].data.push(delta > 0?delta:0);
        }
        else
          this.basicData.datasets[idx].data.push(minus ? entries.value * -1 : entries.value);
      }
    }

  }

}
