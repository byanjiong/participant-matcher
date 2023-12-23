export class ClassAttendance {
  participantId: number;
  classes: { [key: string]: boolean };

  constructor(participantId: number) {
    this.participantId = participantId;
    this.classes = {};
  }
}
