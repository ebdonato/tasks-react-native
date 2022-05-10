import {useEffect, useState} from "react"
import {StatusBar} from "expo-status-bar"
import {StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, Platform, Alert} from "react-native"

import Icon from "@expo/vector-icons/FontAwesome"

import AsyncStorage from "@react-native-async-storage/async-storage"

import moment from "moment"
import "moment/locale/pt-br"

import todayImage from "../assets/today.jpg"
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

export function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [showDoneTasks, setShowDoneTasks] = useState(true)
    const [showAddTask, setShowAddTask] = useState(false)

    useEffect(() => {
        async function restoreTasks() {
            const tasksString = await AsyncStorage.getItem("tasksState")
            const newTasks = JSON.parse(tasksString || "[]")
            setTasks(newTasks)
        }

        restoreTasks()
    }, [])

    useEffect(() => {
        AsyncStorage.setItem("tasksState", JSON.stringify(tasks))
    }, [tasks])

    const today = moment().locale("pt-br").format("ddd, D [de] MMMM")

    const filteredTasks = [...tasks.filter((task) => !task.doneAt || showDoneTasks)]

    const renderItem = ({item}: RenderItemProps) => <Task {...item} onToggleTask={onToggleTask} onDelete={onDelete} />

    const onToggleTask = (id: number) => {
        const newTasks = [...tasks]
        newTasks.forEach((task) => {
            if (task.id === id) {
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        setTasks(newTasks)
    }

    const onToggleFilter = () => {
        setShowDoneTasks((previous) => !previous)
    }

    const onSave = (desc: string, estimateAt: Date) => {
        if (!desc || !desc.trim()) {
            Alert.alert("Dados Inválidos", "Descrição não informada!")
            return
        }

        setTasks((previous) => [
            ...previous,
            {
                id: Math.random(),
                desc,
                estimateAt,
            },
        ])

        setShowAddTask(false)
    }

    const onDelete = (id: number) => {
        const newTasks = tasks.filter((task) => task.id !== id)
        setTasks(newTasks)
    }

    return (
        <View style={styles.container}>
            <AddTask isVisible={showAddTask} onCancel={() => setShowAddTask(false)} onSave={onSave} />
            <ImageBackground source={todayImage} style={styles.background} resizeMode="cover">
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={onToggleFilter}>
                        <Icon
                            name={showDoneTasks ? "eye" : "eye-slash"}
                            size={20}
                            color={commonStyles.colors.secondary}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>Hoje</Text>
                    <Text style={styles.subTitle}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.taskContainer}>
                <FlatList data={filteredTasks} keyExtractor={(item) => `${item.id}`} renderItem={renderItem} />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddTask(true)} activeOpacity={0.7}>
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
        justifyContent: "flex-end",
    },

    addButton: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 60,
        height: 60,
        padding: 15,
        borderRadius: 30,
        backgroundColor: commonStyles.colors.primary.today,
        justifyContent: "center",
        alignContent: "center",
    },
})
