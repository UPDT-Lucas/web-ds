export interface Activity {
  id?: string;
  typeOfActivity: string;
  activityName: string;
  responsibles: string[]; 
  executionDate: Date;
  executionWeek: number;
  announcementDate: Date;
  reminderDates: number;
  comments: Comment[];
  isRemote: boolean;
  virtualActivityLink: string;
  activityPoster: string;
  currentState: string;
}

export interface Comment {
  text: string;
  author: string; // Professor ID
  date: Date;
  replies: CommentReply[];
}

export interface CommentReply {
  date: Date;
  text: string;
  author: string; // Professor ID
}