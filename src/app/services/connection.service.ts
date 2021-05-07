import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ConnectionService {
    
    constructor(private http: HttpClient) { }
    
    /*========================================
    CRUD Methods for consuming RESTful API
    =========================================*/
    
    // Http Options
    httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }  
    
    getURL(search: string) { if (!search) search = 'streaming'; return 'https://www.reddit.com/r/'+search+'/top.json'; }

    // HttpClient API get() method => Fetch employees list
    getImages(search: string): Observable<any> {
        return this.http.get<any>(this.getURL(search))
        .pipe(
            retry(1),
            catchError(this.handleError)
            )
    }

    // Error handling 
    handleError(error: any) {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }
        
}