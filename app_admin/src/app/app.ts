import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// Pull in our TripListing Component from trip-listing.ts
import { TripListing } from './trip-listing/trip-listing';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TripListing],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  // Pass string to the app.html page
  protected readonly title = 'Travlr Getaways Admin!';
}
