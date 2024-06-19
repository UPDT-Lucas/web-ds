import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileInputComponent } from "../../../shared/components/file-input/file-input.component";
import { S3ApiService } from "../../../s3-api.service";
import { CommunicationService } from "../../../services/communication.service";
import { ActivatedRoute } from "@angular/router";
import { Activity } from "../../../interfaces/activity.interface";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { map } from "rxjs";
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: "app-evidence-page",
  standalone: true,
  imports: [HeaderComponent, FileInputComponent, ButtonComponent, CommonModule],
  templateUrl: "./evidence-page.component.html",
  styleUrl: "./evidence-page.component.css",
})
export class EvidencePageComponent {
  constructor(
    private s3ApiService: S3ApiService,
    private CS: CommunicationService,
    private route: ActivatedRoute
  ) {}

  inputActivityEvidence: string = "";
  activityId: string = "";

  Activity: any = {};
  activityEvidence: string[] = [];

  file!: any;
  filename: string = "";

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.activityId = params["id"];
      this.CS.getActivity(this.activityId).subscribe((activityRequest: any) => {
        if (activityRequest) {
          this.Activity = activityRequest.activity;
          this.activityEvidence = this.Activity.activityEvidence;
          console.log(this.Activity);
        }
      });
    });
  }

  getEvidenceFile(file: any) {
    console.log("HOLA");
    this.file = file;
    const formData = new FormData();
    formData.append("file", this.file);
    this.s3ApiService.uploadFile(formData).subscribe((res) => {
      this.updateImage(this.file.name).subscribe(() => {
      });
    });
  }


  updateImage(filename: string) {
    return this.s3ApiService.getFileByName(filename).pipe(
      map((res: any) => {
        this.filename = res!.result;
        this.activityEvidence.push(this.filename);
      })
    );
  }

  uploadActivity() {
    const activityData: Activity = {
      typeOfActivity: this.Activity.typeOfActivity,
      activityName: this.Activity.activityName,
      responsibles: this.Activity.responsibles,
      executionDate: this.Activity.executionDate,
      executionWeek: this.Activity.executionWeek,
      announcementDate: this.Activity.announcementDate,
      reminderDates: this.Activity.reminderDates,
      comments: this.Activity.comments,
      isRemote: this.Activity.isRemote,
      virtualActivityLink: this.Activity.activityPoster,
      activityPoster: this.Activity.filename,
      currentState: this.Activity.currentState,
      activityEvidence: this.activityEvidence,
    };
    console.log(activityData);
    this.CS.editActivity(this.activityId, activityData).subscribe(
      (res: any) => {
        console.log(res);
      }
    );
  }

  saveEvidence() {
    this.uploadActivity();
  }
}
