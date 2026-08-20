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

import { StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, RefreshControl, BackHandler, Alert, Button, Vibration, Keyboard, Modal } from 'react-native';
const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height
import superagent, { options, PATCH, source } from "superagent"
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

import Ajv from "ajv";
import * as Clipboard from "expo-clipboard";








const ajv = new Ajv();

const wordSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            wordName: {
                type: "string"
            },
            meaning: {
                type: "string"
            },
            meaningSound: {
                type: "string"
            },
            createTime: {
                type: "number"
            },
            toppingTime: {
                type: "number"
            },

            exampleEnglishArr: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        key: {
                            type: "string"
                        },
                        sentence: {
                            type: "string"
                        },
                        firstTimeAmount: {
                            type: "number"
                        },
                        secondTimeAmount: {
                            type: "number"
                        }
                    },
                    required: [
                        "key",
                        "sentence",
                        "firstTimeAmount",
                        "secondTimeAmount"
                    ],
                    additionalProperties: false
                }
            },

            exampleChineseArr: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        key: {
                            type: "string"
                        },
                        sentence: {
                            type: "string"
                        },
                        firstTimeAmount: {
                            type: "number"
                        },
                        secondTimeAmount: {
                            type: "number"
                        }
                    },
                    required: [
                        "key",
                        "sentence",
                        "firstTimeAmount",
                        "secondTimeAmount"
                    ],
                    additionalProperties: false
                }
            },

            level: {
                type: "number"
            },

            accent: {
                type: "string",
                enum: ["UK", "US"]
            },

            showChinese: {
                type: "boolean"
            },

            firstTimeAmount: {
                type: "number"
            },

            firstTimeMeaningAmount: {
                type: "number"
            },

            secondTimeAmount: {
                type: "number"
            },

            secondTimeMeaningAmount: {
                type: "number"
            }
        },

        required: [
            "wordName",
            "meaning",
            "meaningSound",
            "createTime",
            "toppingTime",
            "exampleEnglishArr",
            "exampleChineseArr",
            "level",
            //"accent",
            //"showChinese",
            "firstTimeAmount",
            "firstTimeMeaningAmount",
            "secondTimeAmount",
            "secondTimeMeaningAmount"
        ],

        additionalProperties: false
    }
};


const validate = ajv.compile(wordSchema);

//const ok = validate(data);

//console.log(ok);

//if (!ok) {
//  console.log(validate.errors);
//}








