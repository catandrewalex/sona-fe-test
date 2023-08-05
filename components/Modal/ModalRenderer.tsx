import Modal, { ModalProps } from "@sonamusica-fe/components/Modal";
import { useState } from "react";

const useModalRenderer = ({ ...props }: Partial<ModalProps> = {}): {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  ModalRenderer: ({ children }: { children: JSX.Element | JSX.Element[] }) => JSX.Element;
} => {
  const [open, setOpen] = useState<boolean>(false);
  const openModal = () => setOpen(true);
  const closeModal = () => {
    props.onClose?.();
    setOpen(false);
  };

  const ModalRenderer = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
    return (
      <Modal {...props} open={open} onClose={closeModal}>
        {children}
      </Modal>
    );
  };

  return { openModal, closeModal, ModalRenderer, open };
};

export default useModalRenderer;
