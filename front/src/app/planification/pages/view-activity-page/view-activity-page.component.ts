import { Component, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import { Activity } from '../../../interfaces/activity.interface';
import { ActivatedRoute } from '@angular/router';
import { Professor } from '../../../interfaces/professor.interface';
import { Router } from '@angular/router';
import { TextAreaComponent } from '../../../shared/components/text-area/text-area.component';
import { Comment, CommentReply } from '../../../interfaces/activity.interface';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-view-activity-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    TextAreaComponent,
    NgFor
  ],
  templateUrl: './view-activity-page.component.html',
  styleUrl: './view-activity-page.component.css'
})
export class ViewActivityPageComponent {
  constructor(private CS: CommunicationService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef ) {}

  activity: Activity = {
    typeOfActivity: '',
    activityName: '',
    responsibles: [],
    executionDate: new Date(),
    executionWeek: 1,
    announcementDate: new Date(),
    reminderDates: 0,
    comments: [],
    isRemote: false,
    virtualActivityLink: '',
    activityPoster: '',
    currentState: ''
  };

  userIsCordinator: boolean = false;
  activityId: string = '';
  actualUser: {id: string, isTeacher: boolean} = {id: "", isTeacher: true}

  currentComment: string = '';
  currentReply: string = '';

  commentsToShow: Comment[] = [];


  ngOnInit() {
    this.actualUser = this.CS.getActualUser();
    this.CS.getProfessor(this.actualUser.id).subscribe(
      prof => {
        if(prof.account.isCordinator){
          this.userIsCordinator = true
        }
      }
    )
    this.route.params.subscribe(params => {
      this.activityId = params['id'];
      this.CS.getActivity(this.activityId).subscribe(res =>{
         this.getData(res);
      })
    });
  }

  getResponsiblesNames(ActivityRequest: any){
    let responsiblesNames: string[] = [];
    for ( let responsibleIndex in ActivityRequest.activity.responsibles){
      this.CS.getProfessor(ActivityRequest.activity.responsibles[responsibleIndex]).subscribe(res => {
        responsiblesNames.push(res.account.name.firstName + ' ' + res.account.name.firstSurname);
        // console.log(responsiblesNames);
      });
    }
    // console.log(responsiblesNames);
    return responsiblesNames;
  }

  prettyPrintDate(dateString: Date): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return date.toLocaleDateString('es-ES', options);
  }

  getData(ActivityRequest: any) {
      const typeOfActivity = ActivityRequest.activity.typeOfActivity;
      const activityName = ActivityRequest.activity.activityName;
      const responsibles = this.getResponsiblesNames(ActivityRequest);
      const executionDate = ActivityRequest.activity.executionDate;
      const executionWeek = ActivityRequest.activity.executionWeek;
      const announcementDate = ActivityRequest.activity.announcementDate;
      const reminderDates = ActivityRequest.activity.reminderDates;
      let comments = ActivityRequest.activity.comments;
      this.commentsToShow = this.deepCopy(comments);
      for (let commentIndex in this.commentsToShow){
        let comment = this.commentsToShow[commentIndex];
        let authorId = comment.author;
        this.CS.getProfessor(authorId).subscribe(res => {
          let authorName = res.account.name.firstName + ' ' + res.account.name.firstSurname;
          comment.author = authorName;
        })
        for(let replyIndex in comment.replies){
          let reply = comment.replies[replyIndex];
          let authorId = reply.author;
          this.CS.getProfessor(authorId).subscribe(res => {
            let authorName = res.account.name.firstName + ' ' + res.account.name.firstSurname;
            reply.author = authorName;
          })
        }
      }
      //this.cdr.detectChanges();
      const isRemote = ActivityRequest.activity.isRemote;
      const virtualActivityLink = ActivityRequest.activity.virtualActivityLink;
      const activityPoster = ActivityRequest.activity.activityPoster;
      const currentState = ActivityRequest.activity.currentState;
      this.activity = { typeOfActivity, activityName, responsibles, executionDate, executionWeek, announcementDate, reminderDates, comments, isRemote, virtualActivityLink, activityPoster, currentState };
  }

  deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  addComment(){
    console.log(this.activity.comments)
    this.commentsToShow = this.deepCopy(this.activity.comments);
    let actualComment: Comment = {
          text: this.currentComment.toString(),
          date: new Date(),
          author: this.actualUser.id,
          replies: []
      }
      this.activity.comments.push(actualComment);
      this.CS.insertComment(this.activityId, this.activity.comments).subscribe(res => {
        console.log(res);
      })

      this.CS.getProfessor(this.actualUser.id).subscribe(res => {
        actualComment.author = res.account.name.firstName + ' ' + res.account.name.firstSurname;
        this.commentsToShow.push(actualComment);
        this.cdr.detectChanges();
      })
  }

  addReply(commentIndex: number){
    let actualReply: CommentReply = {
      text: this.currentReply.toString(),
      date: new Date(),
      author: this.actualUser.id
    }
    this.activity.comments[commentIndex].replies.push(actualReply);
    this.CS.insertComment(this.activityId, this.activity.comments).subscribe(res => {
      console.log(res);
    })
    this.CS.getProfessor(this.actualUser.id).subscribe(res => {
      actualReply.author = res.account.name.firstName + ' ' + res.account.name.firstSurname;
      this.commentsToShow[commentIndex].replies.push(actualReply);
    })
  }
  getAuthorName(authorId: string){
    this.CS.getProfessor(authorId).subscribe(res => {
      console.log(res);
      return res.account.name.firstName + ' ' + res.account.name.firstSurname;
    })
  }

  redirectToActivity(){
    this.router.navigate(['/editActivity/', this.activityId]);
  }


}
