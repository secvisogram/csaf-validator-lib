import { CVSS31 } from '@pandatix/js-cvss'

/**
 * Wrapper for first interface with @pandatix/js-cvss
 */

/**
 * Build a result object from a successfully parsed CVSS31 instance.
 *
 * @param {CVSS31} cvss
 * @param {string} vectorString
 */
function buildResult(cvss, vectorString) {
  const baseScore = cvss.BaseScore()
  const temporalScore = cvss.TemporalScore()
  const environmentalScore = cvss.EnvironmentalScore()

  return {
    success: true,

    baseMetricScore: baseScore.toFixed(1),
    baseSeverity: CVSS31.Rating(baseScore),

    temporalMetricScore: temporalScore.toFixed(1),
    temporalSeverity: CVSS31.Rating(temporalScore),

    environmentalMetricScore: environmentalScore.toFixed(1),
    environmentalSeverity: CVSS31.Rating(environmentalScore),

    vectorString,
  }
}

/**
 * Calculate CVSS 3.1 scores from a vector string.
 *
 * Returns an object with `success: true` and score/severity fields on success,
 * or `{ success: false }` when the vector is invalid.
 *
 * @param {string} vectorString
 */
function calculateCVSSFromVector(vectorString) {
  try {
    const cvss = new CVSS31(vectorString)
    return buildResult(cvss, vectorString)
  } catch {
    return { success: false }
  }
}

/**
 * Calculate CVSS 3.1 scores from individual metric parameters.
 *
 * Assembles a vector string from the 22 positional parameters (using the same
 * metric ordering defined by the CVSS v3.1 specification) and delegates to
 * calculateCVSSFromVector.
 *
 * All Base metrics are required. Temporal and Environmental metrics default to
 * "X" ("Not Defined") when undefined or empty.
 *
 * @param {string} AttackVector
 * @param {string} AttackComplexity
 * @param {string} PrivilegesRequired
 * @param {string} UserInteraction
 * @param {string} Scope
 * @param {string} Confidentiality
 * @param {string} Integrity
 * @param {string} Availability
 * @param {string} [ExploitCodeMaturity]
 * @param {string} [RemediationLevel]
 * @param {string} [ReportConfidence]
 * @param {string} [ConfidentialityRequirement]
 * @param {string} [IntegrityRequirement]
 * @param {string} [AvailabilityRequirement]
 * @param {string} [ModifiedAttackVector]
 * @param {string} [ModifiedAttackComplexity]
 * @param {string} [ModifiedPrivilegesRequired]
 * @param {string} [ModifiedUserInteraction]
 * @param {string} [ModifiedScope]
 * @param {string} [ModifiedConfidentiality]
 * @param {string} [ModifiedIntegrity]
 * @param {string} [ModifiedAvailability]
 */
function calculateCVSSFromMetrics(
  AttackVector,
  AttackComplexity,
  PrivilegesRequired,
  UserInteraction,
  Scope,
  Confidentiality,
  Integrity,
  Availability,
  ExploitCodeMaturity,
  RemediationLevel,
  ReportConfidence,
  ConfidentialityRequirement,
  IntegrityRequirement,
  AvailabilityRequirement,
  ModifiedAttackVector,
  ModifiedAttackComplexity,
  ModifiedPrivilegesRequired,
  ModifiedUserInteraction,
  ModifiedScope,
  ModifiedConfidentiality,
  ModifiedIntegrity,
  ModifiedAvailability
) {
  // Validate that all mandatory base metrics are present
  const missing = []
  if (!AttackVector) missing.push('AV')
  if (!AttackComplexity) missing.push('AC')
  if (!PrivilegesRequired) missing.push('PR')
  if (!UserInteraction) missing.push('UI')
  if (!Scope) missing.push('S')
  if (!Confidentiality) missing.push('C')
  if (!Integrity) missing.push('I')
  if (!Availability) missing.push('A')

  if (missing.length > 0) {
    return { success: false, errorType: 'MissingBaseMetric', errorMetrics: missing }
  }

  // Temporal and Environmental metrics default to "X" (Not Defined)
  const E = ExploitCodeMaturity || 'X'
  const RL = RemediationLevel || 'X'
  const RC = ReportConfidence || 'X'
  const CR = ConfidentialityRequirement || 'X'
  const IR = IntegrityRequirement || 'X'
  const AR = AvailabilityRequirement || 'X'
  const MAV = ModifiedAttackVector || 'X'
  const MAC = ModifiedAttackComplexity || 'X'
  const MPR = ModifiedPrivilegesRequired || 'X'
  const MUI = ModifiedUserInteraction || 'X'
  const MS = ModifiedScope || 'X'
  const MC = ModifiedConfidentiality || 'X'
  const MI = ModifiedIntegrity || 'X'
  const MA = ModifiedAvailability || 'X'

  // Assemble the vector string (only include non-"X" optional metrics)
  let vector =
    'CVSS:3.1' +
    '/AV:' + AttackVector +
    '/AC:' + AttackComplexity +
    '/PR:' + PrivilegesRequired +
    '/UI:' + UserInteraction +
    '/S:' + Scope +
    '/C:' + Confidentiality +
    '/I:' + Integrity +
    '/A:' + Availability

  if (E !== 'X') vector += '/E:' + E
  if (RL !== 'X') vector += '/RL:' + RL
  if (RC !== 'X') vector += '/RC:' + RC
  if (CR !== 'X') vector += '/CR:' + CR
  if (IR !== 'X') vector += '/IR:' + IR
  if (AR !== 'X') vector += '/AR:' + AR
  if (MAV !== 'X') vector += '/MAV:' + MAV
  if (MAC !== 'X') vector += '/MAC:' + MAC
  if (MPR !== 'X') vector += '/MPR:' + MPR
  if (MUI !== 'X') vector += '/MUI:' + MUI
  if (MS !== 'X') vector += '/MS:' + MS
  if (MC !== 'X') vector += '/MC:' + MC
  if (MI !== 'X') vector += '/MI:' + MI
  if (MA !== 'X') vector += '/MA:' + MA

  return calculateCVSSFromVector(vector)
}

export default { calculateCVSSFromVector, calculateCVSSFromMetrics }
