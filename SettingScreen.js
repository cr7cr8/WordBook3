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
    withDecay,
    withSpring,
    withDelay,
    useAnimatedStyle,
    useAnimatedProps,
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
import Animated, { FadeIn, FadeOut, BounceIn, BounceOut, SlideOutUp, FlipInEasyX, createAnimatedComponent } from 'react-native-reanimated';
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

import { BackHandler, TextInput } from 'react-native';

//import { DragblePannel, HeadPannel, EditorCard } from './SentenceSettingScreenComp/DragblePannel';
//import { DragblePannel } from "./SentenceSettingScreenComp/DragblePannel"
import { DragblePannel, HeadPannel, EditorCard } from './SentenceSettingScreenComp/DragblePannel';
import { scheduleOnRN } from 'react-native-worklets';

import { ReText } from 'react-native-redash';

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        paddingHorizontal: 10,
    },
});
// const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {

//     return false; // false --> Allows the default back action 
// });
// //     });
// return function () {
//     //  console.log("leaving", Date.now(), backHandler);



//     //  unsubscribe();


//     backHandler?.remove();
// }

const AnimatedTextInput = createAnimatedComponent(TextInput);
export function SettingScreen0() {

    const animatedText = useSharedValue('Some Text');
    const translateXDot1 = useSharedValue(0)
    const dot1Style = useAnimatedStyle(() => {
        return {
            height: 40,
            width: 40,
            backgroundColor: "pink",
            transform: [{ translateX: translateXDot1.value }],
            marginTop: 0,
            display: "flex"
        }
    })

    const localvalue = useDerivedValue(() => {
        console.log(translateXDot1.value)
        return Math.round(translateXDot1.value) + "" || "aaa"
    }, [translateXDot1])



    return (
        <View style={{ marginTop: 200 }}>

            <ReText text={localvalue} style={{ color: "red", fontSize: 30 }} />
            <Button title="update" style={{ margin: 100 }} onPress={() => {
                animatedText.value = Date.now() + ""
            }} />


            <GestureDetector gesture={Gesture.Pan()
                .onStart(e => {

                })
                .onChange(e => {
                    translateXDot1.value = translateXDot1.value + e.changeX

                    //  console.log(Date.now(), translateXDot1.value)
                })
                .onEnd(e => {


                    translateXDot1.value = withDecay({
                        velocity: e.velocityX,
                        //     velocityFactor: e.velocityY <= 0 ? 2 : 2,
                        deceleration: 0.988,// e.velocityY <= 0 ? 1 : 1,
                        rubberBandEffect: true,
                        rubberBandFactor: 3,
                        clamp: [0, screenWidth - 40]
                    }, () => {

                        //  console.log(Math.round(translateXDot1.value), screenWidth)
                    })


                })
            }>
                <View style={[dot1Style]}></View>
            </GestureDetector>

        </View>

    )

}



