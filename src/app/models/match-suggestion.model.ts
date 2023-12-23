import { Participant } from "./participant.model";


export interface CompareRecord {
	sourceParticipant: Participant; // participants from secondary database
	matches: MatchSuggestion[];
	alerts: string[];
	rejectMatches: boolean;
}

export interface MatchSuggestion {
	userConfirm: boolean; // check when user confirm that this is the correct match
	userReject: boolean;

	participant: Participant; // Participant from the main database
	
	// You can add more fields like a reason for match, etc.
	matchScore: number; // Score indicating the likelihood of a match
	matchGroup: string;
	rejectSore: number;
	attendanceDiff: number;
	attendanceCorrect: boolean;
}
