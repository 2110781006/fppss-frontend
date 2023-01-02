import {Component, OnInit, ViewChild} from '@angular/core';

import {RestConnService} from "../rest-conn.service";
import {UIChart} from "primeng/chart";
import {MessageService} from "primeng/api";



@Component({
  selector: 'app-day-chart',
  templateUrl: './day-chart.component.html',
  styleUrls: ['./day-chart.component.scss'],
  providers: [MessageService]
})
export class DayChartComponent implements OnInit {

  @ViewChild('chart')
  chart: UIChart;

  @ViewChild('pieChart')
  pieChart: UIChart;

  selectedDate:any;

  basicData:any;
  basicOptions: any;

  pieData: any;
  pieOptions: any;

  constructor(private restConn: RestConnService, private messageService: MessageService) { }

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

  goToLastDay()
  {
    let selDate : Date = new Date(this.selectedDate);

    selDate.setDate(selDate.getDate()-1);

    this.selectedDate = selDate;

    this.onRefresh(this.chart);
  }

  goToNextDay()
  {
    let selDate : Date = new Date(this.selectedDate);

    selDate.setDate(selDate.getDate()+1);

    this.selectedDate = selDate;

    this.onRefresh(this.chart);
  }

  onRefresh(chart:UIChart)
  {
    let selDate = this.selectedDate;

    this.basicData = {
      labels: [],
      datasets: []
    }

    this.pieData = {
      labels: [],
      datasets: []
    }

    $('#prod').html("");
    $('#feedin').html("");
    $('#used').html("");
    $('#buy').html("");

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

          this.refreshPieChart();
        });
      });
    });
  }

  refreshPieChart()
  {
    this.pieData = {
      labels: ['Einspeisung [%]','Verbrauch aus Produktion [%]','Zukauf [%]'],
      datasets: [
        {
          data: [],
          backgroundColor: ['rgba(129,201,91,0.85)', 'rgba(14,169,252,0.85)','rgba(252,133,14,0.85)']
        }
      ]
    };

    let feedin : any = this.basicData.datasets[0].data;
    let used : any = this.basicData.datasets[1].data;
    let  buy : any = this.basicData.datasets[2].data;

    const sumFeedin = feedin.reduce((accumulator, value) => {
      return accumulator + value*-1;
    }, 0);

    const sumUsed = used.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    const sumBuy = buy.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    const fullSum = sumFeedin+sumUsed+sumBuy;

    console.log("fullSum:"+fullSum);
    console.log("sumFeedin:"+sumFeedin);


    const sumFeedinPerc = sumFeedin*100/fullSum;
    const sumUsedPerc = sumUsed*100/fullSum;
    const sumBuyPerc = sumBuy*100/fullSum;

    this.pieData.datasets[0].data.push(sumFeedinPerc, sumUsedPerc, sumBuyPerc);

    $('#prod').html((sumFeedin+sumUsed).toFixed(2)+" kWh");
    $('#feedin').html(sumFeedin.toFixed(2)+" kWh");
    $('#used').html(sumUsed.toFixed(2)+" kWh");
    $('#buy').html(sumBuy.toFixed(2)+" kWh");

    this.pieChart.refresh();


    console.log(feedin);
    console.log(sumFeedin);
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

    if ( response == null || response.length == 0  )//no entries
    {
      this.messageService.add({key: 'tc', severity:'error', summary: 'Fehler', detail: 'Keine Daten vorhanden: '+type});
      return;
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
