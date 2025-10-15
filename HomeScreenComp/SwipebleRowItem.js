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
import superagent, { source } from "superagent"
//import * as FileSystem from 'expo-file-system';
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

    useAnimatedRef,
    useDerivedValue,
    SlideInRight,
    interpolate,
    withRepeat,


} from 'react-native-reanimated';
import { runOnJS, runOnUI, scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FadeIn, FadeOut, BounceIn, BounceOut, SlideOutUp } from 'react-native-reanimated';
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
// var sign = CryptoJS("hellofff").toString();
// console.log(">>>>>>>", sign)
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
    textStyle: { width: 100, height: 80, backgroundColor: 'purple' },
    separator: {
        width: '100%',
        borderBottomWidth: 0,
    },
    swipeable: {

        height: 80,

        alignItems: 'center',
        borderWidth: 0,
        justifyContent: "center"
    },
});


function RightAction({ progress, drag, panel, sourceWord, index, visiblePanel, ...props }) {



    const { autoPlay, isListPlaying, vibrate, deleteDownloadWord, setRefreshState, frameTransY } = useContext(Context)
    const styleAnimation = useAnimatedStyle(() => {
        return {
            width: 80,
            height: 80,
            backgroundColor: "rgba(168, 155, 147, 1)",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            transform: [{ translateX: interpolate((drag.value), [0, -80], [80, 0], "clamp") }]
        };
    });
    const iconContainnerStyle = useAnimatedStyle(() => {

        return {
            width: 80,
            height: 80,
            //backgroundColor: "wheat",
            backgroundColor: frameTransY.value >= 160 ? "#D6BD95" : "#e7cca0",

            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#D2B48C",
        }

    })


    const navigator = useNavigation()
    function goSentenceSetting() {
        navigator.navigate("SentenceSettingScreen", { wordPos: index })
    }


    return (


        <View style={styleAnimation}>


            <GestureDetector gesture={Gesture.Tap()
                .onStart(() => {

                
                    scheduleOnRN(goSentenceSetting)
                    panel?.close()
                })
                .onEnd(() => { })
            }>





                <View style={[iconContainnerStyle]}>
                    <Icon
                        name="settings" type='ionicon' color='orange'
                        containerStyle={{
                            width: 80, height: 80,
                            transform: [{ rotateZ: "0deg" }], alignItems: "center", justifyContent: "center"
                        }}
                        size={50}

                    />
                </View>
            </GestureDetector>




        </View>



    );
}

function LeftAction({ progress, drag, panel, sourceWord, index, visiblePanel, ...props }) {



    const { autoPlay, isListPlaying, frameTransY, setSource, sourceWordArr, setSouceWordArr, saveWordToFile } = useContext(Context)
    const styleAnimation = useAnimatedStyle(() => {

        return {
            width: screenWidth,
            width: 80,
            height: 80,
            backgroundColor: "rgba(168, 155, 147, 1)",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",

            transform: [{ translateX: interpolate((drag.value), [0, 80], [-80, 0], "extend") }]
        };
    });






    const iconContainnerStyle = useAnimatedStyle(() => {

        return {
            width: 80,
            height: 80,
            //backgroundColor: "wheat",
            backgroundColor: frameTransY.value >= 160 ? "#D6BD95" : "#e7cca0",


            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#D2B48C",
        }

    })


    function topTime() {
        setSouceWordArr(arr => {
            const arr_ = arr.map((item) => {
                if (item.wordName !== sourceWord.wordName) {
                    return item
                }
                else {
                    return { ...item, toppingTime: Date.now() }
                }
            })
            arr_.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })
            return [...arr_]
        })

        setTimeout(() => {
            saveWordToFile()
        }, 0);
    }



    return (
        <View style={styleAnimation}>


            <GestureDetector gesture={Gesture.Tap().onStart(() => {
                //console.log(panel)
            }).onEnd(() => {
                //runOnJS(showTime)(sourceWord.toppingTime)
                scheduleOnRN(topTime)
                panel?.close()
            })}>

                <View style={[iconContainnerStyle]}>
                    <Icon
                        name="arrow-up-circle-outline" type='ionicon' color='orange'
                        containerStyle={{
                            width: 80, height: 80,
                            transform: [{ rotateZ: "0deg" }], alignItems: "center", justifyContent: "center"
                        }}
                        size={50}

                    />
                </View>
            </GestureDetector>




        </View>
    );
}





