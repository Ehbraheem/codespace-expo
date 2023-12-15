import React from 'react';
import Box from './Box';
import Text from './Text';
import Entypo from 'react-native-vector-icons/Entypo';
import { TouchableOpacity } from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

interface Props {
  label?: string;
  uploadText?: string;
  color?: string;
  // multiple?: boolean;
  // type?: string | string[];
  file: ImagePickerResponse;
  onSelect: (file: ImagePickerResponse) => void;
}

const ImagePicker = ({
  label,
  uploadText,
  color,
  // multiple = false,
  // type,
  file,
  onSelect,
}: Props) => {
  const pick = async () => {
    try {
      // setThumb({});
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });
      if (result) {
        onSelect(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      {label && (
        <Text variant="regular" style={{ color: color }}>
          {label}
        </Text>
      )}
      <TouchableOpacity onPress={() => pick()}>
        <Box
          marginTop="xs"
          height={50}
          borderRadius={6}
          borderWidth={1}
          style={{ borderColor: color || '#C8D1E1' }}
          justifyContent="center"
          alignItems="center"
          flexDirection="row">
          <Text
            variant="regular"
            style={{ color: color || '#C8D1E1' }}
            marginRight="s">
            {file?.assets ? 'Image Selected' : uploadText || 'Select image'}
          </Text>
          <Entypo name="upload-to-cloud" color={color || '#C8D1E1'} size={18} />
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default ImagePicker;
