export interface Activity {
  id?: string;
  typeOfActivity: string;
  activityName: string;
  responsibles: string[]; 
  executionDate: Date;
  executionWeek: number;
  announcementDate: Date;
  reminderDates: Date[];
  comments: Comment[];
  isRemote: boolean;
  virtualActivityLink: string;
  activityPoster: string;
  currentState: string;
}

export interface Comment {
  text: string;
  author: string; // Professor ID
  replies: CommentReply[];
}

export interface CommentReply {
  text: string;
  author: string; // Professor ID
}