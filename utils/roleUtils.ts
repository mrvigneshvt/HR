export function isReadOnlyRole(role?: string) {
  if (!role) return false;
  return ['manager'].includes(role.toLowerCase());
}
