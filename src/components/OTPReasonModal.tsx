import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Box from './Box';
import Text from './Text';
import Button from './Button';
import Dropdown from './DropDown';

interface Props {
  isVisible: boolean;
  closeModal?: () => void;
}

const OTPReasonModal = ({ isVisible, closeModal }: Props) => {
  const setReason = useState('')[1];

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
        <Text
          variant="medium"
          color="primary"
          textAlign="center"
          marginVertical="l">
          Select a reason for unavailable OTP
        </Text>
        <Dropdown
          // color={foreground}
          height={50}
          displayText="Select Reason"
          onSelect={v => {
            setReason(v);
          }}
          selectorContainerProps={{
            paddingVertical: 'm',
          }}
          data={[
            {
              title: 'Phone Unavailable',
              value: 'Phone Unavailable',
            },
            {
              title: 'OTP not received',
              value: 'OTP not received',
            },
          ]}
          style={{
            marginTop: 0,
          }}
        />
        <Box marginTop="l">
          <Button displayText="Submit Reason" onPress={() => {}} />
        </Box>
      </Box>
    </Modal>
  );
};

export default OTPReasonModal;
