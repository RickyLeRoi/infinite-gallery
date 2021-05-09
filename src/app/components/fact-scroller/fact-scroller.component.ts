import { Component } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Fact } from '../../model/fact.model';
import { Post, Media } from 'src/app/model/post.model';
import { EvObs } from 'src/app/model/event.model';
import { FactService } from '../../services/fact.service';
import { ImageService } from '../../services/image.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-fact-scroller',
  templateUrl: './fact-scroller.component.html',
  styleUrls: ['./fact-scroller.component.scss']
})
export class FactScrollerComponent {
  // dataSource: FactsDataSource;
  dataSource: PopularImageDataSource | SearchImageDataSource;
  thereAreImages: boolean = false;
  loading: boolean = true;

  obser: Observable<any> = new Observable<any>();
  collView: CollectionViewer = {viewChange: this.obser};

  tries: number = 0;
  
  constructor(private factService: FactService, private imageService: ImageService, private router: Router) {
    // this.dataSource = new FactsDataSource(factService);
    this.dataSource = new SearchImageDataSource(this.imageService.keyword, this.imageService);
    this.init();
    this.imageService.eventEmit.subscribe((n:EvObs) => {
      // console.log('loading: '+n.isLoading, 'finish: '+n.finish);
      this.loading = true;
        this.init();
    })
  }
  // openImage() {
  //   const ev = event as MouseEvent;
  //   const target = ev.target as HTMLElement;
  //   console.log(target.id);
  //   const id: string | null = target.id;
  //   this.router.navigate(['/zoom', id]);
  //   // this.router.navigateByUrl('zoom/'+id);
  // }
  init() {
    this.loading = true;
    const self = this;
    this.dataSource = new SearchImageDataSource(this.imageService.keyword, this.imageService);
    var timeout: any = null;
    this.dataSource.dataStream.subscribe( (nex:any) => {
      // console.log('loaded images: '+nex.length);
      self.thereAreImages = nex.length > 0;
      self.tries++;
      timeout = setTimeout(function () {
        self.loading = false;
      }, 16000);
      if (self.tries > 9) {
        clearTimeout(timeout);
        self.loading = false;
        self.tries = 0;
      }
    });
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

export class PopularImageDataSource extends DataSource<Media> {
  private cachedFacts: Media[] = Array<Media>();
  public dataStream = new BehaviorSubject<Media[]>(this.cachedFacts);
  private subscription = new Subscription();
  private pageSize = 10;
  private lastPage = 0;
  private innerHeight = window.innerHeight-100;
  private innerWidth = window.innerWidth-50;
  
  public get thereAreImages() : boolean {
    return this.cachedFacts.length > 0;
  }

  constructor(private imageService: ImageService) {
    super();
    this._fetchImagePage();
    this.clear();
  }

  public clear() {
    this.cachedFacts = [];
  }
  connect(collectionViewer: CollectionViewer): Observable<Media[] | ReadonlyArray<Media>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const currentPage = this._getPageForIndex(range.end);
      if (currentPage && range) {
        // console.log(currentPage, this.lastPage);
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

export class SearchImageDataSource extends DataSource<Media> {
  private cachedFacts: Media[] = Array<Media>();
  public dataStream = new BehaviorSubject<Media[]>(this.cachedFacts);
  private subscription = new Subscription();
  private pageSize = 10;
  private lastPage = 0;
  private innerHeight = window.innerHeight-100;
  private innerWidth = window.innerWidth-50;
  
  public get thereAreImages() : boolean {
    return this.cachedFacts.length > 0;
  }
  

  constructor(public search: string, private imageService: ImageService) {
    super();
    this._fetchImagePage();
  }

  public clear() {
    this.cachedFacts = [];
    this.dataStream = new BehaviorSubject<Media[]>(this.cachedFacts);
  }
  connect(collectionViewer: CollectionViewer): Observable<Media[] | ReadonlyArray<Media>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const currentPage = this._getPageForIndex(range.end);
      if (currentPage && range) {
        // console.log(currentPage, this.lastPage);
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
      this.imageService.getSearchedImageList(this.search).subscribe(res => {
        let list: any[] = res.data.children
        .filter(c => !!c.data.preview && !!c.data.preview.images[0] && !!c.data.preview.images[0])
        .map(d => { 
          return {
            author: d.data.author,
            awards: d.data.all_awardings?.length || 0,
            fullRes: d.data.preview.images[0].source.url.replace('&amp;', '&'),
            id: d.data.id,
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