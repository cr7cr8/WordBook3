import React, { memo, useCallback, useMemo, useTransition } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, useContext } from 'react';
import * as Device from 'expo-device';
import ContextProvider from './ContextProvider';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import SwipeableItem, {
    useSwipeableItemParams,
    OpenDirection,
} from "react-native-swipeable-item";
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';

import { StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, RefreshControl, Keyboard, Alert, Platform, Pressable, BackHandler } from 'react-native';

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height
import superagent from "superagent"
import { ListItem, Avatar, LinearProgress, Button, Icon, Overlay, Badge, Switch, Input, Divider } from 'react-native-elements'

import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from 'react-native-draggable-flatlist';

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
    interpolate,
    useDerivedValue

} from 'react-native-reanimated';
import { FadeIn, FadeOut, BounceIn, BounceOut, SlideOutUp } from 'react-native-reanimated';
const { View, Text, ScrollView, FlatList } = ReAnimated

import { Context } from './ContextProvider';

//import axios from 'axios';
import { Audio } from 'expo-av';
import startPromiseSequential from 'promise-sequential';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

const headHeight = getStatusBarHeight() > 24 ? 70 : 60;
const headBarHeight = getStatusBarHeight()
import { useDebounce, useDebouncedCallback, useThrottledCallback } from 'use-debounce';
import * as FileSystem from 'expo-file-system/legacy';
import { File, Paths, Directory } from "expo-file-system";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    TapGestureHandler
} from 'react-native-gesture-handler'; //npx expo install react-native-gesture-handler


