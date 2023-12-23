import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LogMsg {
  msg: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  private log: LogMsg[] = [];

  private logSubject = new BehaviorSubject<LogMsg[]>([]);
  log$ = this.logSubject.asObservable();
  

  addLog(message: string, type: string) {
    this.log.push({
      msg: message,
      type,
    });
    this.logSubject.next(this.log);
  }

}
 
