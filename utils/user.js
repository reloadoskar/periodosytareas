const EDITABLE_PROFILE_FIELDS = [
  "nombre",
  "apellido1",
  "apellido2",
  "telefono",
];

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

export function getUserDisplayName(user = {}) {
  const fullName = [user.nombre, user.apellido1]
    .map(cleanString)
    .filter(Boolean)
    .join(" ");
  if (fullName) return fullName;

  const email = cleanString(user.email);
  if (email) return email.split("@")[0];

  return "Usuario";
}

export function sanitizeUserUpdate(input = {}) {
  return EDITABLE_PROFILE_FIELDS.reduce((profile, field) => {
    const value = cleanString(input[field]);
    if (value) profile[field] = value;
    return profile;
  }, {});
}
