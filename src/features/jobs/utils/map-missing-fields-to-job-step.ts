/**
 * Maps API `missingFields` paths to the earliest locum wizard step.
 * Location may be reported as `practiceLocationId` even when FE sends `locationId`.
 */
export function mapMissingFieldsToLocumStep(missingFields: string[]): number {
  let earliest = 6;

  for (const field of missingFields) {
    const step = locumFieldToStep(field);
    if (step < earliest) {
      earliest = step;
    }
  }

  return earliest;
}

/**
 * Maps API `missingFields` paths to the earliest permanent wizard step.
 */
export function mapMissingFieldsToPermanentStep(
  missingFields: string[]
): number {
  let earliest = 7;

  for (const field of missingFields) {
    const step = permanentFieldToStep(field);
    if (step < earliest) {
      earliest = step;
    }
  }

  return earliest;
}

function normalize(field: string): string {
  return field.trim().toLowerCase();
}

function locumFieldToStep(field: string): number {
  const key = normalize(field);

  if (
    key === "roleid" ||
    key === "locationid" ||
    key === "practicelocationid" ||
    key === "location" ||
    key === "date" ||
    key === "timestart" ||
    key === "timeend" ||
    key === "breakdurationmins"
  ) {
    return 1;
  }

  if (
    key === "rate" ||
    key === "rateinterval" ||
    key === "paymenttermsid" ||
    key === "cancellationpolicyid"
  ) {
    return 2;
  }

  if (
    key === "skills" ||
    key === "software" ||
    key === "specialisms" ||
    key === "ppeprovided"
  ) {
    return 3;
  }

  if (key === "autoblockunverified" || key === "mandatorydocsforbooking") {
    return 4;
  }

  if (key === "instantbook" || key === "approvalrequired") {
    return 5;
  }

  return 6;
}

function permanentFieldToStep(field: string): number {
  const key = normalize(field);

  if (
    key === "roleid" ||
    key === "locationid" ||
    key === "practicelocationid" ||
    key === "location" ||
    key === "contracttypeid" ||
    key === "jobtypeid" ||
    key === "startdate"
  ) {
    return 1;
  }

  if (
    key === "jobtitle" ||
    key === "skills" ||
    key === "software" ||
    key === "experiencelevels" ||
    key === "specialisms"
  ) {
    return 2;
  }

  if (
    key === "salaryrange" ||
    key === "benefits" ||
    key === "workinghoursstart" ||
    key === "workinghoursend"
  ) {
    return 3;
  }

  if (key === "compliancedocuments" || key === "autofiltervaliddocs") {
    return 4;
  }

  if (key === "interviewtypeid") {
    return 5;
  }

  if (key === "jobdescription") {
    return 6;
  }

  return 7;
}
