import { Colors } from '@src/theme'
import React, { useRef } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import {
    Navigation,
    NavigationFunctionComponent as RNNFC,
    OptionsModalPresentationStyle
} from 'react-native-navigation'
import { ModalBottomContainer } from './ModalBottomContainer'

const HEIGHT = 150

const styles = StyleSheet.create({
    textInput: {
        fontSize: 20,
        color: Colors.primary
    }
})

export type Props = {
    autoFocus: boolean
}

const ModalScreen: RNNFC<Props> = function ({ componentId, autoFocus }) {
    const textRef = useRef<TextInput>(null)

    const _dimissModal = () => {
        Navigation.dismissModal(componentId)
    }

    const onDisplayed = () => {
        if (autoFocus && textRef.current) {
            textRef.current.focus()
        }
    }

    return (
        <ModalBottomContainer
            height={HEIGHT}
            onDone={_dimissModal}
            onDisplayed={onDisplayed}>
            <TextInput
                ref={textRef}
                autoFocus={Platform.select({
                    android: autoFocus,
                    ios: false
                })}
                style={styles.textInput}
                placeholder="Enter"
            />
        </ModalBottomContainer>
    )
}

ModalScreen.options = {
    layout: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        componentBackgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    animations: {
        push: {
            waitForRender: false
        },
        showModal: {
            alpha: {
                from: 0,
                to: 1,
                duration: 200
            }
        },
        dismissModal: {
            alpha: {
                from: 1,
                to: 0,
                duration: 200
            }
        }
    },
    modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext
}

export { ModalScreen }
