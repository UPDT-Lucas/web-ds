import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommentComponent } from '../../components/comment/comment.component';
import { CommunicationService } from '../../../services/communication.service';
import { Activity, Comment, CommentReply } from '../../../interfaces/activity.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TextAreaComponent } from '../../../shared/components/text-area/text-area.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-comments-activity-page',
  standalone: true,
  imports: [
    HeaderComponent,
    CommentComponent,
    TextAreaComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './comments-activity-page.component.html',
  styleUrl: './comments-activity-page.component.css'
})
export class CommentsActivityPageComponent {

  constructor(private CS: CommunicationService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { }

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

  commentTextInput: string = "";
  userIsCordinator: boolean = false;
  activityId: string = '';
  commentsToShow: any[] = [];
  date = new Date()
  actualUser: {id: string, isTeacher: boolean} = {id: "", isTeacher: true}
  activeFlag =  false;
  actualCommentIndex = 0;

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
    for (let commentIndex in this.commentsToShow) {
      let comment: Comment = this.commentsToShow[commentIndex];
      let authorId = comment.author;
      this.CS.getProfessor(authorId).subscribe(res => {
        let authorName = res.account.name.firstName + ' ' + res.account.name.firstSurname;
        comment.author = authorName;
      })
      for (let replyIndex in comment.replies) {
        let reply = comment.replies[replyIndex];
        let authorId = reply.author;
        this.CS.getProfessor(authorId).subscribe(res => {
          let authorName = res.account.name.firstName + ' ' + res.account.name.firstSurname;
          reply.author = authorName;
        })
      }
    }
   console.log("actual comments") 
   console.log(this.commentsToShow) 
    //this.cdr.detectChanges();
    const isRemote = ActivityRequest.activity.isRemote;
    const virtualActivityLink = ActivityRequest.activity.virtualActivityLink;
    const activityPoster = ActivityRequest.activity.activityPoster;
    const currentState = ActivityRequest.activity.currentState;
    this.activity = { typeOfActivity, activityName, responsibles, executionDate, executionWeek, announcementDate, reminderDates, comments, isRemote, virtualActivityLink, activityPoster, currentState };
  }

  getResponsiblesNames(ActivityRequest: any) {
    let responsiblesNames: string[] = [];
    for (let responsibleIndex in ActivityRequest.activity.responsibles) {
      this.CS.getProfessor(ActivityRequest.activity.responsibles[responsibleIndex]).subscribe(res => {
        responsiblesNames.push(res.account.name.firstName + ' ' + res.account.name.firstSurname);
        // console.log(responsiblesNames);
      });
    }
    // console.log(responsiblesNames);
    return responsiblesNames;
  }
  
  deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  prettyPrint(obj: any){
    console.log(obj)
  }

  addComment(){
    if(!this.activeFlag){
      this.commentsToShow = this.deepCopy(this.activity.comments);
      let actualComment: Comment = {
            text: this.commentTextInput.toString(),
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
    }else{
      let actualReply: CommentReply = {
        text: this.commentTextInput.toString(),
        date: new Date(),
        author: this.actualUser.id
      }
      this.activity.comments[this.actualCommentIndex].replies.push(actualReply);
      this.CS.insertComment(this.activityId, this.activity.comments).subscribe(res => {
        console.log(res);
      })
      this.CS.getProfessor(this.actualUser.id).subscribe(res => {
        actualReply.author = res.account.name.firstName + ' ' + res.account.name.firstSurname;
        this.commentsToShow[this.actualCommentIndex].replies.push(actualReply);
      })
    }
  }


  activeIsReply(isActive: boolean){
    console.log(isActive)
    if(isActive){
      this.activeFlag = true
    }
  }

  getCommentIndex(index: number){
    this.actualCommentIndex = index
  }


}
