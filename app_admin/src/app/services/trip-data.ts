// This is the Angular service trip-data file to allow us to configure the appropriate data paths.

import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// Observable handles async calls, while our model is used for the data format
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class TripData {

  constructor(private http: HttpClient) {}

  getTrips() : Observable<Trip[]> {
    let url = 'http://localhost:3000/api/travel';
    return this.http.get<Trip[]>(url);
  }
}
