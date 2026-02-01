import React, { createContext, memo, useCallback, useMemo, useTransition } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, useContext } from 'react';
import * as Device from 'expo-device';
import ContextProvider from './ContextProvider';
import { RecyclerListView, DataProvider, LayoutProvider, } from "recyclerlistview";
import SwipeableItem, {
    useSwipeableItemParams,
    OpenDirection,
} from "react-native-swipeable-item";
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';

import { StyleSheet, Button, Dimensions, TouchableOpacity, SafeAreaView, RefreshControl, Alert } from 'react-native';
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height
import superagent, { source } from "superagent"
import * as FileSystem from 'expo-file-system/legacy';
import { File, Directory, Paths } from 'expo-file-system';

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
    runOnJS,
    useAnimatedRef,
    useDerivedValue,
    SlideInRight,
    interpolate,
    withRepeat,
    interpolateColor,
    FlipOutEasyX,


} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FadeIn, FadeOut, BounceIn, BounceOut, SlideOutUp, FlipInEasyX } from 'react-native-reanimated';
const { View, Text, ScrollView, FlatList } = ReAnimated

import { Context } from './ContextProvider';
import { LinearGradient } from 'expo-linear-gradient';

import { Audio } from 'expo-av';
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import startPromiseSequential from 'promise-sequential';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native';
const headHeight = 80;// getStatusBarHeight() > 24 ? 80 : 60



import { ListItem, Avatar, LinearProgress, Tooltip, Icon, Input, Switch } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDebounce, useDebouncedCallback, useThrottledCallback } from 'use-debounce';

import * as Speech from 'expo-speech';



import SwipebleRowItem from "./HomeScreenComp/SwipebleRowItem"
import Card from './HomeScreenComp/Card';
import ScrollPivot from './HomeScreenComp/ScrollPivot';
import CryptoJS from 'crypto-js/sha256';

import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';

import { BackHandler } from 'react-native';

//import { DragblePannel, HeadPannel, EditorCard } from './SentenceSettingScreenComp/DragblePannel';
//import { DragblePannel } from "./SentenceSettingScreenComp/DragblePannel"
import { DragblePannel, HeadPannel, EditorCard } from './SentenceSettingScreenComp/DragblePannel';
import { scheduleOnRN } from 'react-native-worklets';







export default function SettingScreen() {
    const { setSouceWordArr, saveWordToFile, sourceWordArr, refreshState, setRefreshState, wordPos, scrollX, scrollRef0,
        scrollRef, scrollRef2, preTop,


        selectedLevelArr, isNewerstOnTop } = useContext(Context)



    const file = new File(Paths.document, "allwords.txt")
    const allWords = JSON.parse(file.textSync())

    const navigation = useNavigation()
    function filterLevel() {
        setSouceWordArr(arr => {


            const newArr = allWords.filter((word, index) => {
                // console.log(word.level, index, selectedLevelArr.value[word.level])
                return selectedLevelArr.value[word.level] === true


            })
            if (isNewerstOnTop.value) {
                newArr.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })
            }
            else {
                newArr.sort((word1, word2) => { return word1.toppingTime - word2.toppingTime })
            }


            if (arr.length !== newArr.length) {
                wordPos.value = 0
                scrollRef.current._scrollViewRef.scrollTo({ y: 0, animated: true })
                scrollRef2.current._scrollViewRef.scrollTo({ x: 0, animated: true })
                preTop.value = headHeight
            }

          
            return newArr
        })
    }



    useEffect(() => {

        //navigation.removeListener("focus")

        let backHandler;
        const unsubscribe = navigation.addListener('focus', () => {

            backHandler = BackHandler.addEventListener('hardwareBackPress', function () {

                console.log("aastttt", "isNewestOnTop", isNewerstOnTop.value)
                setTimeout(() => {
                    filterLevel()
                }, 0);


                return false; // Allows the default back action 
            });
        });
        return function () { unsubscribe(); backHandler?.remove(); }

    }, []);



    const settingPanelStyle = useAnimatedStyle(() => {

        return {

            backgroundColor: "wheat",//"#c3e1a2",

            height: screenHeight,
            width: screenWidth,


            overflow: "hidden",

            top: 0,// headBarHeight,

        }

    })

    const [checked, setChecked] = useState(isNewerstOnTop.value)





    return (

        <>
            <View style={[settingPanelStyle]}>

                <RateBar />

                <Switch
                    //thumbColor={"green"}
                    color='orange'

                    style={{
                        height: 40, width: 80, backgroundColor: "rgba(122,114,225,0.3)",
                        transform: [{ scale: 1.5 }]
                    }}
                    value={checked}
                    onValueChange={(value) => {
                        setChecked(value)
                        isNewerstOnTop.value = value

                    }}
                />
            </View>



        </>

    )
}


function RateBar() { //!!! Make sure the Card.js render first, then render this component!!!

    const { setSouceWordArr, saveWordToFile, sourceWordArr, refreshState, setRefreshState, wordPos, scrollX, scrollRef0, selectedLevelArr, isNewerstOnTop } = useContext(Context)

    console.log(selectedLevelArr.value)







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

                    console.log(index)
                    selectedLevelArr.modify(arr => {
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


                                backgroundColor: selectedLevelArr.value[index]
                                    ? "orange"
                                    : "transparent",

                                padding: 0, margin: 0, paddingHorizontal: 0, marginHorizontal: 0
                            }
                        })]
                    }>

                        <Text style={[
                            useAnimatedStyle(() => {


                                return { color: selectedLevelArr.value[index] ? "wheat" : "orange", fontSize: 15, fontWeight: "900" }
                            }),
                        ]}>{levelIndex}</Text>

                    </View>

                </GestureDetector>
            })

            }



        </View >

    )
}
