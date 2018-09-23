import { Navigation } from 'react-native-navigation'

export const goToAuth = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'Login',
            title: 'Login'
          }
        }
      ],
    }
  }
});

export const goFeed = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'Feed',
      children: [
        {
          component: {
            name: 'Feed',
            title: 'Feed'
          }
        }
      ],
    }
  }
});