/** Shift detail panel for the legacy practice shift sidebar placeholder */
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
