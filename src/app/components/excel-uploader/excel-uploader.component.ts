import { Component } from '@angular/core';
import { ExcelPairViewerComponent } from "../excel-pair-viewer/excel-pair-viewer.component";
import { ExcelFileHandlerService } from '../../services/excel-file-handler.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ParticipantComparisonService } from '../../services/participant-comparison.service';
import { Participant } from '../../models/participant.model';
import { ParticipantMapService } from '../../services/participant-map.service';
import { MatStepperModule } from '@angular/material/stepper';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { LoggerService } from '../../services/logger.service';
import { LogViewerComponent } from "../log-viewer/log-viewer.component";

@Component({
    selector: 'app-excel-uploader',
    standalone: true,
    templateUrl: './excel-uploader.component.html',
    styleUrl: './excel-uploader.component.scss',
    imports: [CommonModule, MatButtonModule, ExcelPairViewerComponent, MatStepperModule, LogViewerComponent]
})
export class ExcelUploaderComponent {
  constructor(
    private efhs: ExcelFileHandlerService,
    private pcs: ParticipantComparisonService,
    private pms: ParticipantMapService,
    public dialog: MatDialog,
    private lgs: LoggerService,
  ) { }

  filenameMapping = '';
  filenameFile1 = '';
  filenameFile2 = '';

  excelData = '';
  mappingData: any = '';

  processFile(event: Event, selection: number): void {
    if (selection === 1 || selection == 2) {
    } else {
      this.lgs.addLog(`报错：系统错误，selection一定要 1 或 2.`, 'e');
    }
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;

    if (files && files.length > 0) {
      const file = files[0];
      if (selection === 1) {
        this.filenameFile1 = file.name;
      } else {
        this.filenameFile2 = file.name;
      }
      this.efhs.readFile(file)
        .then(data => {
          // Process data and map to Participant model
          const participants = this.pms.mapDataToParticipants(data, selection);
          if (selection === 1) {
            this.pcs.addPrimaryParticipants(participants);
            this.lgs.addLog(`信息：已把信息加入主要数据库`, 'i');
          } else {
            this.pcs.addSecondaryParticipants(participants);
            this.lgs.addLog(`信息：已把信息加入次要数据库`, 'i');
          }
        })
        .catch(error => {
          this.lgs.addLog(`报错：无法读取Excel文件： ${error}`, 'e');
          console.error('Error reading the Excel file', error);
        });
    }
  }

  handleMappingFile(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;

    if (files && files.length > 0) {
      const file = files[0];
      this.filenameMapping = file.name;
      this.efhs.processMappingFile(file)
        .then(mappings => {
          this.lgs.addLog(`信息：已经处理映射文件`, 'i');
          // Store the mappings for later use
        })
        .catch(error => {
          this.lgs.addLog(`报错：处理映射文件时出错： ${error}`, 'e');
          console.error('Error processing the mapping file', error);
        });
    }
  }

  showDialogMapping() {
    const dialogRef = this.dialog.open(ExcelPairViewerComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      // The dialog was closed
    });
  }




}
