// This class reads data from the api connector and returns it to trip-listing as a TripData[]

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { trips } from '../data/trips';        // Read the trips from the JSON template

import { Trip } from '../models/trip';        // Importing our Trip model to pull our data from the database instead of our local data file
import { TripData } from '../services/trip-data';

// Add the required import so that trip-listing can recognize trip-card component
import { TripCardComponent } from '../trip-card/trip-card';   // Read the trips from trip-card.ts

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]
})

export class TripListing implements OnInit{

  // trips: Array<any> = trips;        // Read the trips from the JSON template

  trips!: Trip[];
  message: string = '';

  constructor(private tripDataService: TripData) {
    console.log('trip-listing constructor');
  }

  private getStuff(): void {
    this.tripDataService.getTrips()     // Reads data from: let url = 'http://localhost:3000/api/travel';
    .subscribe({
      next: (value: any) => {
        this.trips = value;
        if(value.length > 0) {
          this.message = 'There are ' + value.length + ' trips available.';
        } else{
          this.message = 'There were no trips retireved from the database';
        }
        console.log(this.message);
        }, error: (error: any) => {
          console.log('Error: ' + error); 
        }
    })
  }
  
  ngOnInit(): void {
      console.log('ngOnInit');
      this.getStuff();
  }
}