export default function ExportFileButton({ allWords, filterLevel, setAllWords,

    formattedText1, formattedText2, localEnableSlice, levelArr


}) {


    const { sourceWordArr, setSouceWordArr, totalWordsNum, scrollRef0, scrollRef, scrollRef2, frameTransY, wordPos, isListPlaying, preLeft, preTop, scrollY, scrollX,
        isPanning, speak, autoPlay, stopSpeak, isScrollingY, isScrollingX, isCardMoving, isManualDrag, shouldHideWordBlock, isNewerstOnTop, setRefreshState,
        selectedLevelArr, smallIndex, largeIndex, enableSlice, wordRepeatingArr, sentenceRepeatingArr, sameAmountWord, sameAmountSentence, exportFileName, isSaving,
        msg, setMsg, saveWordToFile
    } = useContext(Context)
    const navigation = useNavigation()
    const [localFileName, setLocalFileName] = useState(exportFileName.value)
    function loadTextFile() {

        File.pickFileAsync("content://com.android.externalstorage.documents/document/", "text/plain").then(file => {


            //setLocalFileName(file.name)
            const uriSegments = decodeURIComponent(file.name).split('/') || 'document.txt';

            console.log("=============================>>>>>>>>", file.name, uriSegments, file.info())

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
                    exportFileName: localFileName,

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
                exportFileName.value = localFileName;

                arr.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })

                const allWordsFile = new File(Paths.document, "allwords.txt")
                allWordsFile.create({ intermediates: true, overwrite: true })
                allWordsFile.write(JSON.stringify(arr), {})
                wordPos.value = 0
                setSouceWordArr(arr)

            }, 0);



        })


    }


    function loadTextFile2(arr3, arr4) {

        const arr = [...arr3, ...arr4]

        // setTimeout(() => {
        //     navigation.reset({
        //         index: 0,
        //         routes: [
        //             {
        //                 name: 'HomeScreen',
        //                 //  params: { user: 'jane', key: route.params.key },
        //             },

        //         ],
        //     })
        //     setTimeout(() => {
        //         setRefreshState(Math.random())
        //     }, 500);
        // }, 500);
        totalWordsNum.value = arr.length
        navigation.goBack()

        setTimeout(() => {

            formattedText1.value = 0 + ""
            formattedText2.value = Math.max(0, arr3.length, formattedText1.value, formattedText2.value); + ""
            let configObj = {

                isNewerstOnTop: true,
                selectedLevelArr: [true, true, true, true, true, true],
                smallIndex: 0,
                largeIndex: Math.max(0, arr3.length, formattedText1.value, formattedText2.value),
                enableSlice: true,
                exportFileName: localFileName,

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
            largeIndex.value = Math.max(0, arr3.length, formattedText1.value, formattedText2.value);
            enableSlice.value = true;
            exportFileName.value = localFileName;

            arr.sort((word1, word2) => { return word2.toppingTime - word1.toppingTime })

            const allWordsFile = new File(Paths.document, "allwords.txt")
            allWordsFile.create({ intermediates: true, overwrite: true })
            allWordsFile.write(JSON.stringify(arr), {})
            wordPos.value = 0
            setTimeout(() => {
                console.log("lengtyh", arr3.length)
                setSouceWordArr(arr.slice(smallIndex.value, 1 + Math.max(0, arr3.length, formattedText1.value, formattedText2.value)))
                isSaving.value = false
                setRefreshState(Math.random())
            }, 0);

        }, 0);






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

    function vibrate() {
        Vibration.vibrate(50)
    }

    const showConfirmation = () => {
        Alert.alert(
            "Delete all sound",
            "Are you sure you want to delete all sound files?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        isSaving.value = true
                        Paths.document.list().forEach((file, index) => {

                            if ((file.extension === ".mp3") && (file.name.length >= 128)) {

                                file.delete()


                            }


                        })
                        setTimeout(() => {

                            isSaving.value = false
                        }, 100);

                    }
                }
            ]
        );
    };


    return (
        <View style={useAnimatedStyle(() => {

            return {
                flexDirection: "column",
                width: screenWidth,
                height: "auto",
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
                    }} /> 
                */}

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
            <View pointerEvents={"auto"} style={useAnimatedStyle(() => {

                return {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: "transparent",

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

                <Icon name="enter" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "90deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {



                        console.log()
               

                        Clipboard.getStringAsync().then(text => {

                            //  console.log(text)
                            if (!isJsonString(text)) {
                                console.log("json string not valid")
                                Alert.alert("Invalid format", text)
                            }



                            else {

                                console.log("------------------aa------------s-------")



                                let wordArr = JSON.parse(text)

                                if (!validate(wordArr)) {
                                    let errmsg = ""
                                    validate.errors.forEach(err => {
                                        console.log(`Field '${err.instancePath}' ${err.message}`,Date.now());
                                        errmsg = errmsg + err.message + "\n"
                                    });
                                    Alert.alert("Invalid format", errmsg)
                                    return
                                }
                               



                                wordArr = wordArr.map((element, index) => {
                                    const itmeStamp = Date.now() + (wordArr.length - index)
                                    element.toppingTime = itmeStamp
                                    element.createTime = itmeStamp
                                    return element
                                });

                                const file = new File(Paths.document, "allwords.txt")
                                const allWords = JSON.parse(file.textSync())
                                const { array3, array4 } = distributeAndMergeBuckets(wordArr, allWords);
                                isSaving.value = true

                                setTimeout(() => {
                                    loadTextFile2(array3, array4)
                                }, 0);











                            }







                        })

                    }}

                />

            </View>

            <View style={useAnimatedStyle(() => {

                return {
                    marginTop: 16,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: "transparent",
                    paddingBottom: 16

                }

            })}>

                <Icon name="trash" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "0deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {

                        vibrate()
                        showConfirmation()
                    }}
                />



                <Icon name="exit-outline" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "270deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {
                        console.log("aaffff555-----fff")

                        const wordNameArr = sourceWordArr.map(word => {
                            const hashName1 = CryptoJS(word.wordName).toString()
                            return hashName1
                        })


                        const mp3List = []
                        Paths.document.list()
                            .filter(file => { return (file.name.length >= 128 && file.extension === ".mp3") })
                            .forEach((file, index) => {
                                const fileName = file.name.substring(0, 64)
                                if (wordNameArr.includes(fileName)) {
                                    mp3List.push(file)
                                }
                            })


                        if (mp3List.length > 0) {



                            Directory.pickDirectoryAsync("Documents").then(directory => {
                                setMsg(1 + "/" + mp3List.length)
                                const newDirectory = directory.createDirectory(String(localFileName.slice(-4)).toLowerCase() === ".txt"
                                    ? localFileName
                                    : localFileName + ".txt"
                                )


                                function exportMP3(index) {

                                    if (index >= mp3List.length) {
                                        setMsg("")
                                        return isSaving.value = false
                                    }

                                    const file = mp3List[index]
                                    const p = new Promise((resolve, reject) => {
                                        console.log("start exporting", file.name, "---" + index)
                                        const createdFile = newDirectory.createFile(file.name, "audio/mp3");
                                        createdFile.write(file.bytesSync(), { encoding: "utf8" });


                                        resolve()

                                    })
                                    p.then(() => {
                                        setMsg(index + 1 + "/" + mp3List.length)
                                        if ((index + 1 >= mp3List.length)) {

                                            setMsg("")
                                            console.log("exporting all done.")
                                            isSaving.value = false;
                                        }
                                        else {
                                            setTimeout(() => {
                                                exportMP3(index + 1)
                                            }, 0);

                                        }

                                    }).catch((e) => {
                                        setMsg("")
                                        console.log("error --->", e)
                                        isSaving.value = false

                                    })

                                }

                                isSaving.value = true
                                exportMP3(0)


                            }).catch(() => {
                                isSaving.value = false
                            })

                        }


                    }}
                />
                <Icon name="exit" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "270deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {
                        console.log("aaffff555-----fff-----")
                        const wordFile = new File(Paths.document, "allwords.txt")


                        const wordNameArr = JSON.parse(wordFile.textSync()).map(word => {
                            const hashName1 = CryptoJS(word.wordName).toString()
                            return hashName1
                        })







                        const mp3List = []
                        Paths.document.list()

                            .filter(file => { return (file.name.length >= 128 && file.extension === ".mp3") })
                            .forEach((file, index) => {
                                const fileName = file.name.substring(0, 64)
                                if (wordNameArr.includes(fileName)) {
                                    mp3List.push(file)
                                }
                            })

                        if (mp3List.length > 0) {



                            Directory.pickDirectoryAsync("Documents").then(directory => {
                                setMsg(1 + "/" + mp3List.length)
                                const newDirectory = directory.createDirectory(String(localFileName.slice(-4)).toLowerCase() === ".txt"
                                    ? localFileName
                                    : localFileName + ".txt"
                                )


                                function exportMP3(index) {

                                    if (index >= mp3List.length) {
                                        setMsg("")
                                        return isSaving.value = false
                                    }

                                    const file = mp3List[index]
                                    const p = new Promise((resolve, reject) => {
                                        console.log("start exporting", file.name, "---" + index)
                                        const createdFile = newDirectory.createFile(file.name, "audio/mp3");
                                        createdFile.write(file.bytesSync(), { encoding: "utf8" });


                                        resolve()

                                    })
                                    p.then(() => {
                                        setMsg(index + 1 + "/" + mp3List.length)
                                        if ((index + 1 >= mp3List.length)) {

                                            setMsg("")
                                            console.log("exporting all done.")
                                            isSaving.value = false;
                                        }
                                        else {
                                            setTimeout(() => {
                                                exportMP3(index + 1)
                                            }, 0);

                                        }

                                    }).catch((e) => {
                                        setMsg("")
                                        console.log("error --->", e)
                                        isSaving.value = false

                                    })

                                }

                                isSaving.value = true
                                exportMP3(0)


                            }).catch(() => {
                                isSaving.value = false
                            })

                        }


                    }}
                />

                <Icon name="enter-outline" type='ionicon' color='orange'
                    containerStyle={{ width: 40, height: 40, transform: [{ rotateZ: "90deg" }, { translateX: 1 }] }}
                    size={40}
                    onPress={(e) => {



                        let mp3List_ = []
                        Paths.document.list()
                            .filter(file => { return (file.name.length >= 128 && file.extension === ".mp3") })
                            .forEach((file, index) => { mp3List_.push(file.name) })


                        Directory.pickDirectoryAsync("Documents").then(directory => {


                            const mp3List = directory.list().filter(file => { return (file.name.length >= 128 && file.extension === ".mp3" && !mp3List_.includes(file.name)) })

                            if (mp3List.length > 0) {
                                isSaving.value = true

                            }


                            function importMP3(index) {
                                if (index >= mp3List.length) {
                                    setMsg("")
                                    return isSaving.value = false
                                }
                                const file = mp3List[index]
                                const p = new Promise((resolve, reject) => {
                                    console.log("start importing", file.name, "---" + index, mp3List.length)

                                    const mp3File = new File(Paths.document, file.name)
                                    mp3File.create({ intermediates: true, overwrite: true })
                                    mp3File.write(file.bytesSync(), { encoding: "utf8" })

                                    resolve()
                                })
                                p.then(() => {
                                    setMsg(index + 1 + "/" + mp3List.length)
                                    if ((index + 1 >= mp3List.length)) {

                                        setMsg("")
                                        console.log("importing all done.")
                                        isSaving.value = false;
                                    }
                                    else {
                                        setTimeout(() => {
                                            importMP3(index + 1)
                                        }, 0);

                                    }

                                }).catch((e) => {
                                    setMsg("")
                                    console.log("error --->", e)
                                    isSaving.value = false
                                })

                            }
                            importMP3(0)

                        }).catch(() => {
                            isSaving.value = false
                        })

                    }}

                />




            </View>

            {/* <View style={useAnimatedStyle(() => {

                return {
                    marginTop: 16,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: "lightblue",

                }

            })}>


            </View> */}



            {/* <Button title="delete" onPress={e => {
                console.log("fdsfsa")
                Paths.document.list().forEach((file, index) => {

                    if ((file.extension === ".mp3") && (file.name.length >= 128)) {

                        file.delete()


                    }


                })
            }} /> */}
        </View>

    )


}







