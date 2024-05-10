import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule desde @angular/forms
import { AppComponent } from './app.component';
import { InputComponent } from '../app/shared/components/input/input.component'; 

@NgModule({
  declarations: [
    AppComponent,
    InputComponent
   
  ],
  imports: [
    BrowserModule,
    FormsModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
