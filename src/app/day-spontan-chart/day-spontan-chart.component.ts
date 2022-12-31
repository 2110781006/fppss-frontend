import {Component, OnInit, ViewChild} from '@angular/core';

import {RestConnService} from "../rest-conn.service";
import {UIChart} from "primeng/chart";
import 'chartjs-adapter-moment';



@Component({
  selector: 'app-day-spontan-chart',
  templateUrl: './day-spontan-chart.component.html',
  styleUrls: ['./day-spontan-chart.component.scss']
})
export class DaySpontanChartComponent implements OnInit {

  @ViewChild('chart')
  chart: UIChart;

  @ViewChild('pieChart')
  pieChart: UIChart;

  selectedDate:any;

  basicData:any;
  basicOptions: any;

  pieData: any;
  pieOptions: any;

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
          //stacked: true,
          type: 'time',
          time: {
            unit: 'hour'
          }/*,
          ticks: {
            color: '#501065'
          },
          grid: {
            color: 'rgba(211,211,211,0.85)'
          }*/
        },
        y: {
          //stacked: true,
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

    this.pieData = {
      labels: [],
      datasets: []
    }

    $('#prod').html("");
    $('#feedin').html("");
    $('#used').html("");
    $('#buy').html("");

    /*for ( let i = 0; i < 24; i++ )
    {
      let timeStr: String = String(i).padStart(2, "0") + ":00";
      this.basicData.labels.push(timeStr);
    }*/



    this.restConn.getConsumptionValuesHandler("feedin", "spontan", selDate).subscribe((response)=>{

      this.addDataset(response, 'Einspeisung [kWh]', 'rgba(129,201,91,0.70)', 'rgba(129,201,91,0.40)', true);
      //this.chart.refresh();

      this.restConn.getConsumptionValuesHandler("production", "spontan", selDate).subscribe((response2)=> {

        this.addDataset(response2, 'Produktion [kWh]', 'rgba(155,99,253,0.7)', 'rgba(155,99,253,0.40)', false);
        //this.chart.refresh();
      });

      this.restConn.getConsumptionValuesHandler("production", "spontan", selDate).subscribe((response2)=>{

        this.addDataset(response2, 'Verbrauch aus Produktion [kWh]', 'rgba(14,169,252,0.70)', 'rgba(14,169,252,0.40)', false);

        this.restConn.getConsumptionValuesHandler("consumption", "spontan", selDate).subscribe((response)=>{

          this.addDataset(response, 'Zukauf [kWh]', 'rgba(252,133,14,0.70)', 'rgba(252,133,14,0.40)', false);
          this.chart.refresh();

          //this.refreshPieChart();
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

  findPartnerValue(partnerValues : any, search : Date)
  {
    for ( let ent of partnerValues )
    {
      if ( ent.x.getTime() === search.getTime() )
        return ent.y;
    }

    return -1;
  }

  addDataset(response, type, color, colorFill, minus)
  {

    console.log(response);

    this.basicData.datasets.push({
      label: type,
      backgroundColor: colorFill,
      borderColor: color,
      borderWidth: 1,
      fill: true,
      pointRadius: 0,
      data: [],
      tension: .4
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
      let dateLocal = new Date(Date.UTC(dateUTC.getFullYear(), dateUTC.getMonth(), dateUTC.getDate(), dateUTC.getHours(), dateUTC.getMinutes(), dateUTC.getSeconds(), 0));

      let timeStr : String = String(dateLocal.getUTCHours()).padStart(2, "0")+":00";

      if ( type == "Verbrauch aus Produktion [kWh]" )
      {
        //let valFeedin = this.basicData.datasets[idxFeedin].data[this.basicData.datasets[idx].data.length].y;
        let valFeedin = this.findPartnerValue(this.basicData.datasets[idxFeedin].data, dateLocal);
        let valProd = entries.value;
        let delta = valProd+valFeedin;

        //console.log("idxFeedin:idx:"+idxFeedin+":"+idx);
        //console.log("valFeedin:"+valFeedin)
        //console.log("valProd:"+valProd)

        let entry;
        entry = { x: dateLocal, y: delta};

        this.basicData.datasets[idx].data.push(entry);
      }
      else if ( type == "Zukauf [kWh]" )
      {
        let vall = entries.value;

        if ( vall < 0 )
          vall = 0;

        let entry;
        entry = { x: dateLocal, y: vall };
        this.basicData.datasets[idx].data.push(entry);
      }
      else
      {
        let entry;
        entry = { x: dateLocal, y: (minus ? entries.value * -1 : entries.value) };
        this.basicData.datasets[idx].data.push(entry);
      }
    }
  }

}
