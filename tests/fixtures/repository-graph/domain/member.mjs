import { storeMember } from "../infrastructure/member-store.mjs";

export function registerMember(member) {
  return storeMember(member);
}
