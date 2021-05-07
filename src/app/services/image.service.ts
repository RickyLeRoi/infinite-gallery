import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data, Post } from '../model/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  keyword: string = 'cats';
  eventEmit: EventEmitter<number> = new EventEmitter<number>(false);
  constructor(private http: HttpClient) { }

  changeKeyWord(value: string) {
    this.keyword = value || 'cats';
    this.eventEmit.next(Math.random());
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
    let resp = this.http.get<Data>(`https://www.reddit.com/r/${search}/top.json`);
    return resp;
  }
}