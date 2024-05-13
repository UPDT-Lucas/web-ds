import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { S3ApiService } from '../../../s3-api.service';
import { CommunicationService } from '../../../services/communication.service';
import {ActivatedRoute, Router} from "@angular/router";
import { map } from 'rxjs';

@Component({
  selector: 'app-edit-teacher-page',
  standalone: true,
  imports: [
    InputComponent,
    HeaderComponent,
    FileInputComponent,
    ButtonComponent,
    CheckboxInputComponent
  ],
  templateUrl: './edit-teacher-page.component.html',
  styleUrl: './edit-teacher-page.component.css'
})
export class EditTeacherPageComponent {

  id: string = "";
  
  firstNameOnInput: string = '';
  secondNameOnInput: string = '';
  firstSurnameOnInput: string = '';
  secondSurnameOnInput: string = '';
  emailOnInput: string = '';
  campusOnInput: string | null = null;
  cellPhoneOnInput: string = '';
  officePhoneOnInput: string = '';

  actualFirstName: string = '';
  actualSecondName: string = '';
  actualFirstSurname: string = '';
  actualSecondSurname: string = '';
  actualEmail: string = '';
  actualCampus: string | null = null;
  actualCellPhone: string = '';
  actualOfficePhone: string = '';
  actualPhoto: string = ''
  actualIsCoordinator: boolean = false;
  
  //isCordinator: string = '';

  constructor(
    private s3ApiService: S3ApiService, 
    private CS: CommunicationService, 
    private route: ActivatedRoute,
    private router: Router) {

    this.id = localStorage.getItem('-id') || '';
  }

  filename: string = "assets/images/teacher.png"
  file!: any;
  selectedValue: string = "1";

  isCordinator: boolean = false;


  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.id = params["id"]  
        this.getFields()
      }
    )
  }

  getFields(){
    this.CS.getProfessor(this.id).subscribe(
      prof => {
        this.actualFirstName = prof.account.name.firstName
        this.actualSecondName = prof.account.name.secondName
        this.actualFirstSurname = prof.account.name.firstSurname
        this.actualSecondSurname = prof.account.name.secondSurname
        this.actualEmail = prof.account.email
        this.actualCellPhone = prof.account.cellPhone
        this.actualOfficePhone = prof.account.officePhone
        this.actualPhoto = prof.account.photo
        this.actualIsCoordinator = prof.account.isCordinator
        this.actualPhoto = prof.account.photo
        this.actualCampus = prof.account.campus
        console.log("prof is")
        console.log(this.actualIsCoordinator)
      }
    )
  }

  getFile(file: any) {
    this.file = file;
  }

  getData(){
    console.log(this.file)

    // this.updateImage(this.file).subscribe(
    //   link => {
    //     console.log(link)
    //   }
    // )

    if(this.file){
      const formData = new FormData();
      formData.append('file', this.file);
      this.s3ApiService.uploadFile(formData).subscribe(
        (res) => {
          this.updateImage(this.file.name).subscribe((link) => {
          this.editTeacherAfterUpdate()
          })
        }
      )
    }else{
      this.editTeacherAfterUpdate()
    }
  }

  updateImage(filename: string){
    return this.s3ApiService.getFileByName(filename).pipe(
      map(res => {
        this.filename = res!.result;
      })
    );
  }

  OnSelectChange(event: any) {
    if(event !== null){
      this.selectedValue = event.target.value
      console.log(this.selectedValue)
    }
  }

  toggleIsCoordinator(event: any) {
    this.isCordinator = event.target.checked;
  }


  onCampusChange(event: any) {
    const selectedValue = event?.target?.value;
    if (selectedValue) {
      this.campusOnInput = selectedValue;
    }
  }  

  editTeacher(){
    this.getData()
  }
  

  editTeacherAfterUpdate() {
    // console.log(this.isCordinator)
    console.log("a")
    console.log(this.filename)
    const professorData = {
      firstName: this.firstNameOnInput ? this.firstNameOnInput : this.actualFirstName ,
      secondName: this.secondNameOnInput ? this.secondNameOnInput : this.actualSecondName,
      firstSurname: this.firstSurnameOnInput ? this.firstSurnameOnInput : this.actualFirstSurname,
      secondSurname: this.secondSurnameOnInput ? this.secondSurnameOnInput : this.actualSecondSurname,
      email: this.emailOnInput ? this.emailOnInput : this.actualEmail,
      campus: this.campusOnInput ? this.campusOnInput : this.actualCampus,
      cellPhone: this.cellPhoneOnInput ? this.cellPhoneOnInput : this.actualCellPhone,
      officePhone: this.officePhoneOnInput ? this.officePhoneOnInput : this.actualOfficePhone,
      photo: this.filename !== "assets/images/teacher.png" ? this.filename : this.actualPhoto,
      isCordinator: this.isCordinator !== this.actualIsCoordinator ? this.isCordinator : this.actualIsCoordinator
    };

    console.log(professorData)

    this.CS.editAccount(this.id, professorData).subscribe(
      response => {
        console.log('La información del profesor se ha actualizado con éxito:', response);
        this.router.navigate(["/viewProfile"])
        
      },
      error => {
        console.error('Error al actualizar la información del profesor:', error);
      }
    );
  }
}

