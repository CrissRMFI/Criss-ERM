export default function Toast({ msg, show }: { msg: string; show: boolean }) {
  return <div className={`toast ${show ? "show" : ""}`}>{msg}</div>;
}
