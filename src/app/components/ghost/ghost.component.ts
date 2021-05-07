import {Component, OnInit} from '@angular/core';
// import * as Splitting from './splitting.js';

@Component({
    selector: 'app-ghost',
    templateUrl: 'ghost.component.html',
    styleUrls: ['ghost.component.scss'],
})
export class GhostComponent implements OnInit {

    ngOnInit() {
        var pageX = window.innerWidth;
        var pageY = window.innerHeight;
        var mouseY=0;
        var mouseX=0;
        function moving(ev: MouseEvent) {
            let elem: any = document.getElementsByClassName('box__ghost-eyes')[0];
            if (!elem) return;
            mouseY = ev.pageY;
            let yAxis = (pageY/2-mouseY)/pageY*300;
            mouseX = ev.pageX / -pageX;
            let xAxis = -mouseX * 100 - 100;
            elem.style.transform = 'translate('+ xAxis +'%,-'+ yAxis +'%)';
        }
        document.addEventListener('mousemove', moving);
    }

    resetSearch(ev: MouseEvent) {
        console.log(ev);
    }
    
}

