import Header from "@/components/events/Headers";
import { AuthProvider } from "@/context/authContext";
import { EventProvider } from "@/context/eventContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <EventProvider>
          <ThemeProvider value={DefaultTheme}>
            <SafeAreaView
              style={styles.container}
              edges={["top", "bottom", "left", "right"]}
            >
              <Header />
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(client)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="event/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="admin/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
            </SafeAreaView>
            <StatusBar style="auto" />
          </ThemeProvider>
        </EventProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
