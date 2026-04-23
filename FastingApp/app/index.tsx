import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F5F2EE]">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-[#1A1A1A] mb-2">FastingApp</Text>
        <Text className="text-sm text-gray-500 mb-12">Aralıklı oruç takip uygulaması</Text>

        <TouchableOpacity
          onPress={() => router.push('/(onboarding)/plan-select')}
          activeOpacity={0.9}
          className="bg-[#1A1A1A] rounded-2xl py-4 px-10 flex-row items-center"
        >
          <Text className="text-white text-base font-semibold mr-2">Plan Seç</Text>
          <Text className="text-white text-base">→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