export default function NewWordScreen() {
    const navigation = useNavigation()
    const { speak, sourceWordArr, setSouceWordArr, saveWordToFile, isSaving, newWordText, setNewWordText, isNewerstOnTop, setRefreshState } = useContext(Context)
    const newWordPanelStyle = useAnimatedStyle(() => {

        return {

            backgroundColor: "#c3e1a2",

            height: screenHeight,
            width: screenWidth,


            overflow: "hidden",

            top: 0,// headBarHeight,

        }

    })

    const inputRef = useRef()

    const [recmenWordsArr, setRecmendWordsArr] = useState([])

    const [allWords, setAllwords] = useState([])

    const getWordsRecomendation = useDebouncedCallback((text) => {

        // superagent.get(`https://dict.youdao.com/suggest?num=20&ver=3.0&doctype=json&cache=false&le=jap&q=${text}`)
        superagent.get(`https://dict.youdao.com/suggest?num=20&ver=3.0&doctype=json&cache=false&le=en&q=${text}`)


            .then(data => {
                const obj = JSON.parse(data.text)
                //console.log(obj.data.entries)  
                // obj?.data?.entries?.forEach(element => {
                //     console.log(element.entry, element?.explain)
                // });

                if (obj?.data?.entries) {
                    setRecmendWordsArr(obj.data.entries)
                }
                else {
                    setRecmendWordsArr([])
                }

            })

    }, 1000, { leading: false, trailing: true })

    const [isExist, setIsExist] = useState(false)
    // useEffect(() => {
    //     console.log(isExist)
    // }, [isExist])
    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            //  !isListPlaying.value && playSound0(sourceWordArr[wordPos.value].wordName)

            const file = new File(Paths.document, "allwords.txt")
            setAllwords(() => {

                const allWords = JSON.parse(file.textSync())
                setIsExist(Boolean(allWords.find((element) => element.wordName === newWordText)))
                return allWords
            })

            // setTimeout(() => {
            //     console.log("ffdfs", allWords)

            // }, 0);



            // FileSystem.readAsStringAsync(FileSystem.documentDirectory + "allwords.txt").then(content => {
            //     setAllwords(JSON.parse(content))

            // })

            getWordsRecomendation(newWordText)

        });
        return unsubscribe

    }, [navigation]);




    return (
        <View style={[newWordPanelStyle]}>
            {/* <View style={{ width: screenWidth, height: headHeight, backgroundColor: "orange", opacity: 1, flexDirection: "column", }}> */}


            <View style={useAnimatedStyle(() => {

                return {
                    width: screenWidth,
                    height: 80 + 30,
                    backgroundColor: "wheat",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    flexDirection: "row"
                }
            })}>
                <Input
                    cursorColor={"black"}
                    ref={(ref) => { inputRef.current = ref }}
                    // value={textContentEn}
                    multiline={false}
                    autoFocus={true}
                    value={newWordText}
                    inputStyle={{ fontSize: 23 }}
                    // rightIcon={<Icon name="add" size={30} color={"orange"} containerStyle={{backgroundColor:"wheat",justifyContent:"center",alignItems:"center"}}/>}
                    // rightIconContainerStyle={{backgroundColor:"lightgreen", height:60 ,justifyContent:"center",alignItems:"center",}}

                    inputContainerStyle={{

                        //left: -4,
                        //  marginBottom: 0,
                        position: "absolute",
                        marginHorizontal: 0,
                        bottom: 0,
                        left: 8,
                        marginTop: 0,
                        padding: 0,
                        paddingHorizontal: 0,
                        height: 60,
                        width: screenWidth - 8 - 8, borderWidth: 1, borderColor: "black",// backgroundColor: "#e7cca0",// ,backgroundColor: "#aaa",
                        justifyContent: "flex-start", alignItems: "flex-start",
                        backgroundColor: isExist ? "#c3e1a2" : "#e7cca0",
                        paddingRight: 50,
                        borderBottomWidth: 0,

                        //alignSelf: "center",


                    }}

                    onChangeText={function (text) {
                        setNewWordText(text)
                        setIsExist(Boolean(allWords.find((element) => element.wordName === text)))
                        getWordsRecomendation(text)
                        // setTextContentEn(text)
                    }}
                    onPressIn={function () {
                        Keyboard.dismiss()
                        inputRef.current.focus()
                    }}
                />

                <View style={{
                    height: 60, width: 60, backgroundColor: "transparent", justifyContent: "center", alignItems: "center", position: "absolute", right: 8,

                }}>
                    <Icon
                        disabledStyle={{ backgroundColor: "transparent", opacity: 0 }}
                        disabled={!String(newWordText).match(/[\w\u4E00-\u9FFF]+/g)}

                        onPress={e => {

                            //const isExist = Boolean(allWords.find((element) => element.wordName === newWordText))
                            console.log("Fdsfsffaaaaaaaaaaad")


                            speak(newWordText, newWordText)


                            if (isExist) {
                                setSouceWordArr(sourceWordArr => {

                                    const word = sourceWordArr.find(word => {
                                        return word.wordName === newWordText
                                    })

                                    if (word) {
                                        const oldWord = JSON.parse(JSON.stringify(word))

                                        oldWord.toppingTime = Date.now()


                                        if (isNewerstOnTop.value) {

                                            return [oldWord, ...sourceWordArr.filter(word => (word.wordName !== newWordText))]
                                        }
                                        else {
                                            return [...sourceWordArr.filter(word => (word.wordName !== newWordText)), oldWord]
                                        }



                                    }
                                    else {
                                        const oldWord = allWords.find(word => {
                                            return word.wordName === newWordText
                                        })
                                        oldWord.toppingTime = Date.now()
                                        return isNewerstOnTop.value ? [oldWord, ...sourceWordArr] : [...sourceWordArr, oldWord]
                                    }
                                })
                                setRefreshState(Math.random())
                                setIsExist(true)
                                setTimeout(() => {
                                    saveWordToFile()
                                }, 0);
                            }
                            else {
                                const newWord = {
                                    "wordName": newWordText,
                                    "meaning": "",
                                    "meaningSound": "",
                                    "createTime": Date.now(),
                                    "toppingTime": Date.now(),
                                    "exampleEnglishArr": [],
                                    "exampleChineseArr": [],
                                    "level": 0,
                                    "accent": "UK",
                                    "showChinese": true,
                                    "firstTimeAmount": 2,
                                    "firstTimeMeaningAmount": 1,
                                    "secondTimeAmount": 2,
                                    "secondTimeMeaningAmount": 1
                                }
                                setSouceWordArr(pre => {
                                    return isNewerstOnTop.value ? [newWord, ...pre] : [...pre, newWord]
                                })
                                setAllwords(pre => {
                                    return [newWord, ...pre]
                                })
                                setRefreshState(Math.random())
                                setIsExist(true)
                                setTimeout(() => {
                                    saveWordToFile()
                                }, 100);

                            }
                        }}


                        name="add-circle-outline" type='ionicon' color='orange'
                        containerStyle={{
                            width: 60, height: 60, transform: [{ rotateZ: "0deg" }], //backgroundColor: "#e7cca0",
                            justifyContent: "center",
                        }}
                        size={50}
                    />
                </View>

            </View>





            <View style={{ width: screenWidth, height: 500, alignItems: "center" }}>
                <ScrollView
                    contentContainerStyle={{ backgroundColor: "#c3e1a2" }}
                >
                    {recmenWordsArr.map((item, index) => {

                        const isExist = Boolean(allWords.find((element) => element.wordName === item.entry))

                        return (


                            <View style={{
                                width: screenWidth - 16, minHeight: 80, borderBottomWidth: 1, position: "relative",

                                flexDirection: "row"
                            }}
                                key={index}
                            >


                                <TouchableOpacity activeOpacity={0.2}
                                    onPress={function () {
                                        speak(item.entry, item.entry)
                                    }}
                                >
                                    <View style={{ width: screenWidth - 16, backgroundColor: isExist ? "#c3e1a2" : "#eee", minHeight: 80, borderLeftWidth: 1, borderRightWidth: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: 800 }}>{item.entry}</Text>
                                        <Text style={{ flex: 1, flexWrap: "wrap", fontSize: 15 }}>{item?.explain}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.2}

                                    onPress={function (e) {
                                        console.log(item.entry, "ddddddddddsssssss'''''''ddddd''''")
                                        speak(item.entry, item.entry)

                                        if (isExist) {
                                            setSouceWordArr(sourceWordArr => {

                                                const word = sourceWordArr.find(word => {
                                                    return word.wordName === item.entry
                                                })

                                                if (word) {
                                                    const oldWord = JSON.parse(JSON.stringify(word))

                                                    oldWord.toppingTime = Date.now()
                                                    // return [oldWord, ...sourceWordArr.filter(word => (word.wordName !== item.entry))]


                                                    if (isNewerstOnTop.value) {

                                                        return [oldWord, ...sourceWordArr.filter(word => (word.wordName !== item.entry))]
                                                    }
                                                    else {
                                                        return [...sourceWordArr.filter(word => (word.wordName !== item.entry)), oldWord]
                                                    }

                                                }
                                                else {
                                                    const oldWord = allWords.find(word => {
                                                        return word.wordName === item.entry
                                                    })
                                                    oldWord.toppingTime = Date.now()
                                                    return isNewerstOnTop.value ? [oldWord, ...sourceWordArr] : [...sourceWordArr, oldWord]
                                                }
                                            })

                                            if (item.entry == newWordText) {
                                                setIsExist(true)
                                            }
                                            setRefreshState(Math.random())
                                            setTimeout(() => {
                                                saveWordToFile()
                                            }, 0);
                                        }
                                        else {

                                            const newWord = {
                                                "wordName": item.entry,
                                                "meaning": item.explain || "",
                                                "meaningSound": item.explain || "",
                                                "createTime": Date.now(),
                                                "toppingTime": Date.now(),
                                                "exampleEnglishArr": [],
                                                "exampleChineseArr": [],
                                                "level": 0,
                                                "accent": "UK",
                                                "showChinese": true,
                                                "firstTimeAmount": 2,
                                                "firstTimeMeaningAmount": 1,
                                                "secondTimeAmount": 2,
                                                "secondTimeMeaningAmount": 1
                                            }
                                            setSouceWordArr(pre => {

                                                return isNewerstOnTop.value ? [newWord, ...pre] : [...pre, newWord]
                                            })
                                            setAllwords(pre => {
                                                return [newWord, ...pre]
                                            })


                                            if (item.entry == newWordText) {
                                                setIsExist(true)
                                            }
                                            setRefreshState(Math.random())
                                            setTimeout(() => {
                                                saveWordToFile()
                                            }, 100);

                                        }
                                    }}

                                >
                                    <View style={{
                                        //  backgroundColor: "skyblue",
                                        width: 60, height: 60,

                                        transform: [{ translateX: -60 }],
                                        // height: 80, width: 80, //backgroundColor: "pink",
                                        alignItems: "center", justifyContent: "center",

                                    }}>
                                        <Icon name="add-circle-outline" type='ionicon' color='orange'
                                            // onPress={function () {
                                            //     console.log("----")
                                            // }}

                                            containerStyle={{
                                                width: 60, height: 60, transform: [{ rotateZ: "180deg" }],

                                            }}
                                            // containerStyle={{ position: "absolute", right: 0, transform: [{ translateY: 0 }] }}
                                            size={50}
                                        />
                                    </View>
                                </TouchableOpacity>

                            </View>




                        )


                    })}
                </ScrollView >

            </View >
        </View >
    )

}