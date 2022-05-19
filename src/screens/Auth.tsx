import {useState} from "react"
import {StyleSheet, Text, ImageBackground, View, TouchableOpacity, ActivityIndicator} from "react-native"
import {useNavigation} from "@react-navigation/native"

import backgroundImage from "../assets/login.jpg"
import {commonStyles} from "../commonStyles"
import {AuthInput} from "../components/AuthInput"

import {server, showError, showSuccess} from "../common"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

import {useForm, Controller} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"

const SignInSchema = yup
    .object({
        email: yup.string().email("E-mail inválido").required("Campo Obrigatório"),
        password: yup.string().required("Campo Obrigatório"),
    })
    .required()

const SignUpSchema = yup
    .object({
        name: yup.string().required("Campo Obrigatório"),
        email: yup.string().email("E-mail inválido").required("Campo Obrigatório"),
        password: yup.string().min(6, "Mínimo de 6 caracteres").required("Campo Obrigatório"),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Senha e Confirmação não batem"),
    })
    .required()

interface FormData {
    email: string
    password: string
    name: string
    confirmPassword: string
}

export function Auth() {
    const navigation = useNavigation()

    const [stageNew, setStageNew] = useState(false)

    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(stageNew ? SignUpSchema : SignInSchema),
    })

    const signUp = async (data: FormData) => {
        const {name, email, password, confirmPassword} = data

        try {
            await axios.post(`${server}/signUp`, {
                name,
                email,
                password,
                confirmPassword,
            })

            showSuccess("Usuário cadastrado")
            setStageNew(false)
        } catch (error) {
            showError(error)
        }
    }

    const signIn = async (data: FormData) => {
        const {email, password} = data

        try {
            const response = await axios.post(`${server}/signIn`, {
                email,
                password,
            })

            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
            AsyncStorage.setItem("userData", JSON.stringify({user: response.data}))
            navigation.navigate("Home", response.data)
        } catch (error) {
            showError(error)
        }
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <Text style={styles.title}>Tasks</Text>
            <View style={styles.formContainer}>
                <View>
                    <Text style={styles.subTitle}>{stageNew ? "Crie sua conta" : "Informe seus dados"}</Text>
                </View>
                {stageNew && (
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <AuthInput
                                icon="user"
                                style={styles.input}
                                placeholder="Nome"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorMessage={errors.name?.message}
                            />
                        )}
                        name="name"
                    />
                )}

                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <AuthInput
                            icon="at"
                            style={styles.input}
                            placeholder="E-mail"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.email?.message}
                        />
                    )}
                    name="email"
                />

                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <AuthInput
                            icon="lock"
                            style={styles.input}
                            placeholder="Senha"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={true}
                            errorMessage={errors.password?.message}
                        />
                    )}
                    name="password"
                />

                {stageNew && (
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <AuthInput
                                icon="asterisk"
                                style={styles.input}
                                placeholder="Confirmação de Senha"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry={true}
                                errorMessage={errors.confirmPassword?.message}
                            />
                        )}
                        name="confirmPassword"
                    />
                )}
                <TouchableOpacity
                    style={[styles.button, isSubmitting ? {backgroundColor: "#aaa"} : {}]}
                    onPress={handleSubmit(stageNew ? signUp : signIn)}
                    disabled={isSubmitting}
                >
                    <View>
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>{stageNew ? "Registrar" : "Entrar"}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{padding: 10}} onPress={() => setStageNew((previous) => !previous)}>
                <Text style={styles.buttonText}>{stageNew ? "Já possui conta?" : "Ainda não possui conta?"}</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10,
    },

    subTitle: {
        fontFamily: commonStyles.fontFamily,
        color: "#fff",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 10,
    },

    formContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 20,
        width: "90%",
        borderRadius: 7,
    },

    input: {
        marginTop: 10,
        backgroundColor: "#FFF",
        padding: 10,
    },

    button: {
        backgroundColor: "#080",
        marginTop: 10,
        padding: 10,
        alignItems: "center",
        borderRadius: 7,
    },

    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: "#FFF",
        fontSize: 20,
    },
})