//import React, { useState, useEffect } from 'react';
//import { Modal, Text, View, Button } from 'react-native';

function CustomAlert() {
    const [visible, setVisible] = useState(false);

    // Example: Programmatically close the modal after 3 seconds
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Trigger Alert" onPress={() => setVisible(true)} />

            <Modal visible={visible} transparent={true} animationType="fade">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text>This alert will close automatically.</Text>
                        <Button title="Close Manually" onPress={() => setVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}





function isJsonString(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}






function distributeAndMergeBuckets(arr1, arr2) {
    const array3 = [];

    // Deep clone elements of arr1 to prevent altering parameters outside the function
    const cleanArr1 = JSON.parse(JSON.stringify(arr1));

    cleanArr1.forEach(item1 => {
        // Search for the matching index inside arr2
        const matchIdx = arr2.findIndex(item2 => item2.wordName === item1.wordName);

        if (matchIdx === -1) {
            // SCENARIO 1: Word does not exist in arr2 -> Push straight to array3
            array3.push(item1);
        } else {
            // SCENARIO 2: Word matches in arr2 -> Splice and extract it completely out of arr2
            const matchedTarget = arr2.splice(matchIdx, 1)[0];

            // Sync the toppingTime milestone
            if (item1.toppingTime !== undefined) {
                matchedTarget.toppingTime = item1.toppingTime;
            }

            matchedTarget.exampleEnglishArr = matchedTarget.exampleEnglishArr || [];
            matchedTarget.exampleChineseArr = matchedTarget.exampleChineseArr || [];

            // Create tracking Set based on the text values already registered in arr2
            const existingEnglishTexts = new Set(matchedTarget.exampleEnglishArr.map(e => e.sentence));

            const engArr1 = item1.exampleEnglishArr || [];
            const chnArr1 = item1.exampleChineseArr || [];

            // Pairwise index loop for structural text deduplication
            engArr1.forEach((engObj, idx) => {
                if (!existingEnglishTexts.has(engObj.sentence)) {
                    existingEnglishTexts.add(engObj.sentence);

                    matchedTarget.exampleEnglishArr.push(engObj);
                    if (chnArr1[idx]) {
                        matchedTarget.exampleChineseArr.push(chnArr1[idx]);
                    }
                }
            });

            // Route the fully synchronized record directly into array3
            array3.push(matchedTarget);
        }
    });

    // Sort array3 by toppingTime descending (largest/newest timestamps first)
    array3.sort((a, b) => (b.toppingTime || 0) - (a.toppingTime || 0));

    // array4 represents the leftover elements that were never extracted/touched inside arr2
    const array4 = arr2;

    return { array3, array4 };
}

