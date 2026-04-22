import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-green-600">
        Tailwind kuruldu! ✅
      </Text>
      <Text className="text-base text-gray-500 mt-2">
        NativeWind çalışıyor
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
