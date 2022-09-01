import React, { useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import MovieScreen from './src/screens/MovieScreen';
import DefaultPage from './src/components/DefaultPage/DefaultPage';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Colors from './src/constants/Colors';
import Fonts from './src/constants/Fonts';
import LANGUAGES from './src/constants/Languages';
import Ionicons from '@expo/vector-icons/Ionicons';
import Search from './src/screens/Search';
import VideoPlayer from './src/screens/VideoPlayer';
import WatchList from './src/screens/WatchList/WatchList';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainStackNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
    // screenOptions={{
    //   headerStyle: {
    //     backgroundColor: Colors.YELLOW,
    //   },
    //   headerTintColor: Colors.WHITE,
    //   headerTitleAlign: 'center',
    //   cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    // }}
    >
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="movie"
        component={MovieScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />

      <Stack.Screen
        name="movieShow"
        component={DefaultPage}
        options={({ navigation, route }) => ({
          headerTitle: route.params.title,
          headerStyle: {
            backgroundColor: Colors.BLACK,
          },
          headerTintColor: Colors.WHITE,
          headerTitleAlign: 'center',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        })}
      />

      <Stack.Screen
        name="search"
        component={Search}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="video"
        component={VideoPlayer}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default () => {
  const [fontLoaded] = useFonts({
    Regular: require('./assets/fonts/NunitoSans-Regular.ttf'),
    Bold: require('./assets/fonts/NunitoSans-Bold.ttf'),
    Black: require('./assets/fonts/NunitoSans-Black.ttf'),
    ExtraBold: require('./assets/fonts/NunitoSans-ExtraBold.ttf'),
    ExtraLight: require('./assets/fonts/NunitoSans-ExtraLight.ttf'),
    Light: require('./assets/fonts/NunitoSans-Light.ttf'),
    SemiBold: require('./assets/fonts/NunitoSans-SemiBold.ttf'),
  });

  return fontLoaded ? (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Setting') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Search') {
              iconName = 'search';
            } else if (route.name === 'WatchList') {
              iconName = 'add';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={20} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: Colors.ACTIVE,
          tabBarInactiveTintColor: Colors.GRAY,
          //Tab bar styles can be added here

          tabBarLabelStyle: {
            paddingBottom: 10,
            fontSize: 14,
            fontFamily: Fonts.BOLD,
          },
          tabBarHideOnKeyboard: true,
          tabBarStyle: [
            {
              borderWidth: 0.5,
              paddingVertical: 5,
              borderTopColor: Colors.GRAY,
              backgroundColor: Colors.BLACK,
              height: 60,
            },
          ],
        })}
      >
        <Tab.Screen name="Home" component={MainStackNavigator} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Setting" component={Search} />
        <Tab.Screen
          name="WatchList"
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              if (route.state && route.state.routeNames.length > 0) {
                navigation.navigate('Device');
              }
            },
          })}
          component={WatchList}
        />
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
    <AppLoading />
  );
};

const styles = StyleSheet.create({});
