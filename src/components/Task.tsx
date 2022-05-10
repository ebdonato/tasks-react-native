import React from "react"
import {StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity} from "react-native"
import Icon from "@expo/vector-icons/FontAwesome"
import Swipeable from "react-native-gesture-handler/Swipeable"
import {GestureHandlerRootView} from "react-native-gesture-handler"

import moment from "moment"
import "moment/locale/pt-br"

import {commonStyles} from "../commonStyles"

interface Props {
    id: number
    desc: string
    estimateAt: Date
    doneAt?: Date | null
    onToggleTask: (id: number) => void
    onDelete: (id: number) => void
}

function getCheckView(doneAt: Date | null) {
    if (doneAt != null) {
        return (
            <View style={styles.done}>
                <Icon name="check" size={20} color="#FFF" />
            </View>
        )
    } else {
        return <View style={styles.pending}></View>
    }
}

export function Task({id, desc, estimateAt, doneAt = null, onToggleTask, onDelete}: Props) {
    const showDate = moment(doneAt ?? estimateAt)
        .locale("pt-br")
        .format("ddd, D [de] MMMM")

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right} onPress={() => onDelete(id)}>
                <Icon name="trash" size={30} color="#FFF" />
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name="trash" size={30} color="#FFF" style={styles.excludeIcon} />
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={getRightContent}
                renderLeftActions={getLeftContent}
                onSwipeableLeftOpen={() => onDelete(id)}
            >
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => onToggleTask(id)}>
                        <View style={styles.checkContainer}>{getCheckView(doneAt)}</View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={[styles.desc, doneAt ? styles.descDone : {}]}>{desc}</Text>
                        <Text style={styles.date}>{showDate}</Text>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderColor: "#AAA",
        borderWidth: 1,
        borderTopWidth: 0,
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "#FFF",
    },

    checkContainer: {
        width: "20%",
        alignItems: "center",
        justifyContent: "center",
    },

    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#555",
    },

    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        backgroundColor: "#4D7031",
        alignItems: "center",
        justifyContent: "center",
    },

    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15,
    },

    descDone: {
        textDecorationLine: "line-through",
    },

    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12,
    },

    right: {
        backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },

    left: {
        flex: 1,
        backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center",
    },

    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: "#FFF",
        fontSize: 20,
        margin: 10,
    },

    excludeIcon: {
        marginLeft: 10,
    },
})
