export function wrapText(str, maxChars = 33, maxLines = 3) {
  const words = (str || '').split(' ').filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);

  const consumed = lines.join(' ').length;
  const overflowed = words.join(' ').length > consumed;
  if (lines.length === maxLines && overflowed) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.slice(0, Math.max(maxChars - 1, 0)).trim() + '…';
  }

  return lines.slice(0, maxLines);
}
