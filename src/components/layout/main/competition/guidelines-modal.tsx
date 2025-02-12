import { Portal, PortalContent } from '../../../Portal';
import { GuidelinesCard } from "../guidelines/guidelines-card";

interface GuidelinesModalProps {
  onClose: () => void;
}

export default function GuidelinesModal({ onClose }: GuidelinesModalProps) {
  return (
    <Portal container={document.body}>
      <PortalContent 
        position="center" 
        onClose={onClose}
        className="w-full max-w-2xl p-4"
      >
        <GuidelinesCard onClose={onClose} />
      </PortalContent>
    </Portal>
  );
} 