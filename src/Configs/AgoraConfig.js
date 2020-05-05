import { NativeModules } from 'react-native';

const { Agora } = NativeModules;

const {
  FPS30,
  AudioProfileDefault,
  AudioScenarioDefault,
  Adaptative,
} = Agora;  

const AgoraConfig = {
  appid: '0c42f9a736ba4afca753b48061ca30cf',
  channelProfile: 0,
  videoEncoderConfig: {
    width: 720,
    height: 1080,
    bitrate: 1,
    frameRate: FPS30,
    orientationMode: Adaptative,
  },
  audioProfile: AudioProfileDefault,
  audioScenario: AudioScenarioDefault,
};

export default AgoraConfig;