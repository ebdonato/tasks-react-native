import {useEffect} from "react"

import {View, ActivityIndicator, StyleSheet} from "react-native"

import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {useNavigation, useIsFocused} from "@react-navigation/native"

export function AuthOrApp() {
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    useEffect(() => {
        async function restoreUserData() {
            const userData = await AsyncStorage.getItem("userData")
            const {user} = JSON.parse(userData || "{}")

            if (user?.token) {
                axios.defaults.headers.common["Authorization"] = `bearer ${user.token}`
                navigation.navigate("Home", user)
            } else {
                navigation.navigate("Auth")
            }
        }

        restoreUserData()
    }, [isFocused])

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
})
