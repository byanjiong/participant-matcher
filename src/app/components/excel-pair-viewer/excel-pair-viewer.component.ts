import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ExcelFileHandlerService } from '../../services/excel-file-handler.service';

@Component({
  selector: 'app-excel-pair-viewer',
  standalone: true,
  imports:  [MatTableModule],
  templateUrl: './excel-pair-viewer.component.html',
  styleUrl: './excel-pair-viewer.component.scss'
})
export class ExcelPairViewerComponent implements OnInit{
  displayedColumns: string[] = ['field', 'mainHeader', 'secondaryHeader'];
  dataSource: any[] = [];

  constructor(private excelFileHandlerService: ExcelFileHandlerService) {}

  ngOnInit() {
    this.excelFileHandlerService.participantMappings$.subscribe(mappings => {
      this.prepareTableData(mappings);
    });
  }

  prepareTableData(participantMappings: [string, string][]) {
    // Reset dataSource
    this.dataSource = [];
  
    // Use participantMappings passed as a parameter
    this.dataSource = this.excelFileHandlerService.participantFields.map((field, index) => ({
      field,
      mainHeader: participantMappings[index]?.[0] || '?', // '?' for missing values
      secondaryHeader: participantMappings[index]?.[1] || '?'
    }));
  
    // Add attendance data
    this.excelFileHandlerService.attendanceList.forEach((field, index) => {
      this.dataSource.push({
        field,
        mainHeader: this.excelFileHandlerService.attendanceListMapping[index][0],
        secondaryHeader: this.excelFileHandlerService.attendanceListMapping[index][1]
      });
    });
  
    console.log('prepareTableData:', this.dataSource);
  }
  



}
