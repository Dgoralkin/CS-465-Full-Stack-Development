import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {

  public formError: string = '';
  credentials = { fName: '', lName: '', email: '', password: '', isRegistered: false, isAdmin: false };

  constructor(
    private router: Router,
    private authentication: Authentication
  ) { }

  ngOnInit(): void {}

  public onRegisterSubmit(): void {
    this.formError = '';

    if (!this.credentials.fName || !this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      return;
    }

    const newUser: User = {
      fName: this.credentials.fName,
      lName: this.credentials.lName,
      email: this.credentials.email,
      isRegistered: this.credentials.isRegistered,
      isAdmin: this.credentials.isAdmin,
      userSince: new Date()
    };

    // Call the service — no internal subscribe here if service already handles it
    this.authentication.register(newUser, this.credentials.password);
  }

}
