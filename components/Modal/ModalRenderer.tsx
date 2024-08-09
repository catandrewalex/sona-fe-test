import Modal, { ModalProps } from "@sonamusica-fe/components/Modal";
import { useCallback, useState } from "react";

const useModalRenderer = ({ ...props }: Partial<ModalProps> = {}): {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  ModalRenderer: ({ children }: { children: JSX.Element | JSX.Element[] }) => JSX.Element;
} => {
  const [open, setOpen] = useState<boolean>(false);
  const openModal = useCallback(() => setOpen(true), [setOpen]);
  const closeModal = useCallback(() => {
    props.onClose?.();
    setOpen(false);
  }, [props, setOpen]);

  const ModalRenderer = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
    return (
      <Modal {...props} open={open} onClose={closeModal} disableEscape={false}>
        {children}
      </Modal>
    );
  };

  return { openModal, closeModal, ModalRenderer, open };
};

export default useModalRenderer;
