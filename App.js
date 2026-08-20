import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
//import ContextProvider from './ContextProvider';


import { NavigationContainer } from '@react-navigation/native';
//import StackNavigator from './StackNavigator';

import { StyleSheet, Button, Dimensions, SafeAreaView, Alert, BackHandler } from 'react-native';
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height
import superagent, { source } from "superagent"

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'; //npx expo install react-native-gesture-handler

import ReAnimated, {
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  useAnimatedStyle,
  Easing,
  LinearTransition,
  JumpingTransition,
  CurvedTransition,
  ZoomIn,
  // runOnJS


} from 'react-native-reanimated';

import { runOnJS, scheduleOnRN } from "react-native-worklets"

import { FadeIn, FadeOut, BounceIn, BounceOut, SlideOutUp } from 'react-native-reanimated';
const { View, Text, ScrollView } = ReAnimated


import { File, Directory, Paths } from 'expo-file-system';
import { Audio } from 'expo-av';
import CryptoJS from 'crypto-js/sha256';
import * as MediaLibrary from 'expo-media-library';
import startPromiseSequential from 'promise-sequential';


import ContextProvider, { Context } from './ContextProvider';
import StackNavigator from './StackNavigator';

export default function App() {

 



  const now = new Date();

  const year = now.getFullYear(); // e.g., 2026
  const month = now.getMonth() + 1; // 1-12 (getMonth() is 0-indexed)
  const date = now.getDate(); // 1-31 (day of the month)

  //console.log(`Year: ${year}, Date: ${year}-${month}-${date}`);
  console.log(`${year}-${month}-${date}`, Device.deviceName, Device.brand, Device.deviceYearClass, Device);

  // if (`${year}-${month}-${date}` === "2026-8-31") {


  if (Date.now() <= 1788998400000) {  //2026-9-10 install before, so alert will not pop out 
    const licenseFile = new File(Paths.document, "License.txt")
    licenseFile.create({ overwrite: true, intermediates: true })
    licenseFile.write(CryptoJS(Device.brand, Device.deviceName, Device.deviceYearClass).toString())
  }

  useEffect(() => {

    setTimeout(() => {

      setInterval(() => {
        console.log("checking license",new Date(now).toISOString(),Date.now())
        const licenseFile = new File(Paths.document, "License.txt")
        if (!licenseFile.exists) {
          Alert.alert("Not licensed", "press OK to quit", [{
            text: "OK", onPress: () => {
              BackHandler.exitApp()

            }
          }])
        }
        else {
          if (licenseFile.textSync() !== CryptoJS(Device.brand, Device.deviceName, Device.deviceYearClass).toString()) {
            Alert.alert("Not licensed", "press OK to quit", [{
              text: "OK", onPress: () => {
                BackHandler.exitApp()
              }
            }])

            //  
          }
        }

      }, 1 * 3000);


    }, 2000);





  }, [])



  return (

    <ContextProvider>
      <AppStart />
    </ContextProvider>

  );
}

function AppStart() {

  const { sourceWordArr } = useContext(Context)


  return (
    <>


      <NavigationContainer><StackNavigator /></NavigationContainer>

      {/* <Text>{Date.now()}</Text>
      <Button title='aaa' onPress={function () {
        console.log("aaa")
        const wordFile = new File(Paths.document, "allwords.txt")
        if (wordFile.exists) {
          wordFile.delete()
        }

      }} /> */}
    </>
  )

}



