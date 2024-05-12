import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { el } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-view-students-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    TableComponent,
    FileInputComponent
  ],
  templateUrl: './view-students-page.component.html',
  styleUrl: './view-students-page.component.css'
})
export class ViewStudentsPageComponent {

  constructor(private fileSaver: FileSaverService) { }

  downloadExcel(): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data = [
      { name: 'John Doe', age: 25 },
      { name: 'Jane Doe', age: 24 },
      { name: 'Jim Doe', age: 23 }
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 
        'Students': worksheet 
      }, 
      SheetNames: ['Students'] 
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this.fileSaver.save(blobData, `students${EXCEL_EXTENSION}`);  //FileName

  }

  uploadExcel(event: any): void {
    const file: File = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsBinaryString(file);
    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log(jsonData);
    };

    if (!file) {
      console.log('No file selected');
    }
  }
}
