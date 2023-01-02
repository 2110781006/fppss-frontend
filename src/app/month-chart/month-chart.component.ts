import {Component, OnInit, ViewChild} from '@angular/core';

import {RestConnService} from "../rest-conn.service";
import {UIChart} from "primeng/chart";
import {MessageService} from "primeng/api";



@Component({
  selector: 'app-month-chart',
  templateUrl: './month-chart.component.html',
  styleUrls: ['./month-chart.component.scss'],
  providers: [MessageService]
})
export class MonthChartComponent implements OnInit {

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

    this.selectedDate = new Date();

    this.onRefresh(this.chart);
  }

  goToLastMonth()
  {
    let selDate : Date = new Date(this.selectedDate);

    selDate.setMonth(selDate.getMonth()-1);

    this.selectedDate = selDate;

    this.onRefresh(this.chart);
  }

  goToNextMonth()
  {
    let selDate : Date = new Date(this.selectedDate);

    selDate.setMonth(selDate.getMonth()+1);

    this.selectedDate = selDate;

    this.onRefresh(this.chart);
  }

  getDaysInMonth(year, month) : number
  {
    return new Date(year, month, 0).getDate();
  }

  onRefresh(chart:UIChart)
  {
    let selDate = this.selectedDate;

    let dayCount = this.getDaysInMonth(selDate.getFullYear(), selDate.getMonth()+1);

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

    for ( let i = 1; i <= dayCount; i++ )
    {
      let timeStr: String = String(i).padStart(2, "0");
      this.basicData.labels.push(timeStr);
    }

    this.restConn.getConsumptionValuesHandler("feedin", "day", selDate).subscribe((response)=>{

      this.addDataset(response, 'Einspeisung [kWh]', 'rgba(129,201,91,0.85)', true);

      this.restConn.getConsumptionValuesHandler("production", "day", selDate).subscribe((response2)=>{

        this.addDataset(response2, 'Verbrauch aus Produktion [kWh]', 'rgba(14,169,252,0.85)', false);

        this.restConn.getConsumptionValuesHandler("consumption", "day", selDate).subscribe((response)=>{

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

    for ( let lbl of this.basicData.labels )//fill with empty data
      this.basicData.datasets[idx].data.push(0);

    if ( response == null || response.length == 0  )//no entries
    {
      this.messageService.add({key: 'tc', severity:'error', summary: 'Fehler', detail: 'Keine Daten vorhanden: '+type});
      return;
    }

    for ( let entries of response )
    {
      let dateUTC = new Date(entries.timestamp);
      let dateLocal = new Date(Date.UTC(dateUTC.getFullYear(), dateUTC.getMonth(), dateUTC.getDate(), dateUTC.getHours(), 0, 0, 0));

      let timeStr : String = String(dateLocal.getUTCDate()).padStart(2, "0");

      let insertIdx = this.basicData.labels.indexOf(timeStr);

      if ( insertIdx >= 0 )
      {
        if ( type == "Verbrauch aus Produktion [kWh]" )
        {
          let valFeedin = this.basicData.datasets[idxFeedin].data[insertIdx];
          let valProd = entries.value;
          let delta = valProd+valFeedin;

          this.basicData.datasets[idx].data[insertIdx] = (delta > 0?delta:0);
        }
        else
          this.basicData.datasets[idx].data[insertIdx] = (minus ? entries.value * -1 : entries.value);
      }
    }

  }

}
