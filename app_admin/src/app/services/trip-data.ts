// This is the Angular service trip-data file to allow us to configure the appropriate data paths.

import { Inject, Injectable } from '@angular/core';

// Observable handles async calls, while our model is used for the data format
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { HttpClient } from '@angular/common/http';

// Used for login and register in our new services.authentication Service.
import { User } from '../models/user';                    // To handle the two user parameters email and name
import { AuthResponse } from '../models/auth-response';   // The Observable that we return from login and register
import { BROWSER_STORAGE } from '../storage';             // Gives access to our persistent data

@Injectable({
  providedIn: 'root'
})

export class TripData {

  /*// Define URLs for development usage (localhost)
  private baseUrl = `http://localhost:3000/api`;
  private tripsUrl = `${this.baseUrl}/travel`;
*/

  // Define URLs for development usage (Hosted on Render.com)
  private baseUrl = `https://travlr-dg.onrender.com/api`;
  private tripsUrl = `${this.baseUrl}/travel`;

  // Constructor
  constructor( 
    private http: HttpClient, 
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {console.log("TripData in runtime is using:", this.tripsUrl);}

  // Call to our /login endpoint, returns JWT
  login(user: User, passwd: string) : Observable<AuthResponse> {
    console.log('Inside TripDataService::login');
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to our /register endpoint, creates user and returns JWT
  register(user: User, passwd: string) : Observable<AuthResponse> {
    console.log('Inside TripDataService::register');
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Helper method to process both login and register methods
  handleAuthAPICall(endpoint: string, user: User, passwd: string) : Observable<AuthResponse> {
    console.log('Inside TripDataService::handleAuthAPICall');
    let formData = {
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      password: passwd,
      isRegistered: user.isRegistered,
      isAdmin: user.isAdmin,
    };
    return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData);
  }

  // GET method helper - Used to get all the trips from the db for the Travel page
  getTrips() : Observable<Trip[]> {
    console.log('Inside TripData::getTrips');
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  // POST method helper
  addTrip(formData: Trip) : Observable<Trip> {
    console.log('Inside TripData::addTrip');
    return this.http.post<Trip>(this.tripsUrl, formData);
  }

  // GET method helper - Used to get a single trip from the db for the Travel page
   getTrip(tripCode: string) : Observable<Trip[]> {
    console.log('Inside TripData::getTrip');
    return this.http.get<Trip[]>(this.tripsUrl + '/' + tripCode);
  }

    // PUT method helper - Used to update a single trip from the db
   updateTrip(formData: Trip) : Observable<Trip> {
    console.log('Inside TripData::updateTrip');
    return this.http.put<Trip>(this.tripsUrl + '/' + formData.code, formData);
  }
}
