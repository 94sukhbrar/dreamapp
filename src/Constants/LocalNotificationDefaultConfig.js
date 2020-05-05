import Colors from './Colors';

const localNotificationDefaultConfig = {
  largeIcon: 'ic_launcher',
  color: Colors.tintColor,
  autoCancel: true,
  vibrate: true,
  priority: 'max',
  importance: 'max',
  allowWhileIdle: true,
  ignoreInForeground: false,
  title: 'Dream',
  playSound: true,
  soundName: 'default',
};

export default localNotificationDefaultConfig;