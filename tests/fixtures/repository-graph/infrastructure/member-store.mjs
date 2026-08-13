import { registerMember } from "../domain/member.mjs";

export function storeMember(member) {
  return member.persisted ? member : registerMember({ ...member, persisted: true });
}
