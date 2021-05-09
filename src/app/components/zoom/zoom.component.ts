import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from 'src/app/model/post.model';
import { ImageService } from 'src/app/services/image.service';

declare var Splitting: any;

@Component({
    selector: 'app-zoom',
    templateUrl: 'zoom.component.html',
    styleUrls: ['zoom.component.scss'],
})
export class ZoomComponent implements OnInit, OnDestroy {
    id: string = '';
    private sub: any;
    imagesToShow: any[];
    fact: any;
    
    constructor(private route: ActivatedRoute, private image: ImageService) {
        this.imagesToShow = [];
        this.fact = null;
    }
    
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id']; // (+) converts string 'id' to a number
            // In a real app: dispatch action to load the details here.
            this.imagesToShow = this.image.cachedData.filter(c => c.data.id === this.id).map(i => { return {...i.data, image: i.data.url}});
            this.fact = this.imagesToShow[0];
        });
    }
    
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}