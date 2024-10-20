import React, { ReactNode } from 'react';
import Modal from 'react-native-modal';
import Box from './Box';

interface Props {
  isVisible: boolean;
  closeModal?: () => void;
  children: ReactNode;
}

const BottomSheet = ({ isVisible, closeModal, children }: Props) => {
  return (
    <Modal
      propagateSwipe
      isVisible={isVisible}
      onBackdropPress={closeModal}
      style={{ margin: 0, justifyContent: 'flex-end' }}>
      <Box
        backgroundColor="background"
        overflow="hidden"
        paddingHorizontal="l"
        borderTopEndRadius={20}
        borderTopStartRadius={20}>
        {children}
      </Box>
    </Modal>
  );
};

export default BottomSheet;
