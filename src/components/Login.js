import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Button,
    AsyncStorage,
    Platform
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { goFeed } from "../config/navigation";
const width = Dimensions.get('screen').width;

export default class Login extends Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Login',
                    alignment: 'center'
                }
            }
        };
    }

    constructor() {
        super();
        this.state = {
            usuario: '',
            senha: '',
            mensagem: ''
        }
    }

    efetuaLogin() {
        const uri = Platform.select({
            ios: 'http://localhost:8080/api/public/login',
            android: 'http://10.0.2.2:8080/api/public/login'
            //'http://192.168.0.114:8080/api/public/login'
        });

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({
                login: this.state.usuario,
                senha: this.state.senha,
            }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }

        fetch(uri, requestInfo)
            .then(response => {
                if (response.ok)
                    return response.text();

                throw new Error("Não foi possível efetuar login")
            })
            .then(token => {
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('usuario', this.state.usuario);
                //Com Navigation ele avanca a tela e coloca automaticamente botao voltar pra tela anterior
                // Navigation.push(this.props.componentId, {
                //     component: {
                //         name: 'Feed',
                //         title: 'Feed'
                //     }
                // });
                goFeed() //Muda para tela de Feed sem botao voltar
            })
            .catch(e => { this.setState({ mensagem: e.message }), console.log(e) })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Instalura</Text>
                <View style={styles.form}>
                    <TextInput style={styles.input}
                        placeholder="Usuário..."
                        onChangeText={texto => this.setState({ usuario: texto })}
                        autoCapitalize="none" />

                    <TextInput style={styles.input}
                        placeholder="Senha..."
                        onChangeText={texto => this.setState({ senha: texto })}
                        secureTextEntry={true} />

                    <Button title="Login" onPress={this.efetuaLogin.bind(this)} />
                </View>
                <Text style={styles.mensagem}>
                    {this.state.mensagem}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: 26,
    },
    form: {
        width: width * 0.8
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    mensagem: {
        marginTop: 15,
        color: '#e74c3c'
    }
});