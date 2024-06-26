import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule desde @angular/forms
import { AppComponent } from './app.component';
import { InputComponent } from '../app/shared/components/input/input.component'; 
import { setAppInjector } from './app-injector';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule, 
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {
  constructor(private injector: Injector) {
    setAppInjector(injector);
  }
 }
