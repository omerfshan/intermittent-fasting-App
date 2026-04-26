import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: Record<string, { title: string; icon: IoniconName; iconActive: IoniconName }> = {
  index:      { title: 'Oruç',      icon: 'home-outline',      iconActive: 'home' },
  Statistics: { title: 'İstatistik', icon: 'bar-chart-outline',  iconActive: 'bar-chart' },
  History:    { title: 'Geçmiş',    icon: 'calendar-outline',   iconActive: 'calendar' },
  Profile:    { title: 'Profil',    icon: 'person-outline',     iconActive: 'person' },
};

const DOT_COLOR = '#E8845A';

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7} style={styles.tab}>
            <Ionicons
              name={isFocused ? config.iconActive : config.icon}
              size={24}
              color={isFocused ? '#1A1A1A' : '#AAAAAA'}
            />
            <Text style={[styles.label, {
              color: isFocused ? '#1A1A1A' : '#AAAAAA',
              fontWeight: isFocused ? '700' : '500',
            }]}>
              {config.title}
            </Text>
            {isFocused && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="Statistics" />
      <Tabs.Screen name="History" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 12,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: DOT_COLOR,
    marginTop: 1,
  },
});
