// 代码生成时间: 2025-10-07 20:28:46
import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';

// GraphQL mutation for creating a new modal dialog instance
const CREATE_MODAL_DIALOG = gql`
  mutation CreateModalDialog($input: ModalDialogInput!) {
    createModalDialog(input: $input) {
      id
      title
      message
    }
  }
`;

/**
 * ModalDialog Component Props Interface
 */
interface ModalDialogProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The ModalDialog component is a reusable React component
 * that can be used to display a modal dialog with a title and message.
 * It handles the opening and closing of the modal and can be easily extended
 * to include additional functionality such as form submissions.
 */
const ModalDialog: React.FC<ModalDialogProps> = ({ title, message, isOpen, onClose }) => {
  // State to handle showing or hiding the modal
  const [showModal, setShowModal] = useState(isOpen);

  // Handle the closing of the modal
  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  // Handle the opening of the modal
  const handleOpen = () => {
    setShowModal(true);
  };

  // Use Apollo useMutation hook to handle creating a new modal dialog
  const [createModalDialog] = useMutation(CREATE_MODAL_DIALOG);

  // Error state to capture any potential errors during mutation
  const [error, setError] = useState<Error | null>(null);

  // Function to handle submission of the modal dialog
  const handleSubmit = async () => {
    try {
      // Create a new modal dialog instance
      await createModalDialog({
        variables: {
          input: {
            title,
            message,
          },
        },
      });
    } catch (err) {
      // Set the error state if there is an error
      setError(err as Error);
    }
  };

  // Render the modal dialog if it is open
  return (
    <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={handleClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;
