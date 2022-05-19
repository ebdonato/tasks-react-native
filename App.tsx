import "react-native-gesture-handler"

import {StatusBar} from "expo-status-bar"
import {useFonts} from "expo-font"

import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack"
import {createDrawerNavigator} from "@react-navigation/drawer"

import {TaskList} from "./src/screens/TaskList"
import {Auth} from "./src/screens/Auth"
import {commonStyles} from "./src/commonStyles"
import {CustomDrawerContent} from "./src/components/CustomDrawerContent"
import {AuthOrApp} from "./src/screens/AurhOrApp"

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function MainDrawer({route}) {
    return (
        <Drawer.Navigator
            initialRouteName="Hoje"
            screenOptions={{
                headerShown: false,
                drawerLabelStyle: {
                    fontFamily: commonStyles.fontFamily,
                    fontWeight: "normal",
                    fontSize: 20,
                },
                drawerActiveTintColor: "#080",
            }}
            drawerContent={(props) => (
                <CustomDrawerContent {...props} email={route.params.email} name={route.params.name} />
            )}
        >
            <Drawer.Screen name="Hoje" options={{drawerLabel: "Hoje"}}>
                {() => <TaskList title="Hoje" daysAhead={0} />}
            </Drawer.Screen>
            <Drawer.Screen name="Amanhã" options={{drawerLabel: "Amanhã"}}>
                {() => <TaskList title="Amanhã" daysAhead={1} />}
            </Drawer.Screen>
            <Drawer.Screen name="Semana" options={{drawerLabel: "Semana"}}>
                {() => <TaskList title="Semana" daysAhead={7} />}
            </Drawer.Screen>
            <Drawer.Screen name="Mês" options={{drawerLabel: "Mês"}}>
                {() => <TaskList title="Mês" daysAhead={30} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    )
}

function MainStack() {
    return (
        <Stack.Navigator
            initialRouteName="AuthOrApp"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="AuthOrApp" component={AuthOrApp} />
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Home" component={MainDrawer} />
        </Stack.Navigator>
    )
}

export default function App() {
    const [loaded] = useFonts({
        Lato: require("./src/assets/Lato.ttf"),
    })

    if (!loaded) {
        return null
    }

    return (
        <NavigationContainer>
            <MainStack />
            <StatusBar style="light" backgroundColor="transparent" />
        </NavigationContainer>
    )
}
