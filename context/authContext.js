import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from "react-native-toast-message";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();
  const [access_token, setAccessToken] = useState(null);
  const currentPathname = useNavigationState((state) => {
    return state.routes[state.index] ? state.routes[state.index].name : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const refresh_token = await getLocalUser();
        if (refresh_token) {
          const response = await axios.post("https://eventsapi-umam.onrender.com/api/refresh_token", { refresh_token });
          setUserInfo(response.data.user)
          router.push("/(client)");
          setAccessToken(response.data.access_token)
          console.log(response.data.access_token)
          Toast.show({
            type: 'success',
            text1: 'Sign In',
            text2: 'Sing in successfully'
          });
          AsyncStorage.setItem("refresh_token", response.data.refresh_token);
          setIsLoading(false);
        } else {
          router.push("/");
          setIsLoading(false);
        }
      } catch (error) {
        router.push("/");
        setIsLoading(false);
      }
    };
    fetchUser();

  }, [])

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("refresh_token");
    if (!data) return null;
    return data;
  };

  const getUserInfo = async ({ userName, password }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://eventsapi-umam.onrender.com/api/auth", { userName, password }
      );
      const user = response.data;
      setUserInfo(user.user)
      setAccessToken(user.access_token);
      router.push("/(client)");
      AsyncStorage.setItem("refresh_token", user.refresh_token);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Errour occured, cut the app come again !'
      });
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("refresh_token");
      setUserInfo(null);
      router.push("/(auth)");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, setIsLoading, handleLogout, userInfo, setUserInfo, getUserInfo, access_token, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
