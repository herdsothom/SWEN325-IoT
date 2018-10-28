import { Component } from '@angular/core';
import {Chart} from 'chart.js';
import {ViewChild} from "@angular/core";
import {DataProvider} from "../../providers/data/data";
import {Events} from 'ionic-angular';
import {AlertController} from "ionic-angular";
import {NavParams} from "ionic-angular";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('bCanvas') bCanvas;
  @ViewChild('dCanvas') dCanvas;
  barChart: any;
  doughnutChart: any;
  constructor(public data: DataProvider, public evt:Events,public alertCtrl:AlertController,public params:NavParams) {
    if(this.params.get("update")) {
      this.data.lastTimeDetected = params.get("time");
      this.data.lastMotionDetectedTime = params.get("motion");
      this.data.lastLocation = params.get("loc");
      this.data.locations = params.get("places");
      this.data.status = params.get("status");
      this.data.color=params.get("color");
    }
    this.evt.subscribe("update",()=> { this.loadGraph() });
    // this.setTimer();

  }


  ionViewDidEnter(){
    this.evt.subscribe("alert", () => { this.presentAlert() });
  }

  ionViewDidLeave(){
    this.evt.unsubscribe("alert")
  }

  presentAlert() {
    self.alert("Person has not moved for 5 minutes");
  }

  ionViewDidLoad() {
    this.loadGraph();
  }

  // setTimer(){
  //   setInterval(function(){
  //     this.timer++;
  //     this.mins = Math.floor(this.timer / 60);
  //     this.secs = this.timer - this.mins * 60;

  //     //throws alert after 5 minutes
  //     if(this.timer == 300){
  //       alert("There has been no detected in the last 5 minutes")
  //     }
  //   }.bind(this),
  //   1000)

  // }

  loadGraph() {

    this.doughnutChart = new Chart(this.dCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: ["living", "kitchen", "dining", "toilet", "bedroom"],
        datasets: [{
          label: 'Number of Movements',
          data: [this.data.locations["living"], this.data.locations["kitchen"], this.data.locations["dining"], this.data.locations["toilet"], this.data.locations["bedroom"]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      // options: {
      //   scales: {
      //     yAxes: [{
      //       ticks: {
      //         beginAtZero: true
      //       }
      //     }]
      //   }
      // }

    });

    this.barChart = new Chart(this.bCanvas
  .nativeElement, {

      type: 'bar',
      data: {
        labels: ["living", "kitchen", "dining", "toilet", "bedroom"],
        datasets: [{
          label: 'Number of Movements',
          data: [this.data.locations["living"], this.data.locations["kitchen"], this.data.locations["dining"], this.data.locations["toilet"], this.data.locations["bedroom"]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });
  }
}

