import { Component } from '@angular/core';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import {Router, ActivatedRoute} from "@angular/router";
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';


@Component({
  selector: 'app-edit-student-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    FileInputComponent,
    CheckboxInputComponent
  ],
  templateUrl: './edit-student-page.component.html',
  styleUrl: './edit-student-page.component.css'
})
export class EditStudentPageComponent {


  id: string = "";

  firstNameOnInput: string = '';
  secondNameOnInput: string = '';
  firstSurnameOnInput: string = '';
  secondSurnameOnInput: string = '';
  emailOnInput: string = '';
  campusOnInput: string | null = null;
  cellPhoneOnInput: string = '';
  carnetOnInput: string = '';


  actualFirstName: string = '';
  actualSecondName: string = '';
  actualFirstSurname: string = '';
  actualSecondSurname: string = '';
  actualEmail: string = '';
  actualCampus: string | null = null;
  actualCellPhone: string = '';
  actualCarnet: string = '';

  /*
  firstName: string = "";
  secondName: string = "";
  firstSurname: string = "";
  secondSurname: string = "";
  email: string = "";
  campus: string = '663057863ee524ad51bd5b0f';
  cellPhone: string = "";
  carnet: string = "";
  
  */

  constructor( 
    private CS: CommunicationService, 
    private route: ActivatedRoute, 
    private router: Router) {

    this.id = localStorage.getItem('-id') || '';
    //console.log(this.id)
  }

  file!: any;
  selectedValue: string = "1";

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.id = params["id"]  
        this.getFields()
      }
    )
  }

  getFields(){
    this.CS.getStudent(this.id).subscribe(
      
      (stud) => {
        //console.log(stud);
        this.actualFirstName = stud.account.name.firstName
      
        this.actualSecondName = stud.account.name.secondName
        this.actualFirstSurname = stud.account.name.firstSurname
        this.actualSecondSurname = stud.account.name.secondSurname
        this.actualEmail = stud.account.email
        this.actualCampus = stud.account.campus
        this.actualCellPhone = stud.account.cellPhone
        this.actualCarnet = stud.account.carnet
        //console.log("hiii",this.actualFirstSurname)
        //console.log("stud is")
       
      }
    )
  }

  getFile(file: any) {
    this.file = file;
  }

  getData(){
    this.editStudentAfterUpdate()
  }

  OnSelectChange(event: any) {
    if(event !== null){
      this.selectedValue = event.target.value
      //console.log(this.selectedValue)
    }
  }

  onCampusChange(event: any) {
    const selectedValue = event?.target?.value;
    if (selectedValue) {
      this.campusOnInput = selectedValue;
    }
  }  

  editStudent(){
    this.getData()
  }

  editStudentAfterUpdate() {
    //console.log("a")
    const studentData = {
      firstName: this.firstNameOnInput ? this.firstNameOnInput : this.actualFirstName ,
      secondName: this.secondNameOnInput ? this.secondNameOnInput : this.actualSecondName,
      firstSurname: this.firstSurnameOnInput ? this.firstSurnameOnInput : this.actualFirstSurname,
      secondSurname: this.secondSurnameOnInput ? this.secondSurnameOnInput : this.actualSecondSurname,
      email: this.emailOnInput ? this.emailOnInput : this.actualEmail,
      campus: this.campusOnInput ? this.campusOnInput : this.actualCampus,
      cellPhone: this.cellPhoneOnInput ? this.cellPhoneOnInput : this.actualCellPhone,
      carnet: this.carnetOnInput ? this.carnetOnInput : this.actualCarnet  
      
    };
    // console.log(this.id);
    // console.log(studentData)

    this.CS.editAccountStudent(this.id, studentData).subscribe(
      response => {
        this.router.navigate(["/viewStudents"])
      }
    );
  }


}
