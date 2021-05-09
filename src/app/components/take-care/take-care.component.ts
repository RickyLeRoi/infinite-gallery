import {Component, OnInit} from '@angular/core';

declare var Splitting: any;

@Component({
    selector: 'app-take-care',
    templateUrl: 'take-care.component.html',
    styleUrls: ['take-care.component.scss'],
})
export class TakeCareComponent {
    message = "Riccardo Giordano. Take care of yourself"

    constructor() {
        // document.addEventListener("load", function() {
        //     var demo2 = Splitting({
        //        whitespace: false
        //     });
        // });
    }
    
}