

export type ParticipantProps = keyof Participant;


export class Participant {
  constructor() {
    // Initialize properties
    this.ID = 0;

    this.originalChineseName = ''; // this field hold the unchange extracted value
    this.originalEnglishName = ''; // this field hold the unchange extracted value
    this.originalDharmaName = ''; // this field hold the unchange extracted value
    this.originalOtherName = ''; // this field hold the unchange extracted value
    this.originalGender = ''; // this field hold the unchange extracted value
    this.originalPhoneNumber = ''; // this field hold the unchange extracted value
    this.originalEmail = ''; // this field hold the unchange extracted value
    this.originalResidence = ''; // this field hold the unchange extracted value

    this.chineseName = '';
    this.englishName = '';
    this.dharmaName = '';
    this.otherName = [];
    this.gender = '';
    this.phoneNumber = [];
    this.email = [];
    this.residence = '';
    this.attendance = [];
    this.attendanceCount = 0;
  }

  ID: number; // 序号

  originalChineseName: string;
  originalEnglishName: string;
  originalDharmaName: string;
  originalOtherName: string;
  originalGender: string;
  originalPhoneNumber: string;
  originalEmail: string;
  originalResidence: string;

  chineseName: string; // 中文名（简体）
  englishName: string; // 英文名字/其他
  dharmaName: string; // 法名
  otherName: string[]; // 其他名字s
  gender: string; // 性别
  phoneNumber: string[]; // 手机号码
  email: string[]; // 邮箱
  residence: string; // 所在地
  attendance: number[];
  attendanceCount: number;
}


