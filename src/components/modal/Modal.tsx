type TModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
};

const Modal = ({ children, onClose, open }: TModalProps) => {
  return open ? (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50  overscroll-contain"
      onClick={onClose}
    >
      <div className="w-full h-full flex items-center justify-center overscroll-contain">
        {children}
      </div>
    </div>
  ) : null;
};

export { Modal };
