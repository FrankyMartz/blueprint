export const ASSOCIATION_DOMAIN = {
  depression: "depression",
  mania: "mania",
  anxiety: "anxiety",
  substanceUse: "substance_use",
} as const;
export type AssociationDomain = typeof ASSOCIATION_DOMAIN;
export type AssociationDomainKey = keyof AssociationDomain;
export type AssociationDomainValue = AssociationDomain[AssociationDomainKey];
