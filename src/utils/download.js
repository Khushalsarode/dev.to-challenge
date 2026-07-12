import html2canvas from 'html2canvas';

export async function downloadLabel(targetRef, passion, vessel) {
  const node = targetRef?.current;
  if (!node) return;

  const canvas = await html2canvas(node, {
    scale: 3,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    imageTimeout: 5000,
  });

  const filename = `passion-${vessel}-${passion.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 25)}.png`;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
