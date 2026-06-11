/** API 共通型（OpenAPI からの自動生成へ移行するまでの手書き定義） */

export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type StaffRole = "admin" | "staff" | "viewer";

export type Staff = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  /** アカウント発行済み（ログイン可能）か */
  hasAccount: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  id: string;
  name: string;
  kana: string | null;
  email: string | null;
  preferredLanguage: string;
  desiredOccupations: string[];
  skills: string[];
  strengths: string | null;
  weaknesses: string | null;
  accommodations: string[];
  commuteConditions: string | null;
  needsTransport: boolean;
  assignedStaffId: string | null;
  notes: string | null;
  isActive: boolean;
  /** アカウント発行済み（ログイン可能）か */
  hasAccount: boolean;
  /** 発行済みアカウントのログイン ID（未発行は null） */
  loginId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Company = {
  id: string;
  name: string;
  industry: string | null;
  internshipDescription: string | null;
  requiredSkills: string[];
  supportedAccommodations: string[];
  capacity: number;
  availableSchedule: string | null;
  workHours: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  belongings: string | null;
  emergencyContact: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AssignmentStatus =
  | "DRAFT"
  | "PROPOSED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type Assignment = {
  id: string;
  participantId: string;
  participantName: string;
  companyId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: AssignmentStatus;
  meetingPlace: string | null;
  goal: string | null;
  optimizationRunId: string | null;
  proposalReason: string | null;
  confirmedByStaffId: string | null;
  confirmedAt: string | null;
  cancelledReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportStatus = "DRAFT" | "SUBMITTED" | "REVIEWED" | "NEEDS_ACTION";

export type Report = {
  id: string;
  assignmentId: string;
  participantId: string;
  participantName: string;
  reportDate: string;
  status: ReportStatus;
  workDescription: string | null;
  didWell: string | null;
  difficult: string | null;
  enjoyed: string | null;
  troubled: string | null;
  satisfaction: number | null;
  fatigue: number | null;
  anxiety: number | null;
  difficulty: number | null;
  comfort: number | null;
  instructionClarity: number | null;
  wantsToContinue: number | null;
  accommodationSufficient: boolean | null;
  wantsConsultation: boolean;
  freeText: string | null;
  language: string;
  interviewNeeded: boolean;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportComment = {
  id: string;
  reportId: string;
  staffId: string;
  staffName: string;
  body: string;
  createdAt: string;
};

export type ReportDetail = Report & { comments: ReportComment[] };

export type OptimizationSolver = "sa" | "exact" | "dwave";

export type OptimizationStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";

export type OptimizationWeights = {
  desire: number;
  skill: number;
  fairness: number;
  rotation: number;
};

export type OptimizationCandidate = {
  assignments: {
    participantId: string;
    participantName: string;
    companyId: string;
    companyName: string;
    startDate: string;
    endDate: string;
    reasons: string[];
  }[];
  score: number;
  scoreBreakdown: Record<string, number>;
  violations: string[];
  energy: number | null;
};

export type OptimizationRun = {
  id: string;
  status: OptimizationStatus;
  solver: string;
  periodStart: string;
  periodEnd: string;
  participantIds: string[];
  companyIds: string[];
  weights: Record<string, number>;
  variableCount: number | null;
  constraintCount: number | null;
  executionTimeMs: number | null;
  energy: number | null;
  violationCount: number | null;
  errorMessage: string | null;
  candidates: OptimizationCandidate[] | null;
  selectedCandidate: OptimizationCandidate | null;
  executedByStaffId: string;
  createdAt: string;
};
