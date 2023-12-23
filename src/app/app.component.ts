import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppbarComponent } from "./components/appbar/appbar.component";
import { ExcelPairViewerComponent } from "./components/excel-pair-viewer/excel-pair-viewer.component";
import { MatButtonModule } from '@angular/material/button';
import { ExcelFileHandlerService } from './services/excel-file-handler.service';
import { ExcelUploaderComponent } from "./components/excel-uploader/excel-uploader.component";
import { CompareResultViewerComponent } from "./components/compare-result-viewer/compare-result-viewer.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    AppbarComponent,
    ExcelPairViewerComponent,
    MatDividerModule,
    MatButtonModule,
    ExcelUploaderComponent,
    CompareResultViewerComponent
  ]
})
export class AppComponent {

  title = 'participant-matcher';




}
