import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 
export class AppComponent {
  getPosition($event):void {
    // console.log('event =',$event);
    // console.log('event =',$event.x);
    // console.log('event =',$event.y);
  }
}
