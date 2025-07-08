package com.ffmpegwrapper

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

object FFmpegCommandBuilder {

  fun build(inputPath: String, outputPath: String, overlays: ReadableArray): List<String> {
    val commands = mutableListOf("-y", "-i", inputPath)
    val filterParts = mutableListOf<String>()

    var inputCount = 1 // video is input 0, images start from 1
    var lastOutput = "[0:v]"

    for (i in 0 until overlays.size()) {
      val overlay = overlays.getMap(i) ?: continue
      when (overlay.getString("type")) {
        "text" -> {
          val text = overlay.getString("text") ?: continue
          val fontSize = overlay.getIntOrDefault("fontSize", 24)
          val color = overlay.getString("fontColor") ?: "white"
          val position = overlay.getMap("position")
          val x = position?.getIntOrDefault("x", 10) ?: 10
          val y = position?.getIntOrDefault("y", 10) ?: 10
          val safeText = text.replace(":", "\\:")

          filterParts.add(
                  "$lastOutput drawtext=text='$safeText':fontcolor=$color:fontsize=$fontSize:x=$x:y=$y [v$i]"
          )
          lastOutput = "[v$i]"
        }
        "image" -> {
          val source = overlay.getString("source") ?: continue
          commands.addAll(listOf("-i", source))

          val position = overlay.getMap("position")
          val x = position?.getIntOrDefault("x", 10) ?: 10
          val y = position?.getIntOrDefault("y", 10) ?: 10

          val overlayLabel = "[v$i]"
          filterParts.add("$lastOutput [$inputCount:v] overlay=$x:$y $overlayLabel")
          lastOutput = overlayLabel
          inputCount++
        }
      }
    }

    if (filterParts.isNotEmpty()) {
      commands.addAll(listOf("-filter_complex", filterParts.joinToString("; ")))
      commands.addAll(listOf("-map", lastOutput))
    }

    commands.add(outputPath)
    return commands
  }

  // Extension helpers
  private fun ReadableMap.getIntOrDefault(key: String, default: Int): Int {
    return if (hasKey(key) && !isNull(key)) getInt(key) else default
  }

  private fun ReadableMap.getMap(key: String): ReadableMap? {
    return if (hasKey(key) && !isNull(key)) getMap(key) else null
  }

  private fun ReadableMap.getString(key: String): String? {
    return if (hasKey(key) && !isNull(key)) getString(key) else null
  }
}
