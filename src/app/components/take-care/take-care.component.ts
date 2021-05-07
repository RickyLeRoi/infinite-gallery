import {Component, OnInit} from '@angular/core';
// import * as Splitting from './splitting.js';

@Component({
    selector: 'app-take-care',
    templateUrl: 'take-care.component.html',
    styleUrls: ['take-care.component.scss'],
})
export class TakeCareComponent implements OnInit {
    message = "Riccardo Giordano. Take care of yourself"

    ngOnInit() {
        // setTimeout(() => 
        //     Splitting({
        //         whitespace: false
        //     }), 1000);
    }
    
}