import React from 'react';
import Box from './Box';
import Text from './Text';
import Entypo from 'react-native-vector-icons/Entypo';
import { TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  fileName: string;
}

const FileCard = ({ title, fileName }: Props) => {
  return (
    <Box>
      <Text variant="regular">{title}</Text>
      <TouchableOpacity>
        <Box
          marginTop="xs"
          height={50}
          borderRadius={6}
          borderWidth={1}
          style={{ borderColor: '#C8D1E1' }}
          justifyContent="center"
          alignItems="center"
          flexDirection="row">
          <Text variant="regular" style={{ color: '#C8D1E1' }} marginRight="s">
            {fileName}
          </Text>
          <Entypo name="upload-to-cloud" color="#C8D1E1" size={18} />
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default FileCard;
