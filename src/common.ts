import {Alert} from "react-native"

const server = "http://10.0.0.114:3000"

function showError(err: any) {
    const msg = err?.response?.data ?? err?.toString() ?? "Erro genérico"

    Alert.alert("Ops! Ocorreu um Problema!", `Mensagem: ${msg}`)
}

function showSuccess(msg: string) {
    Alert.alert("Sucesso!", msg)
}

export {server, showError, showSuccess}
