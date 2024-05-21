import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input()
  name: string = ""

  @Input()
  text: string = ""

  @Input()
  date: string = "" 

  @Input()
  isReply: boolean = false

  @Output()
  isSelected = new EventEmitter<boolean>();

  callIsSelected(){
    this.isSelected.emit(true)
  }
}

