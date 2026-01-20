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
//import CryptoJS from 'crypto-js/sha256';
import * as MediaLibrary from 'expo-media-library';
import startPromiseSequential from 'promise-sequential';


import ContextProvider, { Context } from './ContextProvider';
import StackNavigator from './StackNavigator';

export default function App() {


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



