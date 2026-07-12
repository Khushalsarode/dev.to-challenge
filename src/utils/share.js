import { VESSELS } from '../config/vessels';

export function buildTwitterShareUrl(passion, vessel, labelData, appUrl) {
  const v = VESSELS[vessel];
  const f = v.fields;
  const title = labelData[f.title];
  const year = labelData[f.year];
  const closer = labelData[f.closer].replace(/"/g, '');

  const text = encodeURIComponent(
    `I just ${v.verb} my passion for ${passion} ${v.emoji}\n\n` +
    `${title} · ${year}\n"${closer}"\n\n` +
    `Get yours →`
  );
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(appUrl)}`;
}
