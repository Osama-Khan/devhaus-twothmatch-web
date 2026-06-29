/** Job feed tab options on the home page */
export type JobFeedTab = "locum" | "permanent";

/** Practice profile shown in the left sidebar */
export type ProfileSummary = {
  practiceName: string;
  practiceType: string;
  logoInitials: string;
  distance: string;
  about: string;
};

/** Upcoming event listing */
export type UpcomingEvent = {
  id: string;
  title: string;
  dateTime: string;
  location: string;
};

/** Metadata row item on a job card */
export type JobMetaItem = {
  label: string;
  value: string;
};

/** Job listing in the center feed */
export type JobListing = {
  id: string;
  isNew: boolean;
  posterName: string;
  posterInitials: string;
  title: string;
  rate: string;
  matchPercent: number;
  requirements: string[];
  meta: JobMetaItem[];
};

/** Shift detail panel for the selected job */
export type ShiftDetail = {
  jobId: string;
  title: string;
  clinicName: string;
  clinicLocation: string;
  rate: string;
  time: string;
  duration: string;
  totalPay: string;
  address: string;
  commute: string;
  matchReasons: string[];
  requirements: string[];
  clinic: {
    name: string;
    type: string;
    rating: number;
    logoInitials: string;
  };
  cancellationPolicy: string;
};

export const MOCK_PROFILE: ProfileSummary = {
  practiceName: "Smile Bright Dental",
  practiceType: "Dental Practice",
  logoInitials: "SB",
  distance: "1.8 Miles away",
  about:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
};

export const MOCK_EVENTS: UpcomingEvent[] = [
  {
    id: "event-1",
    title: "Virtual 3D Scanning Workshop",
    dateTime: "10/10/2025 | 10:00 AM - 11:00 AM",
    location: "123 High Street, London",
  },
  {
    id: "event-2",
    title: "Virtual 3D Scanning Workshop",
    dateTime: "10/10/2025 | 10:00 AM - 11:00 AM",
    location: "123 High Street, London",
  },
];

export const MOCK_JOBS: JobListing[] = [
  {
    id: "job-1",
    isNew: true,
    posterName: "Steve Smith",
    posterInitials: "SS",
    title: "Dental Assistant",
    rate: "$16/hr",
    matchPercent: 92,
    requirements: [
      "Valid dental nursing qualification",
      "Experience in a clinical setting preferred",
    ],
    meta: [
      { label: "Distance", value: "1.8 Miles away" },
      { label: "Clinic", value: "NHS clinic" },
      { label: "Time", value: "10:00 AM - 09:00 PM" },
      { label: "Pay type", value: "Hourly" },
      { label: "Salary", value: "£25,000 - £30,000" },
    ],
  },
  {
    id: "job-2",
    isNew: true,
    posterName: "Steve Smith",
    posterInitials: "SS",
    title: "Dental Assistant",
    rate: "$16/hr",
    matchPercent: 92,
    requirements: [
      "Valid dental nursing qualification",
      "Experience in a clinical setting preferred",
    ],
    meta: [
      { label: "Distance", value: "1.8 Miles away" },
      { label: "Clinic", value: "NHS clinic" },
      { label: "Time", value: "10:00 AM - 09:00 PM" },
      { label: "Pay type", value: "Hourly" },
      { label: "Salary", value: "£25,000 - £30,000" },
    ],
  },
  {
    id: "job-3",
    isNew: true,
    posterName: "Steve Smith",
    posterInitials: "SS",
    title: "Dental Assistant",
    rate: "$16/hr",
    matchPercent: 92,
    requirements: [
      "Valid dental nursing qualification",
      "Experience in a clinical setting preferred",
    ],
    meta: [
      { label: "Distance", value: "1.8 Miles away" },
      { label: "Clinic", value: "NHS clinic" },
      { label: "Time", value: "10:00 AM - 09:00 PM" },
      { label: "Pay type", value: "Hourly" },
      { label: "Salary", value: "£25,000 - £30,000" },
    ],
  },
];

export const MOCK_SHIFT_DETAIL: ShiftDetail = {
  jobId: "job-1",
  title: "Dental Assistant",
  clinicName: "Smile Care Dental",
  clinicLocation: "Queensland",
  rate: "$16/hr",
  time: "10:00 AM - 09:00 PM",
  duration: "8 hours",
  totalPay: "$144.00",
  address: "123 High Street, London",
  commute: "2.3 miles away | 8 min Driver",
  matchReasons: [
    "Close to your preferred location",
    "Matches your NHS experience",
    "Shift fits your availability",
    "Rate meets your expectations",
  ],
  requirements: [
    "Valid GDC registration",
    "DBS check (Enhanced)",
    "Indemnity insurance",
    "Minimum 2 years experience",
  ],
  clinic: {
    name: "Smile Care Dental",
    type: "NHS Practice",
    rating: 4.8,
    logoInitials: "SC",
  },
  cancellationPolicy:
    "Free cancellation up to 24 hours before shift start. Cancellations within 24 hours may incur a fee.",
};