export default function SwipebleRowItem(props) {



    const { index, type, frameTransY, visiblePanel } = props

    const { sourceWordArr, scrollRef, isListPlaying, sharedStatus, } = useContext(Context)
    const sourceWord = sourceWordArr[index]


    const panelRef = useRef()



    useEffect(() => {

        if (!visiblePanel.current.includes(index)) {
            // panelRef.current.close()
            panelRef.current.reset()

        }
    }, [visiblePanel.current])



    return <>
        {/* <GestureHandlerRootView> */}
        <ReanimatedSwipeable
            containerStyle={styles.swipeable}
            friction={2}
            // enableTrackpadTwoFingerGesture
            leftThreshold={20}
            rightThreshold={20}
            renderRightActions={

                function (...props) {
                    return <RightAction progress={props[0]} drag={props[1]} panel={props[2]} sourceWord={sourceWord} index={index} visiblePanel={visiblePanel} />

                }

            }
            renderLeftActions={
                function (...props) {
                    return <LeftAction progress={props[0]} drag={props[1]} panel={props[2]} sourceWord={sourceWord} index={index} visiblePanel={visiblePanel} />

                }
            }
            onSwipeableWillOpen={() => {
                // function endAutoPlay() { 'worklet'; isListPlaying.value = false }
                // isListPlaying.value && function () { runOnUI(endAutoPlay)() }()
            }}
            onSwipeableOpen={(direction) => {
                // console.log(panelRef.current)

                setTimeout(() => {
                    panelRef.current?.close()
                }, 3000);

            }}
            ref={panelRef}
        >
            <PanelItem sourceWord={sourceWord} index={index} visiblePanel={visiblePanel} panelRef={panelRef} />
        </ReanimatedSwipeable >
        {/* </GestureHandlerRootView> */}
    </>
}


