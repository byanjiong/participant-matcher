import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Participant, ParticipantProps } from '../models/participant.model';
import { BehaviorSubject, map } from 'rxjs';
import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';

type ParticipantMappings = {
  [K in ParticipantProps]?: [string, string];
};




@Injectable({
  providedIn: 'root'
})
export class ExcelFileHandlerService {

  constructor(
    private lgs: LoggerService,
  ) { }

  private participantMappingsSubject = new BehaviorSubject<[string, string][]>([]);
  participantMappings$ = this.participantMappingsSubject.asObservable();

  readonly originalParticipantFields: (keyof Participant)[] = [
    'ID', 'originalChineseName', 'originalEnglishName', 'originalDharmaName',
    'originalOtherName', 'originalGender', 'originalPhoneNumber', 'originalEmail', 'originalResidence'
  ];
  readonly participantFields: (keyof Participant)[] = [
    'ID', 'chineseName', 'englishName', 'dharmaName',
    'otherName', 'gender', 'phoneNumber', 'email', 'residence'
  ];
  participantMappings: [string, string][] = [];
  attendanceList: string[] = [];
  attendanceListMapping: [string, string][] = [];


  readFile(file: File): Promise<any> {
    this.lgs.addLog(`-`, 'i');
    this.lgs.addLog(`-`, 'i');
    this.lgs.addLog(`信息：读取文件...`, 'i');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
        if (!sheet['!ref']) {
          this.lgs.addLog(`报错：找不到有效的数据范围`, 'e');
          reject(new Error('No valid range found in the sheet'));
          return;
        }
  
        const range = XLSX.utils.decode_range(sheet['!ref']); // Now safe to use
  
        let jsonData = [];
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
          let row = [];
          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            let cellRef = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            row.push(sheet[cellRef] ? sheet[cellRef].v : '');
          }
          jsonData.push(row);
        }
        this.lgs.addLog(`信息：处理文件结束`, 'i');
        this.lgs.addLog(`信息：==========`, 'i');
        resolve(jsonData);
      };
  
      reader.onerror = (error) => {
        this.lgs.addLog(`报错：无法处理文件：${error}`, 'e');
        this.lgs.addLog(`信息：==========`, 'i');
        reject(error);
      };
  
      reader.readAsBinaryString(file);
    });
  }

  extractMappingColumn(mappingPairs: [string, string][], columnNumber: number) {
    // Ensure that the column number is either 1 or 2
    if (columnNumber !== 1 && columnNumber !== 2) {
      this.lgs.addLog(`报错：系统错误，columnNumber 必须是 1 或 2.`, 'e');
      return [];
    }
  
    // Adjust the index to be 0-based for JavaScript arrays
    const columnIndex = columnNumber - 1;
  
    return mappingPairs.map(pair => {
      if (pair && pair.length > columnIndex) {
        return pair[columnIndex];
      }
      return ''; // Or any default value you prefer
    });
  }

  
  processMappingFile(file: File): Promise<any> {
    this.lgs.addLog(`-`, 'i');
    this.lgs.addLog(`-`, 'i');
    this.lgs.addLog(`信息：读取文件...`, 'i');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const mappings = this.createMappingsFromData(jsonData);
        this.lgs.addLog(`信息：处理文件结束`, 'i');
        this.lgs.addLog(`信息：==========`, 'i');
        resolve(mappings);
      };
      reader.onerror = (error) => {
        this.lgs.addLog(`报错：无法处理文件：${error}`, 'e');
        this.lgs.addLog(`信息：==========`, 'i');
        reject(error);
      };
      reader.readAsBinaryString(file);
    });
  }

  private createMappingsFromData(data: any[]) {
    // Initialize participantMappings with empty pairs
    this.participantMappings = this.participantFields.map(() => ['', '']);
    this.attendanceList = [];
    this.attendanceListMapping = [];
  
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const systemName = row[0] || '';
      const mainHeader = row.length > 1 ? row[1] : '';
      const secondaryHeader = row.length > 2 ? row[2] : '';
  
      if (!systemName) {
        continue;
      }
  
      const index = this.participantFields.indexOf(systemName);
      if (index !== -1) {
        // Update participant mappings at the correct index
        this.participantMappings[index] = [mainHeader, secondaryHeader];
      } else {
        // Add to attendance mappings
        this.attendanceList.push(systemName);
        this.attendanceListMapping.push([mainHeader, secondaryHeader]);
      }
    }
  
    this.participantMappingsSubject.next(this.participantMappings);
    return;
  }
  
  


}
