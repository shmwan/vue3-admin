<template>
  <easy-player
    muted="true"
    :autoplay="autoplay"
    :live="live"
    progress="true"
    has-audio="false"
    decode-type="auto"
    easy-stretch="true"
    reconnection="true"
    :poster="poster"
    :video-url="videoUrl"
    v-bind="$attrs"
  />
</template>

<script name="Index" setup lang="ts">
  //   video-url	视频地址	String	-
  // video-title	视频右上角显示的标题	String	-
  // poster	视频封面图片	String	-
  // auto-play	自动播放	Boolean	true
  // live	是否直播, 标识要不要显示进度条	Boolean	true
  // speed	是否显示倍速播放按钮。注意：当live为true时，此属性不生效	Boolean	true
  // loop	是否轮播。	Boolean	false
  // alt	视频流地址没有指定情况下, 视频所在区域显示的文字	String	无信号
  // muted	是否静音	Boolean	false
  // aspect	视频显示区域的宽高比	String	16:9
  // isaspect	视频显示区域是否强制宽高比	Boolean	true
  // loading	指示加载状态, 支持 sync 修饰符	String	-
  // fluent	流畅模式	Boolean	true
  // timeout	加载超时(秒)	Number	20
  // stretch	是否不同分辨率强制铺满窗口	Boolean	false
  // show-custom-button	是否在工具栏显示自定义按钮(极速/流畅, 拉伸/标准)	Boolean	true
  // isresolution	是否在播放 m3u8 时显示多清晰度选择	Boolean	false
  // isresolution	供选择的清晰度 "yh,fhd,hd,sd", yh:原始分辨率	fhd:超清，hd:高清，sd:标清	-
  // resolutiondefault	默认播放的清晰度	String	hd
  // isTransCoding	是否开启转raw	Boolean	false
  let { videoUrl, poster, live, autoplay } = withDefaults(
    defineProps<{
      videoUrl: string
      poster?: string
      live?: boolean
      autoplay?: boolean
    }>(),
    {
      'video-url': '',
      poster: '',
      live: true,
      autoplay: true
    }
  )
</script>

<style lang="less" scoped>
  :deep(.easy-player) {
    .easy-player-right-menu {
      display: none !important;
    }
    .video-js .easy-big-play-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #fff;
    }
    .easy-play-btn,
    .icon-luxiang2,
    .vjs-bitrate-control,
    .vjs-stretch-control {
      display: none !important;
    }
  }
</style>
