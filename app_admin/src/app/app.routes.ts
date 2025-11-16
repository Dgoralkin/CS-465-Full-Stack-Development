import { Routes, provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AddTrip } from './add-trip/add-trip';
import { TripListing } from './trip-listing/trip-listing';
import { EditTrip } from './edit-trip/edit-trip';
import { Login } from './login/login';
import { Register } from './register/register';

// Routes
export const routes: Routes = [
  { path: 'add-trip', component: AddTrip },
  { path: 'edit-trip', component: EditTrip },
  { path: '', component: TripListing, pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];

// App configuration for bootstrapApplication
export const appConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
};
