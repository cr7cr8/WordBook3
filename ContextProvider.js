import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Audio } from 'expo-av';

import { activateKeepAwakeAsync, deactivateKeepAwake, useKeepAwake } from 'expo-keep-awake';

import { StyleSheet, Button, Dimensions, AppState, Vibration } from 'react-native';
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height
//import wordUsObj from "./wordUsObj"
import { getStatusBarHeight } from 'react-native-status-bar-height';
const headHeight = getStatusBarHeight() > 24 ? 80 : 60

import * as MediaLibrary from 'expo-media-library';
import CryptoJS from 'crypto-js/sha256';
import promiseSequential from 'promise-sequential';
import Reanimated, { useSharedValue, useAnimatedRef, withTiming, useDerivedValue, useAnimatedStyle, } from 'react-native-reanimated';
import { runOnJS, runOnUI, scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
const { View, Text, ScrollView, FlatList } = Reanimated

import startPromiseSequential from 'promise-sequential';

import { useDebounce, useDebouncedCallback, useThrottledCallback } from 'use-debounce';
import { File, Directory, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

import { defaultwordsArr } from "./defaultwords";

import * as Speech from 'expo-speech';
import { useAudioPlayer } from 'expo-audio';



import superagent from "superagent";
import AsyncStorage from '@react-native-async-storage/async-storage';



import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from 'react-native-reanimated';
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false//true, // Reanimated runs in strict mode by default
});




