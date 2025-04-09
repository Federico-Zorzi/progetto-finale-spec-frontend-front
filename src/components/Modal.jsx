import { createPortal } from "react-dom";

const Modal = ({
  title = "Titolo modale",
  content = "Contenuto modale",
  show = false,
  onClose = () => {},
  onConfirm = () => {},
  confirmButton = {
    confirmText: "Conferma",
    confirmColor: "grey",
    buttonType: "button",
    buttonForm: "",
  },
}) => {
  return createPortal(
    <div className={`modal${show ? " show" : ""}`}>
      <div className="modal-container">
        <span className="close" title="Close Modal" onClick={onClose}>
          ×
        </span>

        <h2>{title}</h2>
        <div id="modal-content">{content}</div>

        <div className="modal-btn">
          <button type="button" className="cancelbtn" onClick={onClose}>
            Annulla
          </button>
          <button
            type={confirmButton.buttonType}
            form={confirmButton.buttonForm}
            className="confirmbtn"
            onClick={onConfirm}
            style={{ backgroundColor: confirmButton.confirmColor }}
          >
            {confirmButton.confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
