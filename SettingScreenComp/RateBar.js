import React, { memo, useCallback, useMemo, useTransition } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, useContext } from 'react';
import * as Device from 'expo-device';

import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import SwipeableItem, {
    useSwipeableItemParams,
    OpenDirection,
} from "react-native-swipeable-item";
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, RefreshControl, BackHandler, Alert, Button, Vibration } from 'react-native';
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height
import superagent, { PATCH, source } from "superagent"
//import * as FileSystem from 'expo-file-system';
import { Directory, File, Paths } from "expo-file-system";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    TapGestureHandler
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
    useAnimatedRef,
    useDerivedValue,
    SlideInRight,
    interpolate,
    withRepeat,


} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FadeIn, FadeOut, BounceIn, BounceOut, SlideOutUp } from 'react-native-reanimated';
import { runOnJS, runOnUI, scheduleOnRN, scheduleOnUI } from "react-native-worklets"
const { View, Text, ScrollView, FlatList } = ReAnimated

import { Context } from '../ContextProvider';


import { Audio } from 'expo-av';
import { useAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

import startPromiseSequential from 'promise-sequential';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native';
const headHeight = getStatusBarHeight() > 24 ? 80 : 60



import { ListItem, Avatar, LinearProgress, Tooltip, Icon, Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDebounce, useDebouncedCallback, useThrottledCallback } from 'use-debounce';

import CryptoJS from 'crypto-js/sha256';
import { ReText } from 'react-native-redash';


export default function RateBar({ levelArr }) { //!!! Make sure the Card.js render first, then render this component!!!

    const { setSouceWordArr, saveWordToFile, sourceWordArr, refreshState, setRefreshState, wordPos, scrollX, scrollRef0, selectedLevelArr, isNewerstOnTop } = useContext(Context)

    // console.log("",selectedLevelArr.value)



    useDerivedValue(() => {

        //   console.log(levelArr.value)

    }, [levelArr])



    return (



        <View style={useAnimatedStyle(() => {

            return {
                backgroundColor: "transparent",// isDownloaded.value ? "wheat" : "#e7cca0",
                width: screenWidth, height: headHeight, flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "flex-end",
                padding: 0, margin: 0, paddingHorizontal: 0, marginHorizontal: 0,
                paddingBottom: 4,

            }
        })}>

            {[0, 1, 2, 3, 4, 5].map((levelIndex, index) => {


                return <GestureDetector key={index} gesture={Gesture.Tap().onStart(e => {

                    //   console.log("pressed", index)
                    levelArr.modify(arr => {
                        arr[index] = !arr[index]
                        return arr
                    })
                    // scheduleOnRN(filterLevel)
                })} >
                    <View style={

                        [useAnimatedStyle(() => {
                            return {
                                width: 40, height: 40, borderRadius: 999, borderColor: "orange", flexDirection: "row",
                                borderWidth: 1, justifyContent: "center", alignItems: "center",


                                backgroundColor: levelArr.value[index]
                                    ? "orange"
                                    : "transparent",

                                padding: 0, margin: 0, paddingHorizontal: 0, marginHorizontal: 0
                            }
                        })]
                    }>

                        <Text style={[
                            useAnimatedStyle(() => {


                                return { color: levelArr.value[index] ? "wheat" : "orange", fontSize: 15, fontWeight: "900" }
                            }),
                        ]}>{levelIndex}</Text>

                    </View>

                </GestureDetector>
            })

            }



        </View >

    )
}