export function PanelItem({ sourceWord, index, visiblePanel, panelRef, ...props }) {



    const { sourceWordArr, scrollRef2, wordPos, frameTransY, shouldFrameDisplay, isListPlaying,
        audioPlayer,
        speak, autoPlay, stopSpeak,
        downloadWord, deleteDownloadWord, isScrollingX, isScrollingY, scrollY,

        refreshState, setRefreshState, isManualDrag
    } = useContext(Context)



    function scrollRef2Scroll0() { // may causing frameTransY pause when card has heavy load in expoPlay

        setTimeout(() => {
            scrollRef2.current._scrollViewRef.scrollTo({ x: index * screenWidth, animated: false })
            setTimeout(() => {
                isManualDrag.value = false
                isScrollingX.value = false
            }, 100);
        }, 0);

    }



    function scrollRef2Scroll() {
        scrollRef2.current._scrollViewRef.scrollTo({
            x: Math.max(1, index * screenWidth - 1),
            animated: false
        })
        setTimeout(() => {
            scrollRef2.current._scrollViewRef.scrollTo({ x: index * screenWidth, animated: true })
        }, 100);
    }






    const singleTap = Gesture.Tap()

        .onStart(e => {


            if (!isListPlaying.value) {
                wordPos.value = index
                scheduleOnRN(speak, sourceWord.wordName, sourceWord.wordName)

                scheduleOnRN(scrollRef2Scroll)
            }




        })
        .maxDuration(250)
        .numberOfTaps(1)
        .onEnd(e => {
            //    console.log(index, 'Single tap!',);



        })


    const delayStopSpeak = () => {
        isListPlaying.value = false
        stopSpeak()
    }

    const doubleTap = Gesture.Tap()
        .onStart(e => {



        })

        .maxDuration(250)
        .numberOfTaps(2)
        .onTouchesUp(e => {



        })
        .onEnd(e => {

            if (e.absoluteX <= 100) {

                if (!isListPlaying.value) {
                    isListPlaying.value = true
                    scheduleOnRN(autoPlay);
                    const y = Math.min(screenHeight - (headHeight + 80), Math.max(160, screenHeight - e.absoluteY - (- e.y)))


                    if (frameTransY.value === 0) {
                        frameTransY.value = withTiming(y, { duration: 200 }, function () {
                            if (Math.abs(frameTransY.value - (screenHeight - (headHeight + 80))) < 20) {
                                frameTransY.value = screenHeight - headHeight - 80
                            }

                        })
                    }


                    return
                }
                else {
                    //frameTransY.value = withTiming(0, { duration: 200 })
                    scheduleOnRN(delayStopSpeak)
                    return
                }
            }



            const y = Math.min(screenHeight - (headHeight + 80), Math.max(160, screenHeight - e.absoluteY - (- e.y)))


            if (frameTransY.value === 0) {

                frameTransY.value = withTiming(y, { duration: 200 }, function () {
                    if (Math.abs(frameTransY.value - (screenHeight - (headHeight + 80))) < 20) {
                        frameTransY.value = screenHeight - headHeight - 80
                    }

                })
            }
            else {
                frameTransY.value = withTiming(0, { duration: 200 })
            }

        })







    const downloadStatus = useSharedValue(false)



    useEffect(() => {
        //console.log(refreshState)
        const hashName = CryptoJS(sourceWord.wordName).toString();
        downloadStatus.value = new File(Paths.document, `${hashName + hashName}.mp3`).exists


    }, [visiblePanel.current, refreshState])







    const longPress = Gesture.LongPress()

        .onStart(e => {
            if (!downloadStatus.value) {
                scheduleOnRN(downloadWord, sourceWord.wordName, sourceWord.wordName)
                // console.log(sourceWord,"not downloaded")

            }
            else {
                scheduleOnRN(deleteDownloadWord, sourceWord.wordName, sourceWord.wordName)
            }

        })


    const panelStyle = useAnimatedStyle(() => {

        return {

            width: screenWidth, height: 80,
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#D2B48C",
            paddingHorizontal: 4,
            paddingBottom: 0,
            backgroundColor: frameTransY.value >= 160
                ? downloadStatus.value
                    ? "#f0d095" //"#e7d0a6" //? "#fcd19dff"
                    : "#D6BD95"
                : downloadStatus.value
                    ? "wheat"
                    : "#e7cca0",


            // backgroundColor: isDownloaded.value ? "wheat" : "rgba(214, 189, 149, 0.5)",// "#D6BD95",
        }
    })
















    const focusedPanelStyle = useAnimatedStyle(() => {
        return {
            position: "absolute",
            top: 0,
            left: 0,
            opacity: wordPos.value === index ? 1 : 0,
        }
    })




    const textWordStyle = useAnimatedStyle(() => {

        return {
            //fontSize: frameTransY.value === screenHeight - headHeight - 80 ? 45 : 25,
            fontSize: 27,
            color: "#a75d09",

        }

    })

    const textMeaningStyle = useAnimatedStyle(() => {

        return {
            fontSize: 17,
            color: "#555",
            //opacity: frameTransY.value === screenHeight - headHeight - 80 ? 0 : 1
        }
    })



    return (
        <>




            <GestureDetector gesture={Gesture.Simultaneous(
                doubleTap,
                singleTap,
                longPress
            )}>

                <View style={[panelStyle]} >

                    <View style={[focusedPanelStyle]}>
                        <LinearGradient
                            colors={["rgba(255, 179, 80, 0)", 'rgba(255, 179, 80, 0.8)', 'rgba(255, 155, 133, 1)',]}
                            dither={true}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            locations={[0 / screenWidth, 120 / screenWidth, 0.95]}
                            //Example:
                            // colors={[red', 'green']}
                            // locations={[0.3,0.4]}  // full red 30% of width   //mixed red-and-green (40% - 30% = 10%) of width     // full green  100% - 40% = 60% of width
                            //                        // ______red = 30%______   ___mixed = 10%___   _________green = 60%__________________
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 80,
                                width: screenWidth,
                                //     transform:[{translateX:10}]
                            }}
                        />
                    </View>



                    <Text numberOfLines={1} ellipsizeMode={"tail"} style={textWordStyle} >
                        {sourceWord.wordName + "\n"}
                    </Text>

                    <Text ellipsizeMode={"tail"} style={{ position: "absolute", right: 0, fontSize: 15, transform: [{ translateY: 8 }], color: "#555" }}>
                        {index + " "}
                    </Text>

                    <Text numberOfLines={1} ellipsizeMode={"tail"} style={textMeaningStyle} >
                        {sourceWord.meaning}
                    </Text>
                </View >
            </GestureDetector >







        </>)


}


