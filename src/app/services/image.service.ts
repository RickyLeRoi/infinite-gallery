import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data, Post } from '../model/post.model';
import { EvObs } from '../model/event.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  keyword: string = 'cats';
  cachedData: any[] = [];
  eventEmit: EventEmitter<EvObs> = new EventEmitter<EvObs>();
  constructor(private http: HttpClient) { }

  changeKeyWord(value: string) {
    this.keyword = value || 'cats';
    this.eventEmit.next({finish: false, isLoading: true});
  }
  getRandomImage(): Observable<Post>|undefined {
    let resp = this.getRandomImageList();
    return undefined;
  }
  getRandomImageList(): Observable<Data> {
    // let resp = this.http.get<Data>(`https://www.reddit.com/r/popular/top.json`);
    let resp = this.http.get<Data>(`https://www.reddit.com/r/${this.keyword}/top.json`);
    return resp;
  }
  getSearchedImageList(search: string): Observable<Data> {
    let resp = new Observable<Data>();
    this.cachedData = [];
    resp = this.http.get<Data>(`https://www.reddit.com/r/${search}/top.json`);
    resp.subscribe( 
      (n) => {
        // console.log(n);
        this.cachedData = this.cachedData.concat(n.data.children);
      },
      (e) => {
        // console.log(e);
      },
      console.log
    );
    return resp;
  }
}