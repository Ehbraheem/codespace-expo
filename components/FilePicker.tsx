import React from 'react';
import Box from './Box';
import Text from './Text';
import Entypo from 'react-native-vector-icons/Entypo';
import { TouchableOpacity } from 'react-native';
import DocumentPicker, {
  types,
  DocumentPickerResponse,
} from 'react-native-document-picker';

interface Props {
  label?: string;
  uploadText?: string;
  color?: string;
  multiple?: boolean;
  type?: string | string[];
  file: DocumentPickerResponse[];
  onSelect: (file: DocumentPickerResponse[]) => void;
}

const FilePicker = ({
  label,
  uploadText,
  color,
  multiple = false,
  type,
  file,
  onSelect,
}: Props) => {
  const pick = async () => {
    try {
      const result = await DocumentPicker.pick({
        allowMultiSelection: multiple,
        type: type || types.allFiles,
      });
      if (result) {
        onSelect(result);
      }
    } catch (error) {
      console.log(error);
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
            {file.length > 0
              ? 'File(s) Selected'
              : uploadText || 'Select file(s)'}
          </Text>
          <Entypo name="upload-to-cloud" color={color || '#C8D1E1'} size={18} />
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default FilePicker;
