import { Component } from '@angular/core';
import { Inject} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Participant } from '../../models/participant.model';
import { ExcelFileHandlerService } from '../../services/excel-file-handler.service';
import { MatTableModule } from '@angular/material/table';


export interface DialogData {
  primary: Participant;
  secondary: Participant;
}

interface ComparisonDataRow {
  header: string; // Main Excel header
  primaryValue: string; // Data from the primary participant
  secondaryValue: string; // Data from the secondary participant
}


@Component({
  selector: 'app-participant-comparison-viewer',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatTableModule],
  templateUrl: './participant-comparison-viewer.component.html',
  styleUrl: './participant-comparison-viewer.component.scss'
})
export class ParticipantComparisonViewerComponent {
  constructor(
    private efhs: ExcelFileHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dataSource = this.prepareComparisonData(this.data.primary, this.data.secondary);
  }

  displayedColumns: string[] = ['项目', '主要资料库', '次要资料库'];
  dataSource: any[] = [];

  prepareComparisonData(primary: Participant, secondary: Participant): ComparisonDataRow[] {
    let comparisonData: ComparisonDataRow[] = [];
  
    // Compare basic fields
    this.efhs.participantFields.forEach((field, index) => {
      const mainExcelHeader = this.efhs.participantMappings[index][0];
      let header = mainExcelHeader;
      if (mainExcelHeader === '') {
        header = field;
      }
      comparisonData.push({
        header: header, // Get header from main Excel file
        primaryValue: primary[field]?.toString() || '',
        secondaryValue: secondary[field]?.toString() || ''
      });
    });
  
    // Compare attendance data
    this.efhs.attendanceList.forEach((attendanceField, index) => {
      if (primary.attendance[index] || secondary.attendance[index]) {
        comparisonData.push({
          header: this.efhs.attendanceListMapping[index][0], // Get attendance header from main Excel file
          primaryValue: primary.attendance[index] ? primary.attendance[index].toString() : '',
          secondaryValue: secondary.attendance[index] ? secondary.attendance[index].toString() : ''
        });
      }
      
    });
  
    return comparisonData;
  }
  

}
