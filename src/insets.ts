import { NativeModules } from 'react-native'

type Insets = { bottom: number; top: number; left: number; right: number }

interface IInsetsUtils {
    getInsets: () => Insets
}

const InsetUtils = NativeModules.InsetUtils as IInsetsUtils

export { InsetUtils }
