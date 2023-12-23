import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogMsg, LoggerService } from '../../services/logger.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-viewer.component.html',
  styleUrl: './log-viewer.component.scss'
})
export class LogViewerComponent {
  constructor(private logService: LoggerService) {}
  
  private logSubscription!: Subscription;
  
  logs: LogMsg[] = [];

  ngOnInit() {
    this.logSubscription = this.logService.log$.subscribe(logs => {
      this.logs = logs;
    });
  }

  ngOnDestroy() {
    this.logSubscription.unsubscribe();
  }

}
