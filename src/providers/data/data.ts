import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';

declare var Paho : any;
/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  public lastLocation = '';
  public lastMotionDetectedTime = "";
  public lastTimeDetected = 0.0;
  public locations = {"living":0, "kitchen":0, "dining":0, "toilet":0,"bedroom":0};
  public status = {"living":100, "kitchen":100, "dining":100, "toilet":100,"bedroom":100};
  private mqttStatus: string = 'Disconnected';
  private mqttClient: any = null;
  private message: any = '';
  private topic: string = 'swen325/a3';
  private clientId: string = 'Tom';
  private triggered = false;
  private firstRound = true;
  public updated = false;
  public color = "#f00";

  constructor(public event: Events) {
    this.locations = {"living":0, "kitchen":0, "dining":0, "toilet":0,"bedroom":0};
    this.status = {"living":0, "kitchen":0, "dining":0, "toilet":0,"bedroom":0};
  }

  public connect= () =>{
    if(this.mqttStatus== 'Connected'){
      return;
    }
    this.color='#f90';
    this.mqttStatus = 'Connecting...';
    this.mqttClient = new Paho.MQTT.Client('barretts.ecs.vuw.ac.nz', 8883, '/mqtt', this.clientId);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageReceived = this.onMessageReceived;

    // connect the client
    console.log('Connecting to mqtt via websocket');
    this.mqttClient.connect({timeout:10, useSSL:false, onSuccess:this.onConnect, onFailure:this.onFailure});
  }

  public disconnect () {
    if(this.mqttStatus == 'Connected') {
      this.color='#f90';
      this.mqttStatus = 'Disconnecting...';
      this.mqttClient.disconnect();
      this.mqttStatus = 'Disconnected';
      this.color="#f00";
    }
  }

  public onConnect = () => {
    console.log('Connected');
    this.mqttStatus = 'Connected';
    this.color="#090";

    // subscribe
    this.mqttClient.subscribe(this.topic);
  }

  public onFailure = (responseObject) => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  }

  public onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  }

  public onMessageReceived = (message) => {

    console.log(message.payloadString)
    this.message = message.payloadString;
    var m = this.message.split(",");
    this.status[m[1]] = m[3]+"%";
    var time = m[0].split(" ")[1].split(":");
    var hours = time[0];
    var min = time[1];
    var sec = time[2];
    var total = Number(hours)*3600+Number(min)*60+Number(sec);

    if(this.firstRound){
      this.lastTimeDetected = total;
      this.firstRound = false;
    }


    if((total-this.lastTimeDetected >= 5*1) && ( !this.triggered )){
      this.event.publish("alert", 0);
      this.triggered = true;
    }
    if(m[2]=="1"){

      this.updated = true;
      this.lastLocation = m[1];
      this.locations[this.lastLocation] += 1;
      this.secondsToMinutesAndSeconds(total - this.lastTimeDetected);
      this.lastTimeDetected = total;
      this.event.publish("update", 0);
    }

  }

  secondsToMinutesAndSeconds(time){
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    this.lastMotionDetectedTime='~' + minutes+' minutes ' + seconds + ' seconds ago';
  }



}
