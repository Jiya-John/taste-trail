function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="tt-dialog-backdrop">
      <div className="tt-dialog">
        <p>{message}</p>

        <div className="tt-dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmDialog