export const ASSOCIATION_DOMAIN = {
  depression: "depression",
  mania: "mania",
  anxiety: "anxiety",
  substanceUse: "substance_use",
} as const;
export type AssociationDomain = typeof ASSOCIATION_DOMAIN;
export type AssociationDomainKey = keyof AssociationDomain;
export type AssociationDomainValue = AssociationDomain[AssociationDomainKey];

export const ASSESSMENT_LEVEL_TWO = {
  asrm: 'ASRM',
  assist: 'ASSIST',
  phq9: 'PHQ-9',
} as const;
export type AssessmentLevelTwo = typeof ASSESSMENT_LEVEL_TWO;
export type AssessmentLevelTwoKey = keyof AssessmentLevelTwo;
export type AssessmentLevelTwoValue = AssessmentLevelTwo[AssessmentLevelTwoKey];
