import { View } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import ProfileScreen from '../app/(tabs)/profile';

const defaultImage = require('../assets/profile.png');
const plusImage = require('../assets/plus.png');

type Props = {
  ProfileScreen?: boolean;
  img?: ImageSource | string;
};

const ImageCom = ({ img, ProfileScreen }: Props) => {
  if (ProfileScreen) {
    return (
      <>
        <Image
          source={defaultImage}
          contentFit="contain"
          style={{ height: 200, width: 200, borderRadius: 2 }}
        />
        <Image
          source={plusImage}
          contentFit="contain"
          style={{
            height: 25,
            width: 25,
            borderRadius: 8,
            top: -25,
            left: 49,
            backgroundColor: 'white',
            padding: 2,
          }}
        />
      </>
    );
  }
  return (
    <>
      <Image
        className="h-[220px] w-[220px] rounded"
        source={img}
        transition={1000}
        contentFit="contain"
      />
    </>
  );
};

export default ImageCom;
