import { Injectable } from '@angular/core';
import { Participant } from '../models/participant.model';
import { CompareRecord, MatchSuggestion } from '../models/match-suggestion.model';
import { BehaviorSubject } from 'rxjs';
import { ExcelFileHandlerService } from './excel-file-handler.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipantComparisonService {

  constructor(
    private efhs: ExcelFileHandlerService,
    private lgs: LoggerService,
  ) { }

  primaryParticipants: Participant[] = [];
  secondaryParticipants: Participant[] = [];

  private compareResultSubject = new BehaviorSubject<CompareRecord[]>([]);
  compareResults$ = this.compareResultSubject.asObservable();

  addPrimaryParticipants(participants: Participant[]) {
    this.primaryParticipants = participants;
  }

  addSecondaryParticipants(participants: Participant[]) {
    this.secondaryParticipants = participants;
  }

  private calculateMatchScore(primary: Participant, secondary: Participant): number {
    let score = 0;
  
    // Add points for each matching attribute
    if (primary.chineseName && primary.chineseName === secondary.chineseName) {
      score += 10; // Arbitrary score for a name match
    }
    if (primary.englishName && primary.englishName === secondary.englishName) {
      score += 10; // Same for English name
    }
    if (primary.dharmaName && primary.dharmaName === secondary.dharmaName) {
      score += 10; // Same for English name
    }
    if (primary.otherName.length > 0 && secondary.otherName.length > 0) {
      const matchFound = primary.otherName.some(name => secondary.otherName.includes(name));
      if (matchFound) {
        score += 9; // Add score if any other name matches
      }
    }

    // Comparing array of phone number
    if (primary.phoneNumber.length > 0 && secondary.phoneNumber.length > 0) {
      const phoneMatchFound = primary.phoneNumber.some(phone => secondary.phoneNumber.includes(phone));
      if (phoneMatchFound) {
        score += 8; // Add score if any phone number matches
      }
    }

    // Comparing array of emails
    if (primary.email.length > 0 && secondary.email.length > 0) {
      const emailMatchFound = primary.email.some(email => secondary.email.includes(email));
      if (emailMatchFound) {
        score += 5; // Add score if any email matches
      }
    }
  
    return score;
  }

  private calculateRejectScore(primary: Participant, secondary: Participant): number {
    if (primary.gender === secondary.gender) {
      return 0;
    } else {
      return 50;
    }
  }

  private checkAttendance(primary: Participant, secondary: Participant): { diff: number, correct: boolean } {
    
  
    // Check if the count of 'true' values differs between primary and secondary  
    const diff = secondary.attendanceCount - primary.attendanceCount;
    if (diff > 0) {
      return { diff: diff, correct: false };
    }

    // Check if both attendance arrays are the same
    const correct = primary.attendance.length === secondary.attendance.length &&
                    primary.attendance.every((val, index) => val === secondary.attendance[index]);
  
    return {
      diff: diff,  // diff is true if the counts differ
      correct      // correct is true if both arrays are the same
    };
  }

  private calculateMatchGroup(matchScore: number) {
    if (matchScore < 6) {
      return 'vlow';
    } else if (matchScore < 10) {
      return 'low';
    } else if (matchScore < 20) {
      return 'mid';
    } else if (matchScore < 30) {
      return 'high';
    } else {
      return 'vhigh';
    }
  }

  compareAllParticipants(): CompareRecord[] {
    let compareRecords: CompareRecord[] = [];
  
    this.secondaryParticipants.forEach(secondaryParticipant => {
      let matches: MatchSuggestion[] = [];
      let alerts: string[] = [];

      this.primaryParticipants.forEach(primaryParticipant => {
        const matchScore = this.calculateMatchScore(primaryParticipant, secondaryParticipant);
        const matchGroup = this.calculateMatchGroup(matchScore);
        const rejectScore = this.calculateRejectScore(primaryParticipant, secondaryParticipant);
        const { diff, correct } = this.checkAttendance(primaryParticipant, secondaryParticipant);

        if (matchScore > 0) {
          matches.push({
            userConfirm: false,
            userReject: false,
            participant: primaryParticipant,
            matchScore,
            matchGroup,
            rejectSore: rejectScore,
            attendanceDiff: diff,
            attendanceCorrect: correct
          });
        }
      });
  
      if (matches.length > 0) {
        compareRecords.push({
          sourceParticipant: secondaryParticipant,
          matches,
          alerts: alerts,
          rejectMatches: false,
        });
      // } else if (this.countTrue(secondaryParticipant.attendance) > 0) { // if unmatch, but still have attendence, then alert
      } else if (secondaryParticipant.attendanceCount > 0) { 
        compareRecords.push({
          sourceParticipant: secondaryParticipant,
          matches,
          alerts: ['unmatchButAttended'],
          rejectMatches: false,
        });
      }
    });

    this.compareResultSubject.next(compareRecords);
    return compareRecords;
  }
  
  addReportExtraColumn(matchType: string, matchScore: number|string, rejectScore: number|string, attendenceDiff: number|string, attendenceCorrect: number|string) {
    return [matchType, matchScore, rejectScore, attendenceDiff, attendenceCorrect];
  }

  generateReport(compareRecords: CompareRecord[]): any[][] {
    let excelData = [];
    const header: any[] = this.efhs.extractMappingColumn(this.efhs.participantMappings, 2);
    const attendanceHeader = this.efhs.extractMappingColumn(this.efhs.attendanceListMapping, 2);
    let merge = header.concat(attendanceHeader, this.addReportExtraColumn('匹配类型', '匹配分数', '排除分数', '课程次数差别', '课程正确'));
    excelData.push(merge);


    compareRecords.forEach((record, index) => {
      if (record.alerts.length > 0 || record.rejectMatches) {
        // let firstPart = this.efhs.participantFields.map(field => record.sourceParticipant[field]); // default
        let firstPart = this.efhs.originalParticipantFields.map(field => record.sourceParticipant[field]);
        // reset all attendance
        let secondPart = attendanceHeader.map(header => '');

        let extra: any[] = [];
        if (record.alerts.length > 0) {
          extra = this.addReportExtraColumn('无匹配但有填写出席课程', '?', '?', '?', '?');
        } else {
          extra = this.addReportExtraColumn('排除匹配', '?', '?', '?', '?');
        }
        let merge = firstPart.concat(secondPart, extra);
        excelData.push(merge);
      } else if (record.matches.length > 0) {
        let outputCount = 0;
        for (let i = 0; i < record.matches.length; i++) {
          if (record.matches[i].userConfirm) {
            // let firstPart = this.efhs.participantFields.map(field => record.sourceParticipant[field]); // default
            let firstPart = this.efhs.originalParticipantFields.map(field => record.sourceParticipant[field]);
            let secondPart = record.matches[i].participant.attendance.map(val => val ? val : '');
            let merge = firstPart.concat(secondPart, this.addReportExtraColumn(
              '已勾匹配', 
              record.matches[i].matchScore,
              record.matches[i].rejectSore,
              record.matches[i].attendanceDiff,
              record.matches[i].attendanceCorrect ? 1 : 0,
            ));
            excelData.push(merge);
            outputCount++;
          }
        }
        if (outputCount > 1) {
          this.lgs.addLog(`注意：已输出${outputCount}个与"${record.sourceParticipant.chineseName}"匹配的选项，请检查是否额外多打勾。`, 'e');
        } else if (outputCount === 0) {
          if (record.sourceParticipant.attendanceCount > 0) {
            if (record.matches.length > 1) {
              this.lgs.addLog(`注意：有${record.matches.length}个与"${record.sourceParticipant.chineseName}"匹配的选项，但都没有被确认，也没被输出，系统有点担心。`, 'e');
            } else if (record.matches.length === 1) {
              if (record.matches[0].matchScore < 20) {
                this.lgs.addLog(`注意："${record.sourceParticipant.chineseName}"的匹配分数较小（${record.matches[0].matchScore}），请确认是否匹配正确。要去除此警报，请在低匹配分学员旁打勾，代表您已确认。`, 'e');
              }
            } else {
              this.lgs.addLog(`报错：如果看到这个警告，代表本脚本有bug了，此句本不该流传到江湖。`, 'e');
            }
          }
        }
      }

    });

    return excelData;
  }


}
