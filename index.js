import { Navigation } from 'react-native-navigation'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

import App from './App'

const SCREENS = [
    {name: 'WelcomeScreen', component: App}
]

SCREENS.forEach((v) => {
    Navigation.registerComponent(v.name, () =>  gestureHandlerRootHOC(v.component))
})

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            options: {
                                topBar: { visible: false}
                            },
                            name: 'WelcomeScreen'
                        }
                        
                    }
                ]
            }
        }
    })
})