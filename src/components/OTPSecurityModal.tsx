import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Box from './Box';
import Input from './Input';
import Button from './Button';

interface Props {
  isVisible: boolean;
  closeModal?: () => void;
}

const OTPSecurityModal = ({ isVisible, closeModal }: Props) => {
  const [otp, setOTP] = useState('');

  return (
    <Modal
      propagateSwipe
      isVisible={isVisible}
      onBackdropPress={closeModal}
      style={{ margin: 0, justifyContent: 'center' }}>
      <Box
        marginHorizontal="l"
        borderRadius={20}
        backgroundColor="background"
        padding="l">
        <Input
          placeholder="Enter OTP"
          textContentType="oneTimeCode"
          keyboardType="number-pad"
          value={otp}
          onChangeText={v => setOTP(v)}
        />
        <Button displayText="Verify OTP" onPress={() => {}} />
      </Box>
    </Modal>
  );
};

export default OTPSecurityModal;
