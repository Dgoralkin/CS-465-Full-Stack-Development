import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trips } from '../data/trips';              // Read the trips from the JSON template

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})

export class TripListing implements OnInit{
  trips: Array<any> = trips;

  constructor () {}
  ngOnInit(): void {
      // Do...
  }
}
