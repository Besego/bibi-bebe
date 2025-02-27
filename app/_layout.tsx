import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useFonts } from 'expo-font';
import { DatabaseProvider } from '~/context/dbProvider';

const LIGHT_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [loaded, error] = useFonts({
    'JetBrains': require('../assets/fonts/JetBrainsMonoNL-Regular.ttf'),
  });
  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    });
  }, [loaded, error]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    // <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
    //   <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
    <DatabaseProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(protected)" />
        {/* <Stack.Screen name="(public)" /> */}
      </Stack>
    </DatabaseProvider>
    //   <PortalHost />
    // </ThemeProvider>
  );
}
