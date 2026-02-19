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

import { StyleSheet, Button, Dimensions, TouchableOpacity, SafeAreaView, RefreshControl, Alert, Vibration, Keyboard } from 'react-native';
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






export default function SettingScreen() {
    const { setSouceWordArr, saveWordToFile, sourceWordArr, refreshState, setRefreshState, wordPos, scrollX, scrollRef0,
        scrollRef, scrollRef2, preTop, isSaving,

        selectedLevelArr, isNewerstOnTop, smallIndex, largeIndex } = useContext(Context)

    const file = new File(Paths.document, "allwords.txt")
    const allWords = JSON.parse(file.textSync())
    allWords.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })


    //console.log("-----", smallIndex.value, largeIndex.value)


    const levelArr = useSharedValue(selectedLevelArr.value)



    function filterLevel() {


        const localSmall = (Number)(formattedText1.value) <= (Number)(formattedText2.value) ? (Number)(formattedText1.value) : (Number)(formattedText2.value)
        const localLarge = (Number)(formattedText1.value) >= (Number)(formattedText2.value) ? (Number)(formattedText1.value) : (Number)(formattedText2.value)


        // if (smallIndex.value == localSmall && largeIndex.value == localLarge && JSON.stringify(selectedLevelArr.value) == JSON.stringify(levelArr.value)) {
        //     if (sourceWordArr.length === (localLarge - localSmall) + 1) {
        //         return
        //     }
        // }

        smallIndex.value = localSmall
        largeIndex.value = localLarge










        isSaving.value = true
        const newArr = allWords.filter((word, index) => {
            // console.log(word.level, index, selectedLevelArr.value[word.level])

            if ((index < localSmall) || (index > localLarge)) {
                return false
            }

            //  console.log("sm", smallIndex, "lg", largeIndex)

            return levelArr.value[word.level] === true


        })
        if (isNewerstOnTop.value) {
            newArr.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })
        }
        else {
            newArr.sort((word1, word2) => { return word1.toppingTime - word2.toppingTime })
        }


        wordPos.value = 0
        scrollRef.current._scrollViewRef.scrollTo({ y: 0, animated: true })
        scrollRef2.current._scrollViewRef.scrollTo({ x: 0, animated: true })
        preTop.value = headHeight
  
        setTimeout(() => {
            setSouceWordArr(newArr)
            isSaving.value = false
        }, newArr.length>1?500:500);// need 500 second to make sure scroll animation finish


        selectedLevelArr.modify(arr => {
            "worklet"
            return levelArr.value
        })






      
    }



    useEffect(() => {


        const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            setTimeout(() => {
                filterLevel()
            }, 300);

            //return true
            return false; // false --> Allows the default back action
        });
        return function () {
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

    //const [checked, setChecked] = useState(isNewerstOnTop.value)

    const [checked, setChecked] = useState(true)









    //const formattedText1 = useSharedValue(0 + "")
    //const formattedText2 = useSharedValue(Math.max(0, allWords.length - 1) + "")

    const formattedText1 = useSharedValue(smallIndex.value + "")
    const formattedText2 = useSharedValue(largeIndex.value + "")


    const translateXDot1 = useSharedValue(
        (smallIndex.value === allWords.length - 1)
            ? smallIndex.value !== 0
                ? screenWidth - 120 - 40
                : 0
            : Math.min(Math.max(0, (Number)(formattedText1.value || "0")), allWords.length - 1) / allWords.length * (screenWidth - 120 - 40)

    )


    const translateXDot2 = useSharedValue(
        (largeIndex.value === allWords.length - 1)
            ? screenWidth - 120 - 40
            : Math.min(Math.max(0, (Number)(formattedText2.value || "0")), allWords.length - 1) / allWords.length * (screenWidth - 120 - 40)
    )



    const textRef1 = useAnimatedRef()
    const textRef2 = useAnimatedRef()
    useEffect(() => {
        const listener1 = Keyboard.addListener("keyboardDidHide", () => {
            textRef1.current?.blur()

            // const val_ = (Number)(formattedText1.value || "0")
            // const val = Math.min(Math.max(0, val_), allWords.length - 1)


            // translateXDot1.value = val / allWords.length * (screenWidth - 120 - 40)

            // formattedText1.value = val + ""
            // textRef1.current?.blur()

        })
        const listener2 = Keyboard.addListener("keyboardDidHide", () => {
            //   console.log("hiding2222")
            textRef2.current?.blur()


            // const regexLiteral = /^[0-9]*$/
            // //   console.log(text, regexLiteral.test(text))
            // if (regexLiteral.test( formattedText2.value)) {

            // }
            // else{
            //      formattedText2.value.replace(/[^0-9]/g, "")
            // }
            // formattedText2.value = formattedText2.value.replace(/[^0-9]/g, "")

            // const val_ = (Number)(formattedText2.value || "0")
            // const val = Math.min(Math.max(0, val_), allWords.length - 1)


            // translateXDot2.value = val / allWords.length * (screenWidth - 120 - 40)

            // formattedText2.value = val + ""


        })



        return function () {
            listener1.remove()
            listener2.remove()
        }





    }, [textRef1.current, textRef2.current])



    return (

        <>
            <View style={[settingPanelStyle]}>



                <View style={useAnimatedStyle(() => {
                    return {
                        width: screenWidth,
                        height: "auto",
                        backgroundColor: "wheat",
                        flexDirection: "column"
                    }
                })}>


                    <View style={{ width: screenWidth, height: 80, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around" }}>
                        <Text style={{ color: "#a75d09", fontSize: 20, fontWeight: 600 }}>Slice total {allWords.length}</Text>
                        <Switch
                            //thumbColor={"green"}
                            color='orange'

                            style={{
                                height: 40, width: 80,// backgroundColor: "rgba(122,114,225,0.3)",
                                backgroundColor: "rgba(122,114,225,0)",
                                right: 10,
                                transform: [{ scale: 1.5 }, { translateY: 2 }]
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
                        height: checked ? 80 : 0,
                        // backgroundColor: "rgba(112,156,123,0.5)",
                        //  justifyContent: "center",
                        marginTop: 0,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        overflow: "hidden",
                        transform: [{ translateY: 10 }]

                    }}>




                        <View style={

                            useAnimatedStyle(() => {

                                return {
                                    width: 60,
                                    height: 80,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // backgroundColor: "lightblue",
                                    zIndex: 0
                                }

                            })

                        }>
                            <ReText

                                ref={(ref) => { textRef1.current = ref }}
                                text={formattedText1} color="#a75d09" fontSize={18} style={{ fontWeight: 400 }} keyboardType='numeric'
                                onFocus={() => {
                                    formattedText1.value = ""
                                }}

                                editable={true}
                                onChangeText={text => {
                                    setTimeout(() => {
                                        formattedText1.value = text
                                    }, 0);


                                }}

                                onBlur={() => {

                                    formattedText1.value = formattedText1.value.replace(/[^0-9]/g, "")

                                    setTimeout(() => {
                                        const val_ = (Number)(formattedText1.value || smallIndex.value + "")
                                        const val = Math.min(Math.max(0, val_), allWords.length - 1)

                                        //  translateXDot1.value = val / allWords.length * (screenWidth - 120 - 40)

                                        translateXDot1.value =
                                            val === 0
                                                ? 0
                                                : val === allWords.length - 1
                                                    ? screenWidth - 120 - 40
                                                    : val / allWords.length * (screenWidth - 120 - 40)



                                        formattedText1.value = val + ""

                                    }, 0);
                                }}
                            />
                        </View>


                        <View style={{ backgroundColor: "transparent", width: screenWidth - 120, height: 4, }}>

                            <View style={{
                                backgroundColor: "#D6BD95",
                                width: screenWidth - 160, height: 4, position: "absolute", transform: [{ translateX: 20 }]
                            }}></View>

                            <View style={
                                useAnimatedStyle(() => {

                                    return {
                                        backgroundColor: "orange",
                                        width: Math.abs(translateXDot1.value - translateXDot2.value),
                                        //width: screenWidth - 160,
                                        height: 4,
                                        transform: [{ translateX: 20 + Math.min(translateXDot1.value, translateXDot2.value) }]
                                    }

                                })

                            }>
                            </View>

                            <GestureDetector gesture={Gesture.Pan()
                                .onStart(e => {

                                })
                                .onChange(e => {
                                    translateXDot1.value = translateXDot1.value + e.changeX
                                    const val = Math.round(translateXDot1.value / (screenWidth - 120 - 40) * allWords.length)
                                    //  console.log(translateXDot1.value, "/", screenWidth - 120 - 40, "===", Math.round(translateXDot1.value / (screenWidth - 120 - 40) * 100) + "%")
                                    formattedText1.value = Math.min(Math.max(0, val), allWords.length - 1) + ""



                                })
                                .onEnd(e => {

                                    if (translateXDot1.value <= 0) {
                                        translateXDot1.value = withTiming(0)
                                    }
                                    else if (translateXDot1.value >= screenWidth - 120 - 40) {
                                        translateXDot1.value = withTiming(screenWidth - 120 - 40)
                                    }





                                })
                            }>
                                <View style={

                                    useAnimatedStyle(() => {
                                        return {
                                            height: 40,
                                            width: 40,
                                            backgroundColor: "rgba(122,0,0,0.0)",
                                            borderRadius: 0,
                                            borderTopEndRadius: 0,

                                            transform: [{ translateX: translateXDot1.value }, { translateY: -44, },
                                            { rotate: "0deg" }

                                            ],
                                            marginTop: 0,
                                            display: "flex",
                                            opacity: 0.98,

                                        }
                                    })


                                }>


                                    <Icon
                                        name="search-outline" type='ionicon' color='orange'
                                        containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "45deg" }, { translateX: 1 }] }}
                                        size={40}
                                    />


                                </View>
                            </GestureDetector>


                            <GestureDetector gesture={Gesture.Pan()
                                .onStart(e => {

                                })
                                .onChange(e => {
                                    translateXDot2.value = translateXDot2.value + e.changeX
                                    const val = Math.round(translateXDot2.value / (screenWidth - 120 - 40) * allWords.length)
                                    // console.log(translateXDot2.value, "/", screenWidth - 120 - 40, "===", Math.round(translateXDot2.value / (screenWidth - 120 - 40) * 100) + "%")
                                    formattedText2.value = Math.min(Math.max(0, val), allWords.length - 1) + ""

                                })
                                .onEnd(e => {

                                    if (translateXDot2.value <= 0) {
                                        translateXDot2.value = withTiming(0)
                                    }
                                    else if (translateXDot2.value >= screenWidth - 120 - 40) {
                                        translateXDot2.value = withTiming(screenWidth - 120 - 40)
                                    }


                                })
                            }>
                                <View style={

                                    useAnimatedStyle(() => {
                                        return {
                                            height: 40,
                                            width: 40,
                                            backgroundColor: "rgba(122,0,0,0.0)",
                                            borderRadius: 0,
                                            borderTopEndRadius: 0,

                                            transform: [{ translateX: translateXDot2.value }, { translateY: -40, },
                                            { rotate: "180deg" }

                                            ],
                                            marginTop: 0,
                                            display: "flex",
                                            opacity: 0.98,

                                        }
                                    })


                                }>


                                    <Icon
                                        name="search-outline" type='ionicon' color='orange'
                                        containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "45deg" }, { translateX: 1 }] }}
                                        size={40}
                                    />


                                </View>
                            </GestureDetector>



                        </View>

                        <View style={

                            useAnimatedStyle(() => {

                                return {
                                    width: 60,
                                    height: 60,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }

                            })

                        }>
                            <ReText

                                ref={(ref) => { textRef2.current = ref }}
                                text={formattedText2} color="#a75d09" fontSize={18} style={{ fontWeight: 400 }} keyboardType='numeric'
                                onFocus={(e) => {
                                    formattedText2.value = ""
                                }}

                                editable={true}
                                onChangeText={text => {

                                    setTimeout(() => {
                                        formattedText2.value = text
                                    }, 0);


                                    // const regexLiteral = /^[0-9]*$/
                                    // //   console.log(text, regexLiteral.test(text))
                                    // if (regexLiteral.test(text)) {
                                    //     formattedText2.value = text
                                    // }


                                }}
                                onBlur={(e) => {

                                    formattedText2.value = formattedText2.value.replace(/[^0-9]/g, "")

                                    setTimeout(() => {
                                        const val_ = (Number)(formattedText2.value || largeIndex.value + "")
                                        const val = Math.min(Math.max(0, val_), allWords.length - 1)

                                        translateXDot2.value =
                                            val === allWords.length - 1
                                                ? screenWidth - 120 - 40
                                                : val / allWords.length * (screenWidth - 120 - 40)



                                        formattedText2.value = val + ""

                                    }, 0);





                                }}


                            // onPointerLeave={e=>{
                            //     console.log("fdfdf")
                            // }}


                            />


                        </View>

                    </View>

                </View>





                <RateBar levelArr={levelArr} />


                {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 30 }}>
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
                </View> */}



            </View >



        </>

    )
}


function RateBar({ levelArr }) { //!!! Make sure the Card.js render first, then render this component!!!

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
