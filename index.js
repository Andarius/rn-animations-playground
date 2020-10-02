import { Navigation } from 'react-native-navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { FirstScreen } from './src/screens'

import App from './App'

const _SCREENS = [
    { name: 'WelcomeScreen', component: App },
    { name: 'FirstScreen', component: FirstScreen }
]

_SCREENS.forEach((v) => {
    Navigation.registerComponent(v.name, () =>
        gestureHandlerRootHOC(v.component)
    )
})

const FIRST_SCREEN = __DEV__ ? 'FirstScreen': 'WelcomeScreen'

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            options: {
                                topBar: { visible: false }
                            },
                            name: FIRST_SCREEN
                        }
                    }
                ]
            }
        }
    })
})
