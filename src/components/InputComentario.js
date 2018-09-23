import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native';

const width = Dimensions.get('screen').width;

export default class InputComentario extends Component {
    constructor() {
        super();
        this.state = {
            valorComentario: ''
        }
    }

    render() {
        return (
            <View style={styles.novoComentario}>
                <TextInput style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Adicione um comentário..."
                    ref={input => { this.inputComentario = input }}
                    value={this.state.valorComentario}
                    onChangeText={texto => this.setState({ valorComentario: texto })}
                />

                <TouchableOpacity onPress={() => {
                    this.props.comentarioCallback(this.props.idFoto, this.state.valorComentario, this.inputComentario),
                        this.setState({ valorComentario: '' })
                }}>
                    <Image style={styles.icone}
                        source={require('../images/send.png')} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    novoComentario: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    input: {
        flex: 1,
        height: 40,
    },
    icone: {
        width: 30,
        height: 30
    }
});