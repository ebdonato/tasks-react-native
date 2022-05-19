import {useState} from "react"
import {
    StyleSheet,
    View,
    Modal,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    Platform,
} from "react-native"

import DateTimePicker from "@react-native-community/datetimepicker"
import {commonStyles} from "../commonStyles"

import moment from "moment"
import "moment/locale/pt-br"

interface Props {
    isVisible: boolean
    onCancel: () => void
    onSave: (desc: string, estimateAt: Date) => void
}

export function AddTask({isVisible, onCancel, onSave}: Props) {
    const [desc, setDesc] = useState("")
    const [date, setDate] = useState<Date>(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    const getDatePicker = () => {
        const datePicker = (
            <DateTimePicker
                mode="date"
                value={date}
                is24Hour={true}
                onChange={(_, newDate) => {
                    setDate(newDate || new Date())
                    setShowDatePicker(false)
                }}
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={-180}
            />
        )

        const dateString = moment(date).format("dddd, D [de] MMMM [de] YYYY")

        return Platform.OS !== "ios" ? (
            <View>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.date}>{dateString}</Text>
                </TouchableOpacity>
                {showDatePicker && datePicker}
            </View>
        ) : (
            datePicker
        )
    }

    const saveTask = () => {
        onSave(desc, date)
        setDate(new Date())
        setDesc("")
    }

    return (
        <Modal transparent visible={isVisible} onRequestClose={onCancel} animationType="slide">
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}></View>
            </TouchableWithoutFeedback>
            <View style={styles.container}>
                <Text style={styles.header}>Nova Tarefa</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Informe a Descrição..."
                    onChangeText={(desc) => setDesc(desc)}
                    value={desc}
                />
                {getDatePicker()}
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={styles.button}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveTask}>
                        <Text style={styles.button}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}></View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },

    container: {
        backgroundColor: "#FFF",
    },

    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.primary.today,
        color: commonStyles.colors.secondary,
        textAlign: "center",
        padding: 15,
        fontSize: 18,
    },

    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#E3E3E3",
        borderRadius: 6,
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.primary.today,
    },

    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15,
    },
})
