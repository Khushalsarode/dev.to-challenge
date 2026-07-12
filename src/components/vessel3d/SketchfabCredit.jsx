import { SKETCHFAB_MODELS } from '../../config/sketchfab';

function SketchfabCredit({ vessel }) {
  const model = SKETCHFAB_MODELS[vessel];
  const isWine = vessel === 'wine';

  return (
    <p className={`sketchfab-attribution sketchfab-attribution--${vessel}`}>
      <span className="sketchfab-attribution-type">{isWine ? 'Bottle' : 'Anvil'}</span>
      <a
        href={model.creditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sketchfab-attribution-author"
        title={`${model.credit} on Sketchfab`}
      >
        {model.credit}
      </a>
      <span className="sketchfab-attribution-via">Sketchfab</span>
    </p>
  );
}

export default SketchfabCredit;
