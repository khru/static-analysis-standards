import { decorateName } from "../leaf/name-decoration.mjs";

export function renderMember(member) {
  return decorateName(member.name);
}
