import badWords from "../constants/badwords.json";

export function validateUsername(username: string) {
  const normalized = username.toLowerCase().trim();

  if (normalized.length < 3 || normalized.length > 20) {
    return { valid: false, message: "Username must be 3-20 characters long." };
  }

  const hasBadWord = badWords.some((word) =>
    normalized.includes(word.toLowerCase())
  );

  if (hasBadWord) {
    return { valid: false, message: "Username contains a disallowed word." };
  }

  return { valid: true, message: "" };
}