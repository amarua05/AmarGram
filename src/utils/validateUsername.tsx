import badWords from "../constants/badwords.json";

export function validateUsername(username: string) {
  const normalized = username.toLowerCase().trim();

  if (normalized.length < 3 || normalized.length > 20) {
    return { valid: false, message: "Username must be 3-20 characters long." };
  }

  const validPattern = /^[a-z0-9_.]+$/;
  if (!validPattern.test(normalized)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, underscores, and periods.",
    };
  }

  if (/^[._]|[._]$/.test(normalized) || /\.{2,}/.test(normalized)) {
    return {
      valid: false,
      message: "Username can't start or end with a period/underscore, or contain consecutive periods.",
    };
  }

  const hasBadWord = badWords.some((word) =>
    normalized.includes(word.toLowerCase())
  );

  if (hasBadWord) {
    return { valid: false, message: "Username contains a disallowed word." };
  }

  return { valid: true, message: "" };
}