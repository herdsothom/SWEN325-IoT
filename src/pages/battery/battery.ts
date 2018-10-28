import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";

@Component({
  selector: 'page-battery',
  templateUrl: 'battery.html'
})
export class BatteryPage {

  constructor(public navCtrl: NavController,public data: DataProvider, public evt:Events) {
  }

  ionViewDidEnter(){
    this.evt.subscribe("alert", () => { this.presentAlert() });
  }

  ionViewDidLeave(){
    this.evt.unsubscribe("alert")
  }

  presentAlert() {
    console.log('Present alert')
    self.alert("Person has not moved for 5 minutes");

    if(this.data.updated) {
      this.navCtrl.parent.select(0, {
        time: this.data.lastTimeDetected,
        motion: this.data.lastMotionDetectedTime,
        loc: this.data.lastLocation,
        places: this.data.locations,
        status: this.data.status,
        update: true,
        color:this.data.color
      });
    } 
    else {
      this.navCtrl.parent.select(0, {
        update: false
      });
    }

  }

}
