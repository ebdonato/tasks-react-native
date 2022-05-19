import {DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps} from "@react-navigation/drawer"

import {StyleSheet, View, Text, Platform, TouchableOpacity} from "react-native"
import Icon from "@expo/vector-icons/FontAwesome"

import {Gravatar} from "react-native-gravatar"
import {commonStyles} from "../commonStyles"

import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Props extends DrawerContentComponentProps {
    email: string
    name: string
}

export function CustomDrawerContent(props: Props) {
    const logout = () => {
        delete axios.defaults.headers.common["Authorization"]
        AsyncStorage.removeItem("userData")
        props.navigation.navigate("AuthOrApp")
    }

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <Gravatar
                    style={styles.avatar}
                    options={{
                        email: props.email,
                        secure: true,
                    }}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{props.name}</Text>
                    <Text style={styles.email}>{props.email}</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <View style={styles.logoutIcon}>
                        <Icon name="sign-out" size={30} color="#800" />
                    </View>
                </TouchableOpacity>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: "#DDD",
    },

    title: {
        color: "#000",
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        paddingTop: Platform.OS === "ios" ? 70 : 30,
        padding: 10,
    },

    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,
        backgroundColor: "#222",
    },

    userInfo: {
        marginLeft: 10,
    },

    name: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: commonStyles.colors.mainText,
        marginBottom: 5,
    },

    email: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom: 10,
    },

    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10,
    },
})
