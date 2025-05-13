export declare const ASSOCIATION_DOMAIN: {
    readonly depression: "depression";
    readonly mania: "mania";
    readonly anxiety: "anxiety";
    readonly substanceUse: "substance_use";
};
export type AssociationDomain = typeof ASSOCIATION_DOMAIN;
export type AssociationDomainKey = keyof AssociationDomain;
export type AssociationDomainValue = AssociationDomain[AssociationDomainKey];
export declare const ASSESSMENT_LEVEL_TWO: {
    readonly asrm: "ASRM";
    readonly assist: "ASSIST";
    readonly phq9: "PHQ-9";
};
export type AssessmentLevelTwo = typeof ASSESSMENT_LEVEL_TWO;
export type AssessmentLevelTwoKey = keyof AssessmentLevelTwo;
export type AssessmentLevelTwoValue = AssessmentLevelTwo[AssessmentLevelTwoKey];
