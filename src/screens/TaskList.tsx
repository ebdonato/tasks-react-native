import {useEffect, useState} from "react"
import {StatusBar} from "expo-status-bar"
import {StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, Platform, Alert} from "react-native"

import {useNavigation} from "@react-navigation/native"

import Icon from "@expo/vector-icons/FontAwesome"

import AsyncStorage from "@react-native-async-storage/async-storage"

import {server, showError} from "../common"
import axios from "axios"

import moment from "moment"
import "moment/locale/pt-br"

import todayImage from "../assets/today.jpg"
import tomorrowImage from "../assets/tomorrow.jpg"
import monthImage from "../assets/month.jpg"
import weekImage from "../assets/week.jpg"
import {commonStyles} from "../commonStyles"

import {Task} from "../components/Task"
import {AddTask} from "../screens/AddTask"

interface Task {
    id: number
    desc: string
    estimateAt: Date
    doneAt?: Date | null
}

interface RenderItemProps {
    item: Task
}

interface Props {
    title: string
    daysAhead: number
}

export function TaskList({title, daysAhead}: Props) {
    const navigation = useNavigation()

    const [tasks, setTasks] = useState<Task[]>([])
    const [showDoneTasks, setShowDoneTasks] = useState(true)
    const [showAddTask, setShowAddTask] = useState(false)

    async function loadTasks() {
        const maxDate = moment().add({day: daysAhead}).utc().format()
        const result = await axios.get<Task[]>(`${server}/tasks?date=${maxDate}`)

        setTasks(result.data)
    }

    useEffect(() => {
        async function restoreConfigs() {
            const userConfigs = await AsyncStorage.getItem("userConfigs")
            const {showDoneTasks} = JSON.parse(userConfigs || "{}")

            setShowDoneTasks(showDoneTasks)
        }

        restoreConfigs()

        try {
            loadTasks()
        } catch (error) {
            showError(error)
        }
    }, [])

    useEffect(() => {
        AsyncStorage.setItem("userConfigs", JSON.stringify({showDoneTasks}))
    }, [showDoneTasks])

    const today = moment().locale("pt-br").format("ddd, D [de] MMMM")

    const filteredTasks = [...tasks.filter((task) => !task.doneAt || showDoneTasks)]

    const renderItem = ({item}: RenderItemProps) => <Task {...item} onToggleTask={onToggleTask} onDelete={onDelete} />

    const onToggleTask = async (id: number) => {
        try {
            await axios.put(`${server}/tasks/${id}/toggle`)
            await loadTasks()
        } catch (error) {
            showError(error)
        }
    }

    const onToggleFilter = () => {
        setShowDoneTasks((previous) => !previous)
    }

    const onSave = async (desc: string, estimateAt: Date) => {
        if (!desc || !desc.trim()) {
            Alert.alert("Dados Inválidos", "Descrição não informada!")
            return
        }

        try {
            await axios.post(`${server}/tasks`, {
                desc,
                estimateAt,
            })

            await loadTasks()

            setShowAddTask(false)
        } catch (error) {
            showError(error)
        }
    }

    const onDelete = async (id: number) => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            await loadTasks()
        } catch (error) {
            showError(error)
        }
    }

    const getImage = () => {
        switch (daysAhead) {
            case 0:
                return todayImage
            case 1:
                return tomorrowImage
            case 7:
                return weekImage
            default:
                return monthImage
        }
    }

    const getColor = () => {
        switch (daysAhead) {
            case 0:
                return commonStyles.colors.primary.today
            case 1:
                return commonStyles.colors.primary.tomorrow
            case 7:
                return commonStyles.colors.primary.week
            default:
                return commonStyles.colors.primary.month
        }
    }

    return (
        <View style={styles.container}>
            <AddTask isVisible={showAddTask} onCancel={() => setShowAddTask(false)} onSave={onSave} />
            <ImageBackground source={getImage()} style={styles.background} resizeMode="cover">
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon name="bars" size={20} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onToggleFilter}>
                        <Icon
                            name={showDoneTasks ? "eye" : "eye-slash"}
                            size={20}
                            color={commonStyles.colors.secondary}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subTitle}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.taskContainer}>
                <FlatList data={filteredTasks} keyExtractor={(item) => `${item.id}`} renderItem={renderItem} />
            </View>
            <TouchableOpacity
                style={[styles.addButton, {backgroundColor: getColor()}]}
                onPress={() => setShowAddTask(true)}
                activeOpacity={0.7}
            >
                <Icon name="plus" size={30} color={commonStyles.colors.secondary} style={{paddingLeft: 3}} />
            </TouchableOpacity>
            <StatusBar style="light" backgroundColor="transparent" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    taskContainer: {
        flex: 7,
    },

    background: {
        flex: 3,
    },

    titleBar: {
        flex: 1,
        justifyContent: "flex-end",
    },

    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },

    subTitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },

    iconBar: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: Platform.OS === "android" ? 40 : 10,
        justifyContent: "space-between",
    },

    addButton: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 60,
        height: 60,
        padding: 15,
        borderRadius: 30,
        justifyContent: "center",
        alignContent: "center",
    },
})
