export declare const ASSOCIATION_DOMAIN: {
    readonly depression: "depression";
    readonly mania: "mania";
    readonly anxiety: "anxiety";
    readonly substanceUse: "substance_use";
};
export type AssociationDomain = typeof ASSOCIATION_DOMAIN;
export type AssociationDomainKey = keyof AssociationDomain;
export type AssociationDomainValue = AssociationDomain[AssociationDomainKey];