export default function SettingScreen() {
    const { setSouceWordArr, saveWordToFile, sourceWordArr, refreshState, setRefreshState, wordPos, scrollX, scrollRef0,
        scrollRef, scrollRef2, preTop, isSaving,

        selectedLevelArr, isNewerstOnTop } = useContext(Context)

    const file = new File(Paths.document, "allwords.txt")
    const allWords = JSON.parse(file.textSync())


    console.log(ReText)
    const levelArr = useSharedValue(selectedLevelArr.value)



    function filterLevel() {

        if (JSON.stringify(selectedLevelArr.value) == JSON.stringify(levelArr.value)) { return }

        isSaving.value = true




        const newArr = allWords.filter((word, index) => {
            // console.log(word.level, index, selectedLevelArr.value[word.level])
            return levelArr.value[word.level] === true


        })
        if (isNewerstOnTop.value) {
            newArr.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })
        }
        else {
            newArr.sort((word1, word2) => { return word1.toppingTime - word2.toppingTime })
        }
        if (wordPos.value >= newArr.length) {
            wordPos.value = 0;
            scrollX.value = 0
            scrollRef.current._scrollViewRef.scrollTo({ y: 0, animated: true })
            scrollRef2.current._scrollViewRef.scrollTo({ x: 0, animated: true })
            preTop.value = headHeight
        }


        console.log(newArr.length)



        // if (arr.length !== newArr.length) {
        wordPos.value = 0
        scrollRef.current._scrollViewRef.scrollTo({ y: 0, animated: true })
        scrollRef2.current._scrollViewRef.scrollTo({ x: 0, animated: true })
        preTop.value = headHeight
        // }
        setSouceWordArr(newArr)

        selectedLevelArr.modify(arr => {
            "worklet"
            return levelArr.value
        })






        setTimeout(() => {

            //  navigation.goBack()
            isSaving.value = false
        }, 0);
    }



    useEffect(() => {


        const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            setTimeout(() => {
                filterLevel()
            }, 300);


            //return true
            return false; // false --> Allows the default back action 
        });
        //     });
        return function () {
            //  console.log("leaving", Date.now(), backHandler);



            //  unsubscribe();


            backHandler?.remove();
        }

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

    const translateXDot1 = useSharedValue(0)

    const dot1Style = useAnimatedStyle(() => {
        return {
            height: 40,
            width: 40,
            backgroundColor: "pink",
            borderRadius: 999,
            borderTopEndRadius: 0,

            transform: [{ translateX: translateXDot1.value },{translateY:-35,},{rotate:"135deg"}],
            marginTop: 0,
            display: "flex",
            opacity: 0.98,
            position: "absolute"
        }
    })






    const formattedText = useDerivedValue(() => {
        // Example: Formatting as a percentage
        "worklet"
        const val = (translateXDot1.value / screenWidth * allWords.length + "").slice(0, 4)
        console.log(screenWidth)
        return val
    });






    return (

        <>
            <View style={[settingPanelStyle]}>

                <RateBar levelArr={levelArr} />


                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 30 }}>
                    <Text style={{ fontSize: 20, color: "#a75d09", fontWeight: 500 }}>Newest on Top</Text>
                    <Switch
                        //thumbColor={"green"}
                        color='orange'

                        style={{
                            height: 40, width: 80, backgroundColor: "rgba(122,114,225,0.3)", right: 10,
                            transform: [{ scale: 1.5 }]
                        }}
                        value={checked}
                        onValueChange={(value) => {
                            setChecked(value)
                            isNewerstOnTop.value = value

                            setSouceWordArr(arr => {

                                return arr.slice(0, arr.length).reverse()

                                // return JSON.parse(JSON.stringify([...arr.reverse()]))

                            })

                        }}
                    />
                </View>

                <View style={{
                    width: screenWidth,
                    height: 80,
                    backgroundColor: "rgba(112,156,123,0.5)",
                    justifyContent: "center",
                    marginTop: 20,

                }}>

                    <View style={{ backgroundColor: "orange", width: screenWidth, height: 4 }}></View>
                    <View style={

                        useAnimatedStyle(() => {

                            return {
                                position: "absolute",
                                transform: [
                                    { translateX: translateXDot1.value },
                                    { translateY: 10, }
                                ]
                            }

                        })

                    }>

                        <ReText text={formattedText} color="#a75d09" fontSize={18} />

                    </View>

                    <GestureDetector gesture={Gesture.Pan()
                        .onStart(e => {

                        })
                        .onChange(e => {
                            translateXDot1.value = translateXDot1.value + e.changeX
                            //  console.log(Date.now(), translateXDot1.value)
                        })
                        .onEnd(e => {


                            translateXDot1.value = withDecay({
                                velocity: e.velocityX,
                                //     velocityFactor: e.velocityY <= 0 ? 2 : 2,
                                deceleration: 0.988,// e.velocityY <= 0 ? 1 : 1,
                                rubberBandEffect: true,
                                rubberBandFactor: 3,
                                clamp: [0, screenWidth - 40]
                            }, () => {

                                console.log(Math.round(translateXDot1.value), screenWidth)
                            })


                        })
                    }>
                        <View style={[dot1Style]}>



                        </View>
                    </GestureDetector>



                </View>












            </View >



        </>

    )
}


function RateBar({ levelArr }) { //!!! Make sure the Card.js render first, then render this component!!!

    const { setSouceWordArr, saveWordToFile, sourceWordArr, refreshState, setRefreshState, wordPos, scrollX, scrollRef0, selectedLevelArr, isNewerstOnTop } = useContext(Context)

    // console.log("",selectedLevelArr.value)



    useDerivedValue(() => {

        console.log(levelArr.value)

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

                    console.log("pressed", index)
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
