cmake_minimum_required(VERSION 3.10.2)
project("ffmpegwrapper")

# Set the source directory for C++ files
set(SRC_DIR ${CMAKE_SOURCE_DIR})

# Include FFmpeg headers (if needed by your native-lib.cpp)
include_directories(${SRC_DIR}/ffmpeg/include)

# Add the main native source file
add_library(
  ffmpegwrapper
  SHARED
  ${SRC_DIR}/native-lib.cpp
)

# Declare shared FFmpeg libraries
add_library(avcodec SHARED IMPORTED)
set_target_properties(avcodec PROPERTIES IMPORTED_LOCATION
  ${SRC_DIR}/../jniLibs/arm64-v8a/libavcodec.so)

add_library(avformat SHARED IMPORTED)
set_target_properties(avformat PROPERTIES IMPORTED_LOCATION
  ${SRC_DIR}/../jniLibs/arm64-v8a/libavformat.so)

add_library(avutil SHARED IMPORTED)
set_target_properties(avutil PROPERTIES IMPORTED_LOCATION
  ${SRC_DIR}/../jniLibs/arm64-v8a/libavutil.so)

add_library(swscale SHARED IMPORTED)
set_target_properties(swscale PROPERTIES IMPORTED_LOCATION
  ${SRC_DIR}/../jniLibs/arm64-v8a/libswscale.so)

# Android logging
find_library(log-lib log)

# Final linking
target_link_libraries(
  ffmpegwrapper
  avcodec
  avformat
  avutil
  swscale
  ${log-lib}
)