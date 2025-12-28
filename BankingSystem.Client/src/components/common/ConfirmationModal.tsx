import { Modal, Button } from "antd";

interface ConfirmationModalProps {
  open: boolean;
  text: string;
  onSucess: () => void;
  onCancel?: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  text,
  onSucess,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      title="Confirm Action"
      onOk={onSucess}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
      okButtonProps={{ danger: true }}
    >
      <p>{text}</p>
    </Modal>
  );
};

export default ConfirmationModal;
