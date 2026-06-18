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



export default function ExportFileButton({ allWords, filterLevel, setAllWords,

    formattedText1, formattedText2, localEnableSlice, levelArr


}) {


    const { sourceWordArr, setSouceWordArr, totalWordsNum, scrollRef0, scrollRef, scrollRef2, frameTransY, wordPos, isListPlaying, preLeft, preTop, scrollY, scrollX,
        isPanning, speak, autoPlay, stopSpeak, isScrollingY, isScrollingX, isCardMoving, isManualDrag, shouldHideWordBlock, isNewerstOnTop, setRefreshState,
        selectedLevelArr, smallIndex, largeIndex, enableSlice, wordRepeatingArr, sentenceRepeatingArr, sameAmountWord, sameAmountSentence, exportFileName,
    } = useContext(Context)
    const navigation = useNavigation()
    const [localFileName, setLocalFileName] = useState(exportFileName.value)
    function loadTextFile() {

        File.pickFileAsync("content://com.android.externalstorage.documents/document/", "text/plain").then(file => {

            console.log(file.name)
            //setLocalFileName(file.name)


            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'HomeScreen',
                            //  params: { user: 'jane', key: route.params.key },
                        },

                    ],
                })
                setTimeout(() => {
                    setRefreshState(Math.random())
                }, 500);
            }, 500);




            const arr = JSON.parse(file.textSync())

            setTimeout(() => {
                totalWordsNum.value = arr.length
                formattedText1.value = 0 + ""
                formattedText2.value = arr.length + ""
                let configObj = {

                    isNewerstOnTop: true,
                    selectedLevelArr: [true, true, true, true, true, true],
                    smallIndex: 0,
                    largeIndex: Math.max(0, arr.length - 1),
                    enableSlice: true,
                    exportFileName: file.name,

                    wordRepeatingArr: wordRepeatingArr.value,
                    sentenceRepeatingArr: sentenceRepeatingArr.value,
                    sameAmountWord: sameAmountWord.value,
                    sameAmountSentence: sameAmountSentence.value,


                }
                const configFile = new File(Paths.document, "config.json")
                configFile.create({ intermediates: true, overwrite: true })
                configFile.write(JSON.stringify(configObj), {})

                isNewerstOnTop.value = true
                selectedLevelArr.value = [true, true, true, true, true, true];
                smallIndex.value = 0;
                largeIndex.value = Math.max(0, arr.length - 1);
                enableSlice.value = true;
                exportFileName.value = file.name;

                arr.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })

                const allWordsFile = new File(Paths.document, "allwords.txt")
                allWordsFile.create({ intermediates: true, overwrite: true })
                allWordsFile.write(JSON.stringify(arr), {})
                wordPos.value = 0
                setSouceWordArr(arr)

            }, 0);



        })


    }

    async function exportTextFile() {

        const directory = await Directory.pickDirectoryAsync("Documents");
        const createdFile = directory.createFile(String(localFileName.slice(-4)).toLowerCase() === ".txt" ? localFileName : localFileName + ".txt", "text/plain");
        createdFile.write(JSON.stringify(allWords));

    }

    async function exportSourceWordArr() {

        const directory = await Directory.pickDirectoryAsync("Documents");
        const createdFile = directory.createFile(String(localFileName.slice(-4)).toLowerCase() === ".txt" ? localFileName : localFileName + ".txt", "text/plain");
        createdFile.write(JSON.stringify(filterLevel()));
    }


    const keyboardHeight = useSharedValue(0)

    const shouldMove = useRef(false)

    const inputRef = useAnimatedRef()



    useEffect(() => {


        const listener1 = Keyboard.addListener("keyboardDidShow", (e) => {
            if (shouldMove.current) keyboardHeight.value = 120

        })

        const listener2 = Keyboard.addListener("keyboardDidHide", (e) => {
            keyboardHeight.value = e.endCoordinates.height
            shouldMove.current = false

            inputRef.current.blur()

            exportFileName.value = localFileName
            setTimeout(() => {
                if (!exportFileName.value) {
                    exportFileName.value = "WordList.txt",
                        setLocalFileName("WordList.txt")
                }
            }, 0);

        })  

        return function () {
            listener1.remove()
            listener2.remove()


        }



    }, [localFileName])



    return (
        <View style={useAnimatedStyle(() => {

            return {
                flexDirection: "column",
                width: screenWidth,
                height: 120,
                backgroundColor: "#e7cca0",
                marginTop: 4,
                transform: [{ translateY: withTiming(-keyboardHeight.value) }],
            }


        })}>

            <View style={useAnimatedStyle(() => {
                return {
                    flexDirection: "row",
                    justifyContent: "center",
                    width: screenWidth,
                    height: 60,
                }

            })}>
                {/* <ReText text={exportFileName} fontSize={25} style={{ fontWeight: 400, }} color="#a75d09" ref={(ref) => { inputRef.current = ref }}

                    editable={true}
                    onChangeText={text => {

                        exportFileName.value = text






                    }}

                    onPressIn={() => {
                        shouldMove.current = true
                        console.log("inin")
                    }} /> */}

                <Input

                    onLayout={() => {
                        Keyboard.dismiss()
                    }}
                    cursorColor={"black"}
                    ref={(ref) => { inputRef.current = ref }}
                    value={localFileName}
                    multiline={false}
                    autoFocus={false}
                    textAlign='center'
                    style={{ padding: 0, paddingHorizontal: 0, fontSize: 25, alignSelf: "center", justifyContent: "center", alignItems: "center", color: "#a75d09" }}
                    inputContainerStyle={{

                        marginBottom: 0,
                        marginTop: 0,
                        paddingTop: 0,
                        height: 60,
                        width: (screenWidth - 8), borderWidth: 0, backgroundColor: "transparent",
                        justifyContent: "center", alignItems: "center",
                        alignSelf: "center",
                        borderColor: "transparent"

                    }}
                    onPressIn={() => {
                        shouldMove.current = true
                    }}

                    onChangeText={function (text) {
                        setLocalFileName(text.replace(/[^\w\u4E00-\u9FFF.]+/g, ""))
                    }}

                />


            </View>
            <View style={useAnimatedStyle(() => {

                return {
                    flexDirection: "row",
                    justifyContent: "space-around"
                }

            })}>

                <Icon name="exit-outline" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "270deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {
                        exportSourceWordArr()
                    }}
                />
                <Icon name="exit" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "270deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {
                        exportTextFile()
                    }}
                />
                <Icon name="enter-outline" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "90deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {
                        loadTextFile()

                    }}

                />

            </View>
        </View>

    )


}