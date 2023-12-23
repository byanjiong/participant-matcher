import { Component } from '@angular/core';
import { ParticipantComparisonService } from '../../services/participant-comparison.service';
import { Subscription } from 'rxjs';
import { CompareRecord, MatchSuggestion } from '../../models/match-suggestion.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { DialogData, ParticipantComparisonViewerComponent } from '../participant-comparison-viewer/participant-comparison-viewer.component';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Participant } from '../../models/participant.model';
import {MatIconModule} from '@angular/material/icon';
import { ExcelFileHandlerService } from '../../services/excel-file-handler.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-compare-result-viewer',
    standalone: true,
    templateUrl: './compare-result-viewer.component.html',
    styleUrl: './compare-result-viewer.component.scss',
    imports: [CommonModule, MatButtonModule, MatCheckboxModule, FormsModule, MatIconModule, MatTooltipModule]
})
export class CompareResultViewerComponent {
  constructor(
    public pcs: ParticipantComparisonService,
    public efhs: ExcelFileHandlerService,
    public dialog: MatDialog
  ) {}

  private compareResultsSubscription!: Subscription;

  compareRecords: CompareRecord[] = [];
  compareStarted = false;

  ngOnInit() {
    this.compareResultsSubscription = this.pcs.compareResults$.subscribe(result => {
      this.compareRecords = result;
    });
  }

  ngOnDestroy() {
    this.compareResultsSubscription.unsubscribe();
  }

  compare() {
    this.compareStarted = true;
    this.pcs.compareAllParticipants();
  }

  openDialog(primary: Participant, secondary: Participant) {
    const data: DialogData = {
      primary: primary,
      secondary: secondary,
    }
    this.dialog.open(ParticipantComparisonViewerComponent, {
      data,
    });
  }

  onUserReject(match: MatchSuggestion) {
    match.userReject = !match.userReject;
    if (match.userReject) {
      match.userConfirm = false;
    }
  }

  onRejectMatches(record: CompareRecord) {
    record.rejectMatches = !record.rejectMatches;
  }


  downloadExcelFile() {
    const filename = 'compare-output';
    const data = this.pcs.generateReport(this.compareRecords);

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // Write the workbook and trigger a download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
  
  changeUserConfirm(record: CompareRecord, match: MatchSuggestion) {
    record.matches.forEach(m => {
      if (m !== match) {
        m.userConfirm = false;
      }
    });
    // const idx = record.matches.indexOf(match);
    // console.log(match);
    // console.log(`idx: ${idx}`);

  }
}
