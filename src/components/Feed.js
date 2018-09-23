import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  FlatList,
  SafeAreaView,
  AsyncStorage,
  ScrollView
} from 'react-native';
import { goToAuth } from "../config/navigation";
import { Navigation } from 'react-native-navigation';

import Post from './Post';
import Login from './Login';
import FetchService from '../services/FetchService';
import Notificacao from '../api/Notificacao';
import HeaderUsuario from './HeaderUsuario';

export default class Feed extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'Feed',
          alignment: 'center'
        },
        rightButtons: [{
          id: 'SignOut',
          text: 'Sair',
          enabled: true
        }],
      }
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
    this.state = {
      fotos: []
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId == 'SignOut')
      this.logout();
  }

  componentDidAppear() {
    this.load();
  }
  componentDidMount() {
    /*this.props.navigator.setOnNavigatorEvent(evento => {
      if (evento.id === 'willApper')
        this.load();
    })*/ //V1

    //V2, just add componentDidApper.

    //Original
    //this.load();
  }

  load() {
    let uri = "/fotos";

    if (this.props.usuario)
      uri = `/public/fotos/${this.props.usuario}`;

    FetchService.get('/fotos')
      .then(json => this.setState({ fotos: json, status: 'NORMAL' }))
      .catch(e => this.setState({ status: 'FALHA_CARREGAMENTO' }));
  }

  buscaPorId(idFoto) {
    return this.state.fotos.find(foto => foto.id === idFoto)
  }

  atualizaFotos(fotoAtualizada) {
    const fotos = this.state.fotos
      .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto)

    this.setState({ fotos })
  }

  like(idFoto) {
    const listaOriginal = this.state.fotos;
    const foto = this.buscaPorId(idFoto);

    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {

        let novaLista = []
        if (!foto.likeada) {
          novaLista = [
            ...foto.likers,
            { login: usuarioLogado }
          ]
        } else {
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado
          })
        }
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novaLista
        }

        this.atualizaFotos(fotoAtualizada);
      })

    FetchService.post(`/fotos/${idFoto}/like`)
      .catch(e => {
        this.setState({ fotos: listaOriginal })
        Notificacao.exibe('Ops...', 'Algo deu errado!');
      });
  }

  adicionaComentario(idFoto, valorComentario, inputComentario) {
    if (valorComentario === '')
      return;

    const foto = this.buscaPorId(idFoto);

    const comentario = {
      texto: valorComentario
    }

    FetchService.post(`/fotos/${idFoto}/comment`, comentario)
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista
        }

        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      })
      .catch(e => Notificacao.exibe('Ops...', 'Não foi possível adicionar um novo comentário.'));
  }

  logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      goToAuth()
    } catch (err) {
      console.log('error signing out...: ', err)
    }
  }

  verPerfilUsuario(idFoto) {

    const foto = this.buscaPorId(idFoto);
    Navigation.push(this.props.componentId, {
      component: {
        name: 'PerfilUsuario',
        passProps: {
          usuario: foto.loginUsuario,
          fotoDePerfil: foto.urlPerfil,
        },
        options: {
          topBar: {
            title: {
              text: foto.loginUsuario
            }
          }
        }
      }
    });
  }

  exibeHeader() {
    if (this.props.usuario) {
      return <HeaderUsuario {...this.props} posts={this.state.fotos.length} />
    }
  }

  render() {
    if (this.state.status === 'FALHA_CARREGAMENTO')
      return (
        <TouchableOpacity style={styles.container} onPress={this.carrega.load(this)}>
          <Text style={[styles.texto, styles.title]}>Ops...</Text>
          <Text style={styles.texto}>Toque para tentar novamente</Text>
        </TouchableOpacity>
      );

    return (
      <ScrollView>
        {this.exibeHeader()}
        <FlatList style={styles.container}
          keyExtractor={item => `${item.id}`}
          data={this.state.fotos}
          renderItem={({ item, index }) =>
            <Post foto={item}
              likeCallback={this.like.bind(this)}
              comentarioCallback={this.adicionaComentario.bind(this)}
              verPerfilCallBack={this.verPerfilUsuario.bind(this)} />
          }
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  }
});