import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'shared-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input()
  text: string = "";

  @Input()
  link: string = "";

  @Input()
  bordered: boolean = false;
  
  constructor(private router: Router){}

  redirect(){
    if(this.link){
      this.router.navigate([this.link])
    }
  }
}
