import React from 'react';
import { View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import Modal from 'react-native-modal';

interface Props {
  visible: boolean;
}

const Loader = ({ visible }: Props) => {
  return (
    <Modal
      propagateSwipe
      isVisible={visible}
      style={{ margin: 0, justifyContent: 'flex-end' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Chase size={32} color="#FFFFFF" />
      </View>
    </Modal>
  );
};

export default Loader;