export const Context = createContext()
export default function ContextProvider(props) {


    const [sourceWordArr, setSouceWordArr] = useState([])

    //const directory = new Directory(Paths.document)
    // const [file] = useState(new File(Paths.document),"","allwords.txt")
    // directory.list()

    const isSaving = useSharedValue(false)
    const saveWordToFile = useDebouncedCallback(
        () => {
            console.log("writing allwords.txt")
            isSaving.value = true
            const wordFile = new File(Paths.document, "allwords.txt")

            wordFile.text().then(content => {

                const arr = [...sourceWordArr]
                const arr2 = []
                const originalWordArr = JSON.parse(content || "[]")
                originalWordArr.forEach(word => {
                    if ((arr.findIndex(item => word.wordName === item.wordName)) < 0) {
                        arr2.push(word)
                    }
                })
                wordFile.write(JSON.stringify([...arr, ...arr2]))
                console.log("saving done,allwords.txt has been rewritten")
                //   console.log(wordFile.textSync())
                isSaving.value = false

            })

        },

        Math.min(sourceWordArr.length * 10, 1000),
        { leading: true, trailing: false }
    )

    useEffect(() => {
        const wordFile = new File(Paths.document, "allwords.txt")
        !wordFile.exists && wordFile.create({ intermediates: true, overwrite: false })

        if (wordFile.size === 0) {

            const now = Date.now()
            const arr = defaultwordsArr.map((word, index) => {
                const random = Math.floor(Math.random() * 10000000)
                return {
                    ...word,
                    createTime: now - random,
                    toppingTime: now - random + 5000,
                }
            })
            setSouceWordArr(arr)
            setTimeout(() => {
                saveWordToFile()
            }, 100);

        }
        else {
            setSouceWordArr(JSON.parse(wordFile.textSync()))
        }


        // !wordFile.exists && wordFile.create({ intermediates: true, overwrite: false })



        // const now = Date.now()
        // const arr = defaultwordsArr.map((word, index) => {
        //     const random = Math.floor(Math.random() * 10000000)
        //     return {
        //         ...word,
        //         createTime: now - random,
        //         toppingTime: now - random + 5000,
        //     }
        // })
        // setSouceWordArr(arr)
        // setTimeout(() => {
        //     //  saveWordToFile()
        // }, 100);



    }, [])


    const wordPos = useSharedValue(0)
    const frameTransY = useSharedValue(0)
    const isListPlaying = useSharedValue(false)
    const scrollRef0 = useAnimatedRef()
    const scrollRef = useAnimatedRef()
    const scrollRef2 = useAnimatedRef()

    const preLeft = useSharedValue(screenWidth)
    const preTop = useSharedValue(headHeight)
    const scrollY = useSharedValue(0)
    const scrollX = useSharedValue(0)
    const isPanning = useSharedValue(false)

    const isScrollingY = useSharedValue(false)
    const isScrollingX = useSharedValue(false)
    const isCardMoving = useSharedValue(false)

    const isManualDrag = useSharedValue(false)


    const [refreshState, setRefreshState] = useState(Math.random())


    const downloadWord = useDebouncedCallback(
        function (word1, word2, fn) {
            Vibration.vibrate(50)

            const hashName1 = CryptoJS(word1).toString();
            const hashName2 = CryptoJS(word2).toString();
            const hashName = hashName1 + hashName2;


            const oldFile = new File(Paths.document, hashName + ".mp3")
            oldFile.exists && oldFile.delete()

            File.downloadFileAsync(
                encodeURI(`https://audio.wordhippo.com/mp3/translate_tts?ie=UTF-8&tl=en-US&tk=590080.996406&client=t&q=${word2}`),
                new Directory(Paths.document),
                { idempotent: true }
            ).then(newFile => {
                console.log(word1, word2, "is downloaded")
                newFile.rename(hashName + ".mp3")
                setRefreshState(Math.random())
                fn && fn()
            }).catch(e => {
                console.log(e)
            })
        },
        1000,
        { leading: true, trailing: false, }

    )

    function deleteDownloadWord(word1, word2, fn) {
        Vibration.vibrate(50)
        const hashName1 = CryptoJS(word1).toString();
        const hashName2 = CryptoJS(word2).toString();
        const hashName = hashName1 + hashName2;
        const oldFile = new File(Paths.document, hashName + ".mp3")
        console.log(word2, "is found?", oldFile.exists)
        oldFile.exists && oldFile.delete()
        setRefreshState(Math.random())
        fn && fn()
    }


    const deleteWordToFile = useDebouncedCallback(
        (word) => {


            isSaving.value = true
            const wordFile = new File(Paths.document, "allwords.txt")
            if (wordFile.exists) {

                const originalWordArr = JSON.parse(wordFile.textSync()).filter(element => element.wordName !== word.wordName)
                wordFile.write(JSON.stringify(originalWordArr))
            }

            // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(data => {
            //     if (data.includes("allwords.txt")) {


            //         FileSystem.readAsStringAsync(FileSystem.documentDirectory + "allwords.txt")
            //             .then(content => {

            //                 const originalWordArr = JSON.parse(content).filter(element => element.wordName !== word.wordName)

            //                 FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "allwords.txt", JSON.stringify(
            //                     originalWordArr
            //                 )).then(info => {
            //                     console.log("allwords.txt has been rewritten")
            //                     isSaving.value = false
            //                 })
            //             })
            //             .catch(err => {
            //                 console.log(err)
            //                 isSaving.value = false
            //             })


            //     }
            //     else {

            //         isSaving.value = false

            //     }
            // })


        },
        Math.min(sourceWordArr.length * 10, 1000),
        { leading: true, trailing: false }
    )



    const audioPlayer = useAudioPlayer()
    let [outerResolve] = useState()
    const stopSpeak = () => {
        audioPlayer.pause()
        Speech.stop()
        outerResolve && outerResolve("audio is paused")
    }
    function checkPlaying() {
        return promiseSequential([isSpeakPlayingAsync, isAudioPlayingAsync])
    }

    function isSpeakPlayingAsync() {
        return Speech.isSpeakingAsync().then(res => {
            return Promise.resolve(res)
        })
    }

    function isAudioPlayingAsync() {
        return new Promise((resolve, reject) => {
            resolve(audioPlayer.currentStatus.playing)
        })
    }

    const speak = useDebouncedCallback((word1, word2) => {

        const hashName1 = CryptoJS(word1).toString();
        const hashName2 = CryptoJS(word2).toString();
        const hashName = hashName1 + hashName2

        let resolveMethod;
        let rejectMethod;
        const p = new Promise((resolve, reject) => { resolveMethod = resolve; rejectMethod = reject, outerResolve = resolve })
        const file = new File(Paths.document, hashName + ".mp3")

        if (file.exists) {


            setTimeout(() => {
                const timeout = setTimeout(() => {
                    listener.remove()
                    console.log(word2 + " audio reading ERROR ================")
                    resolveMethod(word2 + " audio reading ERROR")

                }, 3000);


                const listener = audioPlayer.addListener("playbackStatusUpdate", (status) => {

                    if (status.playing) {
                        timeout && clearTimeout(timeout)
                    }
                    else if (status.didJustFinish) {

                        listener.remove()
                        timeout && clearTimeout(timeout)
                        // console.log("playing", word2, " isDone")
                        resolveMethod("playing " + word2 + " done")
                    }

                })
                audioPlayer.pause()
                Speech.stop()
                audioPlayer.replace(file.uri)
                audioPlayer.play()
            }, 0);




        }
        else {
            audioPlayer.pause()
            Speech.stop()
            Speech.speak(word2, {
                onDone: () => {
                    // console.log("speaking", word2, " isDone")
                    resolveMethod(word2 + " Speech reading done")
                },
                onError: () => {
                    rejectMethod(word2 + "speech reading ERROR")
                },
                onStopped: () => {
                    resolveMethod(word2 + " Speech reading stopped")
                }
            });
        }

        return p







    }, 200, { leading: true, trailing: false })

    function isAllScrollingStop() {
        "worklet"
        return (!isScrollingY.value) && (!isCardMoving.value) && (!isScrollingX.value)
    }
    const sentencePlayingIndex = useSharedValue(0)
    const autoPlay = useDebouncedCallback(function () {

        const arr = []
        ///////////////////////////////
        // arr.push(function () {
        //     sentencePlayingIndex.value = 0
        //     if (!isListPlaying.value) { return Promise.resolve() }

        //     return speak(sourceWordArr[wordPos.value].wordName, sourceWordArr[wordPos.value].wordName)
        // })
        //////////////////////////////

        for (let i = 0; i < sourceWordArr[wordPos.value].firstTimeAmount; i++) {
            arr.push(function () {
                if (!isListPlaying.value) { return Promise.resolve() }
                return speak(sourceWordArr[wordPos.value].wordName, sourceWordArr[wordPos.value].wordName)
            })
        }

        for (let i = 0; i < sourceWordArr[wordPos.value].firstTimeMeaningAmount; i++) {
            arr.push(function () {
                if (!isListPlaying.value) { return Promise.resolve() }
                return speak(sourceWordArr[wordPos.value].meaningSound, sourceWordArr[wordPos.value].meaningSound)
            })
        }
        // for (let i = 0; i < sourceWordArr[wordPos.value].secondTimeAmount; i++) {
        //     arr.push(function () {
        //         if (!isListPlaying.value) { return Promise.resolve() }
        //         return speak(sourceWordArr[wordPos.value].wordName, sourceWordArr[wordPos.value].wordName)
        //     })
        // }
        // for (let i = 0; i < sourceWordArr[wordPos.value].secondTimeMeaningAmount; i++) {
        //     arr.push(function () {
        //         if (!isListPlaying.value) { return Promise.resolve() }
        //         return speak(sourceWordArr[wordPos.value].meaningSound, sourceWordArr[wordPos.value].meaningSound)
        //     })
        // }

        for (let i = 0; i < sourceWordArr[wordPos.value].exampleEnglishArr.length; i++) {

            // for (let j = 0; j < sourceWordArr[wordPos.value].exampleEnglishArr[i].firstTimeAmount; j++) {
            arr.push(function () {
                sentencePlayingIndex.value = i
                if (!isListPlaying.value) { return Promise.resolve() }
                return speak(sourceWordArr[wordPos.value].wordName, sourceWordArr[wordPos.value].exampleEnglishArr[i].sentence)
            })
            // }

            // for (let j = 0; j < sourceWordArr[wordPos.value].exampleChineseArr[i].firstTimeAmount; j++) {
                arr.push(function () {
                    if (!isListPlaying.value) { return Promise.resolve() }
                    return speak(sourceWordArr[wordPos.value].exampleChineseArr[i].sentence, sourceWordArr[wordPos.value].exampleChineseArr[i].sentence)
                })
            // }

            // for (let j = 0; j < sourceWordArr[wordPos.value].exampleEnglishArr[i].secondTimeAmount; j++) {
            //     arr.push(function () {
            //         if (!isListPlaying.value) { return Promise.resolve() }
            //         return speak(sourceWordArr[wordPos.value].wordName, sourceWordArr[wordPos.value].exampleEnglishArr[i].sentence)
            //     })
            // }

            // for (let j = 0; j < sourceWordArr[wordPos.value].exampleChineseArr[i].secondTimeAmount; j++) {
            //     arr.push(function () {
            //         if (!isListPlaying.value) { return Promise.resolve() }
            //         return speak(sourceWordArr[wordPos.value].exampleChineseArr[i].sentence, sourceWordArr[wordPos.value].exampleChineseArr[i].sentence)
            //     })
            // }
        }









        return promiseSequential([

            ...arr,

            function () {

                if (!isListPlaying.value) { return Promise.resolve() }
                return new Promise((resolve, reject) => {
                    wordPos.value = withTiming((wordPos.value + 1) % sourceWordArr.length, { duration: 0 }, () => {
                        scheduleOnRN(resolve)
                    });
                })

            },

            function () {

                if (!isListPlaying.value) { return Promise.resolve() }

                let resolve;
                let reject;
                const p = new Promise((resolve_, reject_) => {
                    resolve = resolve_; reject = reject_
                })


                setTimeout(check); return p


                function check() {
                    //console.log("in checking", isAllStop())
                    if (!isListPlaying.value) { resolve() }
                    else if (isAllScrollingStop()) {


                        const newY = Math.max(Math.min(scrollY.value + 80, wordPos.value * 80), wordPos.value * 80 - (screenHeight - headHeight) + 80)


                        scrollRef.current._scrollViewRef.scrollTo({ y: newY, animated: true })
                        //scrollRef.current._scrollViewRef.scrollTo({ y: wordPos.value * 80, animated: true })
                        //scrollRef2.current._scrollViewRef.scrollTo({ x: wordPos.value * screenWidth, animated: true })

                        checkAgain()
                        // setTimeout(() => { checkAgain() }, 10);
                    }
                    else {

                        setTimeout(() => { check() }, 10);
                    }
                }





                function checkAgain() {

                    if (!isListPlaying.value) { return resolve() }
                    else if (isAllScrollingStop()) {
                        //     console.log(isAllScrollingStop(), isScrollingX.value, isScrollingY.value, isCardMoving.value)
                        setTimeout(() => {
                            scrollRef2.current._scrollViewRef.scrollTo({ x: wordPos.value * screenWidth, animated: true })

                            resolve()

                        }, 300); //!!! time to delay after Y auto scroll fisnish
                    }
                    else {
                        //    console.log("===---+++++++++++", Date.now())
                        setTimeout(() => {

                            checkAgain()
                        }, 10);
                    }
                }


            },



            function () {
                sentencePlayingIndex.value = 0
                if (!isListPlaying.value) {
                    console.log("auto play stopped, moving X")
                    if (wordPos.value !== scrollX.value / screenWidth) {
                        scrollRef2.current._scrollViewRef.scrollTo({ x: wordPos.value * screenWidth, animated: true })
                    }
                    return Promise.resolve()
                }

                let resolve;
                let reject;
                const p = new Promise((resolve_, reject_) => {
                    resolve = resolve_; reject = reject_
                })
                check(); return p

                function check() {
                    if (!isListPlaying.value) {
                        console.log("auto play stopped, moving X")
                        if (wordPos.value !== scrollX.value / screenWidth) {
                            scrollRef2.current._scrollViewRef.scrollTo({ x: wordPos.value * screenWidth, animated: true })
                        }
                        resolve()
                    }
                    if (isAllScrollingStop()) {
                        setTimeout(() => {
                            autoPlay()
                        }, 0);
                        resolve()
                    }
                    else { setTimeout(() => { check() }, 10); }
                }

            }


        ])

    }, 0, { leading: true, trailing: false })

    return (

        <Context.Provider value={{
            sourceWordArr, setSouceWordArr,
            saveWordToFile,

            wordPos, frameTransY, isListPlaying, scrollRef0, scrollRef, scrollRef2,
            preLeft, preTop, scrollY, scrollX, isPanning,
            isScrollingY, isScrollingX, isCardMoving, isManualDrag,
            refreshState, setRefreshState,
            downloadWord, deleteDownloadWord, deleteWordToFile,
            stopSpeak, checkPlaying, speak,
            sentencePlayingIndex, autoPlay
        }}>

            {props.children}

        </Context.Provider>



    )

}

