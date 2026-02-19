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

import { StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, RefreshControl, BackHandler, Alert, Button, Vibration, Keyboard } from 'react-native';
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



import { ListItem, Avatar, LinearProgress, Tooltip, Icon, Input, Switch } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDebounce, useDebouncedCallback, useThrottledCallback } from 'use-debounce';

import CryptoJS from 'crypto-js/sha256';
import { ReText } from 'react-native-redash';

export default function ReadingTimesBar() {

    const { sourceWordArr, setSouceWordArr, scrollRef0, scrollRef, scrollRef2, frameTransY, wordPos, isListPlaying, preLeft, preTop, scrollY, scrollX,
        isPanning, speak, autoPlay, stopSpeak, isScrollingY, isScrollingX, isCardMoving, isManualDrag, shouldHideWordBlock, isNewerstOnTop, setRefreshState,
        selectedLevelArr, smallIndex, largeIndex, enableSlice
    } = useContext(Context)

    const localWordReadingArr = useSharedValue([2, 1, 2, 1])

    const wordReading0 = useDerivedValue(() => {
        return localWordReadingArr.value[0] + ""
    }, [localWordReadingArr])

    const wordReading1 = useDerivedValue(() => {
        return localWordReadingArr.value[1] + ""
    }, [localWordReadingArr])

    const wordReading2 = useDerivedValue(() => {
        return localWordReadingArr.value[2] + ""
    }, [localWordReadingArr])

    const wordReading3 = useDerivedValue(() => {
        return localWordReadingArr.value[3] + ""
    }, [localWordReadingArr])





    return (
        <View style={useAnimatedStyle(() => {


            return {
                width: screenWidth,
                height: 80,
                backgroundColor: "#e7cca0",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
            }


        })}>

            <View style={useAnimatedStyle(() => {


                return {
                    width: 60,
                    height: 60,
                    backgroundColor: "pink",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }


            })}>


                <ReText editable={false} text={wordReading0} fontSize={25} style={{ fontWeight: 400, }} color="#a75d09" />

                <GestureDetector gesture={Gesture.Tap().onStart((e) => {
                    localWordReadingArr.modify(arr=>{

                      return  arr.map((value,index)=>{
                            if(index==0){
                                return  (value+1)%4
                            }
                            else{
                                return value
                            }
                        })

                    })
                })}>
                    <View style={{ backgroundColor: "rgba(123,111,123,0.5)", width: 60, height: 60, position: "absolute" }}></View>
                </GestureDetector>

            </View>


               <View style={useAnimatedStyle(() => {


                return {
                    width: 60,
                    height: 60,
                    backgroundColor: "pink",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }


            })}>
                <ReText editable={false} text={wordReading1} fontSize={20} style={{ fontWeight: 400 }} color="#a75d09" onPressIn={(e) => {
                    console.log("fewfsd")
                }} />
            </View>

               <View style={useAnimatedStyle(() => {


                return {
                    width: 60,
                    height: 60,
                    backgroundColor: "pink",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }


            })}>
                <ReText editable={false} text={wordReading2} fontSize={20} style={{ fontWeight: 400 }} color="#a75d09" />
            </View>

               <View style={useAnimatedStyle(() => {


                return {
                    width: 60,
                    height: 60,
                    backgroundColor: "pink",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }


            })}>
                <ReText editable={false} text={wordReading3} fontSize={20} style={{ fontWeight: 400 }} color="#a75d09" />
            </View>

     <View style={useAnimatedStyle(() => {


                return {
                    width: 60,
                    height: 60,
                    backgroundColor: "pink",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }


            })}>
            <Switch
                //thumbColor={"green"}
                color='orange'

                style={{
                    height: 40, width: 80,// backgroundColor: "rgba(122,114,225,0.3)",
                    backgroundColor: "rgba(122,114,225,0)",
                    right: 10,
                    transform: [{ scale: 1.5 }, { translateY: 0 },{translateX:-8}]
                }}
                value={true}
            />
            </View>
        </View>


    )

}

