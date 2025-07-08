#include <jni.h>
#include <string>
#include <android/log.h>
#include <cstdlib>
#include <cstdarg>

extern "C" {
#include <libavutil/log.h>
}

// Android log macros
#define LOG_TAG "FFMPEG_WRAPPER"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

// No ffmpeg_main in Option 2 – we're using precompiled .so files
// extern "C" int ffmpeg_main(int argc, char** argv); // ❌ REMOVE

static JavaVM* g_vm = nullptr;

void ffmpeg_log_callback(void* ptr, int level, const char* fmt, va_list vargs) {
    if (level > AV_LOG_INFO) return;

    char buffer[1024];
    vsnprintf(buffer, sizeof(buffer), fmt, vargs);

    LOGI("[FFmpeg] %s", buffer);

    JNIEnv* env = nullptr;
    if (!g_vm || g_vm->AttachCurrentThread(&env, nullptr) != JNI_OK) return;

    jclass clazz = env->FindClass("com/ffmpegwrapper/FFmpegNative");
    if (!clazz) return;

    jmethodID method = env->GetStaticMethodID(clazz, "dispatchLogFromNative", "(Ljava/lang/String;)V");
    if (!method) return;

    jstring logStr = env->NewStringUTF(buffer);
    env->CallStaticVoidMethod(clazz, method, logStr);
    env->DeleteLocalRef(logStr);
}

extern "C"
JNIEXPORT jint JNICALL
Java_com_ffmpegwrapper_FFmpegNative_runCommand(
        JNIEnv* env,
        jobject /* this */,
        jobjectArray commandArray
) {
    int argc = env->GetArrayLength(commandArray);
    if (argc == 0) {
        LOGE("❌ Empty FFmpeg command received.");
        return -1;
    }

    char** argv = (char**) malloc(sizeof(char*) * argc);
    for (int i = 0; i < argc; ++i) {
        jstring jstr = (jstring) env->GetObjectArrayElement(commandArray, i);
        const char* arg = env->GetStringUTFChars(jstr, nullptr);
        argv[i] = strdup(arg);
        env->ReleaseStringUTFChars(jstr, arg);
        env->DeleteLocalRef(jstr);
    }

    LOGI("🚀 Running FFmpeg with args (stub):");
    for (int i = 0; i < argc; ++i) {
        LOGI("  argv[%d]: %s", i, argv[i]);
    }

    av_log_set_callback(ffmpeg_log_callback);

    // ⚠️ Option 2: Cannot run ffmpeg_main — use stub result or launch via command-line if needed
    LOGE("⚠️ ffmpeg_main is not available in prebuilt .so. Implement native command runner or shell exec.");
    int result = -1; // Stub failure code or success (0) for now

    for (int i = 0; i < argc; ++i) {
        free(argv[i]);
    }
    free(argv);

    return result;
}

jint JNI_OnLoad(JavaVM* vm, void*) {
    g_vm = vm;
    LOGI("🔌 JNI_OnLoad: JavaVM registered.");
    return JNI_VERSION_1_6;
}