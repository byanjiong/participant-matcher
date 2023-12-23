import { Injectable } from '@angular/core';
import { ExcelFileHandlerService } from './excel-file-handler.service';
import { Participant } from '../models/participant.model';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipantMapService {

  constructor(
    private efhs: ExcelFileHandlerService,
    private lgs: LoggerService,

  ) { }

  private hasComma(name: string): boolean {
    return /,|，/.test(name);
  }
  private transformString = (value: string): string => {
    return value.toLowerCase().replace(/,|，/g, ' ');
  }

  private transformLowerCase = (value: string): string => {
    return value.toLowerCase();
  }

  private transformPhone = (value: string): string => {
    if (value.length < 6) {
      this.lgs.addLog(`注意: 电话"${value}"少过六个数字`, 'e');
      // console.warn(`Warning: Phone number "${value}" is less than 6 digits.`);
      return value;
    }
    // Return the last 6 digits of the phone number
    return value.slice(-6);
  }

  private transformGender = (value: string): string => {
    const lowerCaseValue = value.toLowerCase();

    switch (lowerCaseValue) {
      case "male":
      case "男":
        return "male";
      case "female":
      case "女":
        return "female";
      default:
        this.lgs.addLog(`注意: 性别字段 "${value}" 不匹配已知性别。`, 'e');
        return value; // Or return a default value or empty string
    }
  }


  private switchNamePartIfHave(name: string) {
    let parts = name.split(/,|，/).map(part => part.trim());
    return parts.length > 1 ? `${parts[1]},${parts[0]}` : '';
  };

  
  getMappingHeader(propertyName: keyof Participant, selection: number) {
    const fieldIndex = this.efhs.participantFields.indexOf(propertyName);
    if (fieldIndex === -1 || fieldIndex >= this.efhs.participantMappings.length) {
      this.lgs.addLog(`报错："${propertyName}"不属于学员的个人资料.`, 'e');
      console.error(`Property "${propertyName}" not found in participant fields.`);
      return '';
    }

    const mappingPair = this.efhs.participantMappings[fieldIndex];
    if (!mappingPair || mappingPair.length < selection) {
      this.lgs.addLog(`报错：无法在第${selection}文件找到与${propertyName}相应的栏目.`, 'e');

      console.error(`Mapping for "${propertyName}" is not available for selection ${selection}.`);
      return '';
    }

    // Adjust the index to be 0-based for JavaScript arrays
    const index = selection - 1;
    return mappingPair[index];
  }

  mapDataToParticipants(data: any[], selection: number): Participant[] {
    if (selection === 1 || selection == 2) {
    } else {
      this.lgs.addLog(`报错：系统错误，selection一定要 1 或 2.`, 'e');
    }

    const mappingHeaders = this.efhs.extractMappingColumn(this.efhs.participantMappings, selection);
    let mappingIDHeader = this.getMappingHeader('ID' as keyof Participant, selection);
    let mappingChineseNameHeader = this.getMappingHeader('chineseName' as keyof Participant, selection);
    let mappingEnglishNameHeader = this.getMappingHeader('englishName' as keyof Participant, selection);
    let mappingDharmaNameHeader = this.getMappingHeader('dharmaName' as keyof Participant, selection);
    let mappingOtherNameHeader = this.getMappingHeader('otherName' as keyof Participant, selection);
    let mappingGenderHeader = this.getMappingHeader('gender' as keyof Participant, selection);
    let mappingPhoneNumberHeader = this.getMappingHeader('phoneNumber' as keyof Participant, selection);
    let mappingEmailHeader = this.getMappingHeader('email' as keyof Participant, selection);
    let mappingResidenceHeader = this.getMappingHeader('residence' as keyof Participant, selection);

    // Assuming the first row of data contains headers
    const dataHeaders = data[0];
    let dataIDIndex = dataHeaders.indexOf(mappingIDHeader);
    let dataChineseNameIndex = dataHeaders.indexOf(mappingChineseNameHeader);
    let dataEnglishNameIndex = dataHeaders.indexOf(mappingEnglishNameHeader);
    let dataDharmaNameIndex = dataHeaders.indexOf(mappingDharmaNameHeader);
    let dataOtherNameIndex = dataHeaders.indexOf(mappingOtherNameHeader);
    let dataGenderIndex = dataHeaders.indexOf(mappingGenderHeader);
    let dataPhoneNumberIndex = dataHeaders.indexOf(mappingPhoneNumberHeader);
    let dataEmailIndex = dataHeaders.indexOf(mappingEmailHeader);
    let dataResidenceIndex = dataHeaders.indexOf(mappingResidenceHeader);

    if (dataIDIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "ID"，无法读取此项资料。`, 'e');
    }
    if (dataChineseNameIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "chineseName"，无法读取此项资料。`, 'e');
    }
    if (dataEnglishNameIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "englishName"，无法读取此项资料。`, 'e');
    }
    if (dataDharmaNameIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "dharmaName"，无法读取此项资料。`, 'e');
    }
    if (dataOtherNameIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "otherName"，无法读取此项资料。`, 'e');
    }
    if (dataGenderIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "gender"，无法读取此项资料。`, 'e');
    }
    if (dataPhoneNumberIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "phoneNumber"，无法读取此项资料。`, 'e');
    }
    if (dataEmailIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "email"，无法读取此项资料。`, 'e');
    }
    if (dataResidenceIndex === -1) {
      this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "residence"，无法读取此项资料。`, 'e');
    }

    const mappingAttendanceHeaders = this.efhs.extractMappingColumn(this.efhs.attendanceListMapping, selection);
    const dataAttendanceIndex = mappingAttendanceHeaders.map((mappingHeader, headerIdx) => {
      const idx = dataHeaders.indexOf(mappingHeader);
      if (idx === -1) {
        this.lgs.addLog(`注意：无法在第 ${selection} 文件读取 "${mappingHeader} (${this.efhs.attendanceList[headerIdx]})"，无法读取此项资料。`, 'e');
      }
      return idx;
    } );

    let zeroIDRowList = [];

    let participants = [];
    for (let idx = 0; idx < data.length; idx++) {
      if (idx === 0) continue; // Skip the first row (if it's headers)
    
      const row = data[idx];

      // Skip the header row and empty rows
      if (idx === 0 || row.every((cell: any) => cell === '' || cell === undefined)) {
        continue;
      }

      const participant = new Participant();

      // Direct assignment of properties
      participant.ID = this.extractValue(row, dataIDIndex, Number);
      if (participant.ID === 0) {
        zeroIDRowList.push(idx);
        continue;
      }

      participant.originalChineseName = this.extractValue(row, dataChineseNameIndex);
      participant.originalEnglishName = this.extractValue(row, dataEnglishNameIndex);
      participant.originalDharmaName = this.extractValue(row, dataDharmaNameIndex);
      participant.originalOtherName = this.extractValue(row, dataOtherNameIndex);
      participant.originalGender = this.extractValue(row, dataGenderIndex);
      participant.originalPhoneNumber = this.extractValue(row, dataPhoneNumberIndex);
      participant.originalEmail = this.extractValue(row, dataEmailIndex);
      participant.originalResidence = this.extractValue(row, dataResidenceIndex);

      let chineseNameRaw = this.extractValue(row, dataChineseNameIndex);
      let englishNameRaw = this.extractValue(row, dataEnglishNameIndex);
      let dharmaNameRaw = this.extractValue(row, dataDharmaNameIndex);

      participant.chineseName = this.transformString(chineseNameRaw);
      participant.englishName = this.transformString(englishNameRaw);
      participant.dharmaName = this.transformString(dharmaNameRaw);

      // Check for commas and adjust otherName
      let additionalNames = [];
      if (this.hasComma(chineseNameRaw)) {
        let temp = this.switchNamePartIfHave(chineseNameRaw);
        additionalNames.push(this.transformString(temp));
      }
      if (this.hasComma(englishNameRaw)) {
        let temp = this.switchNamePartIfHave(englishNameRaw);
        additionalNames.push(this.transformString(temp));
      }
      if (this.hasComma(dharmaNameRaw)) {
        let temp = this.switchNamePartIfHave(dharmaNameRaw);
        additionalNames.push(this.transformString(temp));
      }
      participant.otherName = this.extractArray(row, dataOtherNameIndex, this.transformString).concat(additionalNames);
      participant.gender = this.extractValue(row, dataGenderIndex, this.transformGender);
      participant.phoneNumber = this.extractArray(row, dataPhoneNumberIndex, this.transformPhone);
      participant.email = this.extractArray(row, dataEmailIndex, this.transformLowerCase);
      participant.residence = this.extractValue(row, dataResidenceIndex);
      participant.attendance = this.extractAttendance(row, dataAttendanceIndex);
      participant.attendanceCount = participant.attendance.reduce((acc, val) => acc + val, 0); // to sum all the attendence

      participants.push(participant);
    }

    if (zeroIDRowList.length>0) {
      this.lgs.addLog(`信息：在第 ${zeroIDRowList.join(', ')} 行跳过"${mappingIDHeader}" == 0`, 'i');

    }

    console.log('output from mapParticipants:');
    console.log(participants);
    return participants;
  }

  private extractValue(row: any[], index: number, transformFn?: (value: any) => any): any {
    if (index === -1) return '';
    const rawValue = row[index] || '';
    return transformFn ? transformFn(rawValue) : rawValue;
  }

  private extractArray(row: any[], index: number, transformFn?: (value: any) => any): string[] {
    const value = this.extractValue(row, index);

    // Check if value is a number
    if (typeof value === 'number') {
      return transformFn ? [transformFn(value.toString())] : [value.toString()];
    }

    // If value is a string, split and process it
    let arrayValues = value ? value.split(';').map((part: string) => part.trim()) : [];
    return transformFn ? arrayValues.map(transformFn) : arrayValues;
  }

  private extractAttendance(row: any[], rowIdxList: number[]) {
    const rowLength = row.length;
    return rowIdxList.map(idx => {
      if (idx === -1) {
        return 0;
      }
      if (idx < rowLength) {
        return this.transformToNumber(row[idx]);
      }
      this.lgs.addLog(`报错：放映文件可能有问题，找不到课程信息。`, 'e');
      return 0;
    });
  }

  transformToNumber(value: any): number {
    // Convert to number using the unary plus operator
    var number = +value;

    // Check if the conversion is NaN (Not a Number)
    if (isNaN(number)) {
        // Attempt to parse as a float if the value is a string
        if (typeof value === 'string') {
            number = parseFloat(value);
        }
    }

    // Return the number, or NaN if it's still not a valid number
    if (isNaN(number)) {
      this.lgs.addLog(`警告：无法将值 "${number}" 转换为数值。默认设置为 0。`, 'e');
      return 0;
    } else {
      return number;
    }
}


  transformToBoolean(val: any): boolean {
    const trueValues = [1, '1', 'yes', 'Yes', '是'];
    const falseValues = [0,'', '0', 'no', 'No', '否'];
  
    if (trueValues.includes(val)) {
      return true;
    } else if (falseValues.includes(val)) {
      return false;
    } else {
      this.lgs.addLog(`警告：无法将值 "${val}" 转换为布尔值。默认设置为 false。`, 'e');
      return false;
    }
  }
  


}
