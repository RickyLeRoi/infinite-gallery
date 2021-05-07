import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data, Post } from '../model/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getRandomImage(): Observable<Post>|undefined {
    let resp = this.getRandomImageList();
    return undefined;
  }
  getRandomImageList(): Observable<Data> {
    let resp = this.http.get<Data>(`https://www.reddit.com/r/popular/top.json`);
    return resp;
  }
  getSearchedImageList(search: string): Observable<Data> {
    let resp = this.http.get<Data>(`https://www.reddit.com/r/${search}/top.json`);
    return resp;
  }
}