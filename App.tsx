import {StatusBar} from "expo-status-bar"
import {SafeAreaView, StyleSheet} from "react-native"
import {useFonts} from "expo-font"

import {TaskList} from "./src/screens/TaskList"

export default function App() {
    const [loaded] = useFonts({
        Lato: require("./src/assets/Lato.ttf"),
    })

    if (!loaded) {
        return null
    }

    return (
        <SafeAreaView style={styles.container}>
            <TaskList />
            <StatusBar style="light" backgroundColor="transparent" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
