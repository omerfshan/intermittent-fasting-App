import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../Theme/colors';

export default function StatisticsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.inkPrimary }}>İstatistik</Text>
    </SafeAreaView>
  );
}
