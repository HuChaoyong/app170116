import { Component, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-layer-control',
  //outputs:['visible'],
  templateUrl:'./layer-control.component.html',
  styleUrls: ['./layer-control.component.css']
})
export class LayerControlComponent {
  @Input() view:any;
  //visible: EventEmitter<string> = new EventEmitter();
  constructor() { }

  visibleChange(id: string): void {
    //this.visible.emit(id);
    this.view.map.findLayerById(id).visible = !this.view.map.findLayerById(id).visible;    
  }
}
