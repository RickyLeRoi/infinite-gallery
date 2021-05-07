import { Component } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Fact } from '../../model/fact.model';
import { FactService } from '../../services/fact.service';
import { ImageService } from '../../services/image.service';
import { Post, Media } from 'src/app/model/post.model';


@Component({
  selector: 'app-fact-scroller',
  templateUrl: './fact-scroller.component.html',
  styleUrls: ['./fact-scroller.component.scss']
})
export class FactScrollerComponent {
  // dataSource: FactsDataSource;
  dataSource: ImageDataSource;
  
  constructor(private factService: FactService, private imageService: ImageService) {
    // this.dataSource = new FactsDataSource(factService);
    this.dataSource = new ImageDataSource(imageService);
  }
}

export class FactsDataSource extends DataSource<Fact | undefined> {
  private cachedFacts = Array.from<Fact>({ length: 0 });
  private dataStream = new BehaviorSubject<(Fact | undefined)[]>(this.cachedFacts);
  private subscription = new Subscription();
  private pageSize = 10;
  private lastPage = 0;
  private innerHeight = window.innerHeight-100;
  private innerWidth = window.innerWidth-50;

  constructor(private factService: FactService) {
    super();
    // Start with some data.
    this._fetchFactPage();
    // window.addEventListener('resize', (ev) => {
    //   const tag = document.getElementById("fact-scroll-viewport");
    //   tag!.style.width = (window.innerWidth-50)+'px';
    //   tag!.style.height = (window.innerHeight-100)+'px';
    // })
  }

  // applyStyles() {
  //   const styles = {'width' : window.innerWidth, 'height': window.innerHeight};
  //   return styles;
  // }

  connect(collectionViewer: CollectionViewer): Observable<(Fact | undefined)[] | ReadonlyArray<Fact | undefined>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const currentPage = this._getPageForIndex(range.end);
      if (currentPage && range) {
        // console.log(currentPage, this.lastPage);
      }
      if (currentPage > this.lastPage) {
        this.lastPage = currentPage;
        this._fetchFactPage();
      }
    }));
    return this.dataStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }

  private _fetchFactPage(): void {
    for (let i = 0; i < this.pageSize; ++i) {
      this.factService.getRandomFact().subscribe(res => {
        this.cachedFacts = this.cachedFacts.concat(res);
        this.dataStream.next(this.cachedFacts);
      });
    }
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }

}

export class ImageDataSource extends DataSource<Media> {
  private cachedFacts: Media[] = Array<Media>();
  private dataStream = new BehaviorSubject<Media[]>(this.cachedFacts);
  private subscription = new Subscription();
  private pageSize = 10;
  private lastPage = 0;
  private innerHeight = window.innerHeight-100;
  private innerWidth = window.innerWidth-50;

  constructor(private imageService: ImageService) {
    super();
    this._fetchImagePage();
  }

  connect(collectionViewer: CollectionViewer): Observable<Media[] | ReadonlyArray<Media>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const currentPage = this._getPageForIndex(range.end);
      if (currentPage && range) {
        console.log(currentPage, this.lastPage);
      }
      if (currentPage > this.lastPage) {
        this.lastPage = currentPage;
        this._fetchImagePage();
      }
    }));
    return this.dataStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }

  private _fetchImagePage(): void {
    for (let i = 0; i < this.pageSize; ++i) {
      this.imageService.getRandomImageList().subscribe(res => {
        let list: any[] = res.data.children
        .filter(c => !!c.data.preview && !!c.data.preview.images[0] && !!c.data.preview.images[0])
        .map(d => { 
          return {
            author: d.data.author,
            awards: d.data.all_awardings?.length || 0,
            fullRes: d.data.preview.images[0].source.url.replace('&amp;', '&'),
            image: d.data.preview.images[0],
            name: d.data.name,
            score: d.data.score,
            subscribers: d.data.subreddit_subscribers,
            thumbnail: d.data.thumbnail.replace('&amp;', '&'),
            title: d.data.title,
            thumb: d.data.preview.images[0].resolutions[0].url.replace('&amp;', '&'),
            url: d.data.url.replace('&amp;', '&') //d.data.url_overridden_by_dest.replace('&amp;', '&')
          }
        });
        list.forEach((m:Media) => this.cachedFacts.push(m));
        this.dataStream.next(this.cachedFacts);
      });
    }
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }

}