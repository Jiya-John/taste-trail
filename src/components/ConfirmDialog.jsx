function ConfirmDialog({ message, onConfirm, onCancel, hideCancel}) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <p>{message}</p>

        <div className="dialog-actions">
          {!hideCancel && <button onClick={onCancel}>Cancel</button>}
          <button className="primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmDialog