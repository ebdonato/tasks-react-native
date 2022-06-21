import {StyleProp, StyleSheet, Text, TextInput, View, ViewStyle} from "react-native"
import Icon from "@expo/vector-icons/FontAwesome"

interface Props {
    icon: keyof typeof Icon.glyphMap
    value: string
    placeholder: string
    onChangeText: (text: string) => void
    secureTextEntry?: boolean
    style: StyleProp<ViewStyle>
    onBlur: () => void
    errorMessage: string | undefined
}

export function AuthInput({
    icon,
    placeholder,
    onChangeText,
    secureTextEntry = false,
    style,
    value,
    onBlur,
    errorMessage,
}: Props) {
    return (
        <View>
            <View style={[styles.container, style]}>
                <Icon name={icon} size={20} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    secureTextEntry={secureTextEntry}
                />
            </View>
            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 40,
        backgroundColor: "#EEE",
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    icon: {
        color: "#333",
        marginLeft: 20,
    },

    input: {
        marginLeft: 20,
        width: "70%",
    },

    errorMessage: {
        color: "red",
        paddingTop: 3,
        paddingLeft: 20,
    },
})
