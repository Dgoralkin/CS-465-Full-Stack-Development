// This is the Angular service trip-data file to allow us to configure the appropriate data paths.

import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// Observable handles async calls, while our model is used for the data format
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { HttpClient } from '@angular/common/http';

// Switch between development and production environment
import { environment } from '../../environments/environment';
console.log('API Base URL:', environment.apiUrl);
// ng serve   OR  ng build --configuration=production

@Injectable({
  providedIn: 'root'
})

export class TripData {

  // url = 'http://localhost:3000/api/travel';    // static URL
  private url = `${environment.apiUrl}/travel`;  // dynamic URL for production usege
  
    // URL path address
  constructor(private http: HttpClient) {}

  // GET method helper - Used to get all the trips from the db for the Travel page
  getTrips() : Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  // POST method helper
  addTrip(formData: Trip) : Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  // GET method helper - Used to get a single trip from the db for the Travel page
   getTrip(tripCode: string) : Observable<Trip[]> {
    console.log('Inside TripData::getTrip');
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

    // PUT method helper - Used to update a single trip from the db
   updateTrip(formData: Trip) : Observable<Trip> {
    console.log('Inside TripData::updateTrip');
    return this.http.put<Trip>(this.url + '/' + formData.code, formData);
  }
}
