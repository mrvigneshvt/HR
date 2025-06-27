export function isReadOnlyRole(role?: string) {
  if (!role) return false;
  return ['executive', 'manager'].includes(role.toLowerCase());
} 