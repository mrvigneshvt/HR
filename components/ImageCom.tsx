import { View } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import ProfileScreen from '../app/(tabs)/profile';
import { verticalScale, scale } from 'react-native-size-matters';
import { configFile } from 'config';

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
        <View
          style={{
            height: verticalScale(200),
            width: verticalScale(200), // keep width same as height for a perfect circle
            borderRadius: verticalScale(100), // half of height/width
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: configFile.colorGreen, // optional background
            borderColor: 'black',
          }}>
          <Image
            source={img || defaultImage}
            contentFit="cover"
            style={{ height: '100%', width: '100%' }}
          />
        </View>

        {/* <Image
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
        /> */}
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
