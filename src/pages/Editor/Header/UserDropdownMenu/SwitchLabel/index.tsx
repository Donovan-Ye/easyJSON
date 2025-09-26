interface SwitchLabelProps {
  checked: boolean;
}
const SwitchLabel: React.FC<SwitchLabelProps> = ({ checked }) => {
  return <div>{checked ? "ON" : "OFF"}</div>;
};

export default SwitchLabel;
