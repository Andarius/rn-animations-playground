package com.rnanimationsplayground.cutouts
import android.os.Build
import android.view.DisplayCutout
import com.facebook.react.bridge.*

class CutoutsUtils(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "InsetUtils"

    override fun getConstants(): MutableMap<String, Any> {
        return HashMap()
    }

    private fun getInsetsMap(): HashMap<String, Int> {
        val insets: HashMap<String, Int> = hashMapOf(
            "bottom" to 0,
            "top" to 0,
            "left" to 0,
            "right" to 0
        )
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R)
            return insets

        val cutout: DisplayCutout = currentActivity?.display?.cutout ?: return insets

        insets["bottom"] = cutout.safeInsetBottom
        insets["top"] = cutout.safeInsetTop
        insets["left"] = cutout.safeInsetLeft
        insets["right"] = cutout.safeInsetRight
        return insets
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getInsets(): WritableMap {
        val insets = this.getInsetsMap()
        val map = WritableNativeMap()
        for((k, v) in insets){
            map.putInt(k, v)
        }
        return map
    }
}
