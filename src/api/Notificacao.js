import { Alert } from 'react-native';

export default class Notificacao {
  static exibe(titulo, mensagem) {
    Alert.alert(titulo, mensagem);
  }
}