import useInitial from "../hooks/useInitial";

const WidthMeasure: React.FC = () => {
  useInitial();

  return (
    <div id="width-measure" className="absolute invisible graph-node">
      <div className="graph-kv">
        <div className="graph-k">
          <span>{"measure"}</span>
        </div>
        <div className="graph-v" />
      </div>
    </div>
  );
};

export default WidthMeasure;
