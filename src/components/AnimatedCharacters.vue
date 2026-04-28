<template>
  <div ref="containerRef" class="characters-area">
    <!-- Back Row: Purple -->
    <div ref="purpleRef" class="character purple">
      <div ref="purpleFaceRef" class="face">
        <div class="eyes">
          <EyeBall :size="18" :pupil-size="9" pupil-color="#2D2D2D" />
          <EyeBall :size="18" :pupil-size="9" pupil-color="#2D2D2D" />
        </div>
      </div>
    </div>

    <!-- Back Row: Black -->
    <div ref="blackRef" class="character black">
      <div ref="blackFaceRef" class="face">
        <div class="eyes">
          <EyeBall :size="16" :pupil-size="8" pupil-color="#2D2D2D" />
          <EyeBall :size="16" :pupil-size="8" pupil-color="#2D2D2D" />
        </div>
      </div>
    </div>

    <!-- Front Row: Orange -->
    <div ref="orangeRef" class="character orange">
      <div ref="orangeFaceRef" class="face">
        <div class="eyes">
          <Pupil :size="12" :max-distance="5" pupil-color="#2D2D2D" />
          <Pupil :size="12" :max-distance="5" pupil-color="#2D2D2D" />
        </div>
      </div>
    </div>

    <!-- Front Row: Yellow -->
    <div ref="yellowRef" class="character yellow">
      <div ref="yellowFaceRef" class="face">
        <div class="eyes">
          <Pupil :size="12" :max-distance="5" pupil-color="#2D2D2D" />
          <Pupil :size="12" :max-distance="5" pupil-color="#2D2D2D" />
        </div>
        <div ref="yellowMouthRef" class="mouth" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineComponent, h } from 'vue'
import gsap from 'gsap'

/**
 * 登录页动态人物组件
 * 包含四个交互式角色（紫色、黑色、橙色、黄色），能够跟随鼠标移动并根据输入状态改变表情和动作
 *
 * Props:
 * @param {Boolean} isTyping - 是否正在输入（控制对视动画）
 * @param {Boolean} showPassword - 是否显示密码（切换偷看状态）
 * @param {Number} passwordLength - 密码长度（判断是否进入保护状态）
 */
const props = defineProps({
  isTyping: Boolean,
  showPassword: Boolean,
  passwordLength: {
    type: Number,
    default: 0
  }
})

/**
 * 子组件: Pupil (瞳孔)
 * 用于橙色和黄色角色，简单的圆点瞳孔
 */
const Pupil = defineComponent({
  props: ['size', 'maxDistance', 'pupilColor'],
  setup(props) {
    return () =>
      h('div', {
        class: 'pupil',
        'data-max-distance': props.maxDistance || 5,
        style: {
          width: `${props.size || 12}px`,
          height: `${props.size || 12}px`,
          borderRadius: '50%',
          backgroundColor: props.pupilColor || 'black',
          willChange: 'transform'
        }
      })
  }
})

/**
 * 子组件: EyeBall (眼球)
 * 用于紫色和黑色角色，包含眼眶和可移动的瞳孔，支持眨眼动画
 */
const EyeBall = defineComponent({
  props: ['size', 'pupilSize', 'maxDistance', 'eyeColor', 'pupilColor'],
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: 'eyeball',
          'data-max-distance': props.maxDistance || 10,
          style: {
            width: `${props.size || 48}px`,
            height: `${props.size || 48}px`,
            borderRadius: '50%',
            backgroundColor: props.eyeColor || 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            willChange: 'height'
          }
        },
        [
          h('div', {
            class: 'eyeball-pupil',
            style: {
              width: `${props.pupilSize || 16}px`,
              height: `${props.pupilSize || 16}px`,
              borderRadius: '50%',
              backgroundColor: props.pupilColor || 'black',
              willChange: 'transform'
            }
          })
        ]
      )
  }
})

const containerRef = ref(null)
const mouse = { x: 0, y: 0 } // 实时鼠标坐标
let rafId = 0 // RequestAnimationFrame ID

// 角色引用
const purpleRef = ref(null)
const blackRef = ref(null)
const yellowRef = ref(null)
const orangeRef = ref(null)

// 角色面部引用
const purpleFaceRef = ref(null)
const blackFaceRef = ref(null)
const yellowFaceRef = ref(null)
const orangeFaceRef = ref(null)
const yellowMouthRef = ref(null)

// GSAP 高性能优化对象，用于平滑更新样式
const quickToRefs = ref(null)
const blinkTimers = { purple: null, black: null } // 眨眼定时器
const isLooking = ref(false) // 是否正在进行“对视”动画
let lookingTimer = null

/**
 * 鼠标移动监听器
 */
const onMove = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

/**
 * 判断是否处于“隐藏密码”状态（即进入遮眼保护模式）
 */
const isHidingPassword = () => props.passwordLength > 0 && !props.showPassword
/**
 * 判断是否处于“显示密码”状态（即取消遮眼保护模式）
 */
const isShowingPassword = () => props.passwordLength > 0 && props.showPassword

onMounted(() => {
  if (!containerRef.value) return

  // 初始化 GSAP quickTo 实例，用于实现高性能、低延迟的动画跟随
  quickToRefs.value = {
    purpleSkew: gsap.quickTo(purpleRef.value, 'skewX', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    // ... 其他 quickTo 配置已略 ...
    blackSkew: gsap.quickTo(blackRef.value, 'skewX', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    orangeSkew: gsap.quickTo(orangeRef.value, 'skewX', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    yellowSkew: gsap.quickTo(yellowRef.value, 'skewX', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    purpleX: gsap.quickTo(purpleRef.value, 'x', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    blackX: gsap.quickTo(blackRef.value, 'x', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    purpleHeight: gsap.quickTo(purpleRef.value, 'height', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    blackHeight: gsap.quickTo(blackRef.value, 'height', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    purpleFaceLeft: gsap.quickTo(purpleFaceRef.value, 'left', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    purpleFaceTop: gsap.quickTo(purpleFaceRef.value, 'top', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    blackFaceLeft: gsap.quickTo(blackFaceRef.value, 'left', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    blackFaceTop: gsap.quickTo(blackFaceRef.value, 'top', {
      duration: 0.3,
      ease: 'power2.out'
    }),
    orangeFaceX: gsap.quickTo(orangeFaceRef.value, 'x', {
      duration: 0.2,
      ease: 'power2.out'
    }),
    orangeFaceY: gsap.quickTo(orangeFaceRef.value, 'y', {
      duration: 0.2,
      ease: 'power2.out'
    }),
    yellowFaceX: gsap.quickTo(yellowFaceRef.value, 'x', {
      duration: 0.2,
      ease: 'power2.out'
    }),
    yellowFaceY: gsap.quickTo(yellowFaceRef.value, 'y', {
      duration: 0.2,
      ease: 'power2.out'
    }),
    mouthX: gsap.quickTo(yellowMouthRef.value, 'x', {
      duration: 0.2,
      ease: 'power2.out'
    }),
    mouthY: gsap.quickTo(yellowMouthRef.value, 'y', {
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  /**
   * 计算角色身体和面部的位置偏转
   * @param {HTMLElement} el - 角色 DOM 引用
   * @returns {Object} 包含面部偏移和身体倾斜角度
   */
  const calcPos = (el) => {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 3
    const dx = mouse.x - cx
    const dy = mouse.y - cy
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120))
    }
  }

  /**
   * 计算眼球/瞳孔的偏移位置
   * @param {HTMLElement} el - 眼球 DOM 引用
   * @param {Number} maxDist - 最大偏移距离
   * @returns {Object} 包含 x 和 y 偏移量
   */
  const calcEyePos = (el, maxDist) => {
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = mouse.x - cx
    const dy = mouse.y - cy
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDist)
    const angle = Math.atan2(dy, dx)
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  }

  /**
   * 核心渲染循环
   * 使用 RequestAnimationFrame 实现平滑的动画效果
   */
  const tick = () => {
    if (document.hidden) {
      rafId = requestAnimationFrame(tick)
      return
    }

    const qt = quickToRefs.value
    if (!qt) return

    const hiding = isHidingPassword()
    const showing = isShowingPassword()
    const typing = props.isTyping
    const looking = isLooking.value

    if (!showing) {
      // 紫色角色动画逻辑
      const pp = calcPos(purpleRef.value)
      if (looking) {
        // 对视状态：身体稍微倾斜，高度增加
        qt.purpleSkew(pp.bodySkew - 5)
        qt.purpleX(10)
        qt.purpleHeight(410)
      } else if (typing) {
        // 输入状态：身体大幅度倾斜，准备“偷看”
        qt.purpleSkew(pp.bodySkew - 12)
        qt.purpleX(40)
        qt.purpleHeight(440)
      } else {
        // 正常状态
        qt.purpleSkew(pp.bodySkew)
        qt.purpleX(0)
        qt.purpleHeight(400)
      }

      if (!looking) {
        if (typing && hiding) {
          // 保护模式：面部位置固定在特定位置
          qt.purpleFaceLeft(55)
          qt.purpleFaceTop(40)
        } else {
          // 正常模式：面部跟随鼠标移动
          qt.purpleFaceLeft(
            45 + (pp.faceX >= 0 ? Math.min(25, pp.faceX * 1.5) : pp.faceX)
          )
          qt.purpleFaceTop(40 + pp.faceY)
        }
      }

      // 黑色角色动画逻辑
      const bp = calcPos(blackRef.value)
      if (looking) {
        qt.blackSkew(bp.bodySkew * 1.5 + 12)
        qt.blackX(-5)
        qt.blackHeight(310)
      } else if (typing) {
        qt.blackSkew(bp.bodySkew * 1.5)
        qt.blackX(0)
        qt.blackHeight(295)
      } else {
        qt.blackSkew(bp.bodySkew)
        qt.blackX(-10)
        qt.blackHeight(295)
      }

      if (!looking) {
        qt.blackFaceLeft(26 + bp.faceX)
        qt.blackFaceTop(32 + bp.faceY)
      }

      // 橙色和黄色角色：简单的跟随逻辑
      const op = calcPos(orangeRef.value)
      qt.orangeSkew(op.bodySkew)
      qt.orangeFaceX(op.faceX + 15)
      qt.orangeFaceY(op.faceY)

      const yp = calcPos(yellowRef.value)
      qt.yellowSkew(yp.bodySkew)
      qt.yellowFaceX(yp.faceX)
      qt.yellowFaceY(yp.faceY)
      qt.mouthX(yp.faceX)
      qt.mouthY(yp.faceY)

      // 更新瞳孔和眼球的实时偏移
      const allPupils = containerRef.value.querySelectorAll('.pupil')
      allPupils.forEach((el) => {
        const maxDist = Number(el.dataset.maxDistance) || 5
        const pos = calcEyePos(el, maxDist)
        gsap.set(el, { x: pos.x, y: pos.y })
      })

      const allEyeballs = containerRef.value.querySelectorAll('.eyeball')
      allEyeballs.forEach((el) => {
        // 对视期间，紫色和黑色的眼球由专门的 watch 逻辑控制，不跟随鼠标
        if (
          looking &&
          (blackRef.value?.contains(el) || purpleRef.value?.contains(el))
        )
          return

        const maxDist = Number(el.dataset.maxDistance) || 10
        const pupil = el.querySelector('.eyeball-pupil')
        if (pupil) {
          const pos = calcEyePos(el, maxDist)
          gsap.set(pupil, { x: pos.x, y: pos.y })
        }
      })
    }

    rafId = requestAnimationFrame(tick)
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  rafId = requestAnimationFrame(tick)

  // 眨眼逻辑
  const scheduleBlink = (character, selector, defaultSize) => {
    const eyeballs = character.querySelectorAll('.eyeball')
    if (!eyeballs.length) return

    const blink = () => {
      // 缩小眼眶高度模拟闭眼
      eyeballs.forEach((el) =>
        gsap.to(el, { height: 2, duration: 0.08, ease: 'power2.in' })
      )
      setTimeout(() => {
        // 恢复眼眶高度模拟睁眼
        eyeballs.forEach((el) =>
          gsap.to(el, {
            height: defaultSize,
            duration: 0.08,
            ease: 'power2.out'
          })
        )
        // 随机下次眨眼时间
        blinkTimers[selector] = setTimeout(blink, Math.random() * 4000 + 3000)
      }, 150)
    }
    blinkTimers[selector] = setTimeout(blink, Math.random() * 4000 + 3000)
  }

  scheduleBlink(purpleRef.value, 'purple', 20)
  scheduleBlink(blackRef.value, 'black', 18)
})

onUnmounted(() => {
  // 组件销毁时清除所有事件监听和定时器，防止内存泄漏
  window.removeEventListener('mousemove', onMove)
  cancelAnimationFrame(rafId)
  clearTimeout(blinkTimers.purple)
  clearTimeout(blinkTimers.black)
  clearTimeout(lookingTimer)
})

// 监听对视逻辑：当用户聚焦密码框时触发一次对视动画
watch(
  () => props.isTyping,
  (typing, prevTyping) => {
    if (typing && !prevTyping && !isShowingPassword()) {
      isLooking.value = true
      const qt = quickToRefs.value
      if (qt) {
        // 设置面部对视位置
        qt.purpleFaceLeft(55)
        qt.purpleFaceTop(65)
        qt.blackFaceLeft(32)
        qt.blackFaceTop(12)
      }
      // 瞳孔看向对方
      purpleRef.value?.querySelectorAll('.eyeball-pupil').forEach((p) => {
        gsap.to(p, {
          x: 3,
          y: 7,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      })
      blackRef.value?.querySelectorAll('.eyeball-pupil').forEach((p) => {
        gsap.to(p, {
          x: 0,
          y: -4,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      })

      clearTimeout(lookingTimer)
      // 1秒后结束对视动画，恢复自由跟随
      lookingTimer = setTimeout(() => {
        isLooking.value = false
        purpleRef.value?.querySelectorAll('.eyeball-pupil').forEach((p) => {
          gsap.killTweensOf(p)
        })
        blackRef.value?.querySelectorAll('.eyeball-pupil').forEach((p) => {
          gsap.killTweensOf(p)
        })
      }, 1000)
    } else {
      clearTimeout(lookingTimer)
      isLooking.value = false
    }
  }
)

// 监听偷看/隐藏状态：处理点击“小眼睛”切换密码显示时的整体动画
watch(
  () => [isHidingPassword(), isShowingPassword()],
  ([, showing]) => {
    const qt = quickToRefs.value
    if (!qt) return

    if (showing) {
      // 偷看模式动画：角色聚集，面部位置固定，瞳孔斜视
      qt.purpleSkew(0)
      qt.blackSkew(0)
      qt.orangeSkew(0)
      qt.yellowSkew(0)
      qt.purpleX(0)
      qt.blackX(0)
      qt.purpleHeight(350)

      qt.purpleFaceLeft(20)
      qt.purpleFaceTop(35)
      qt.blackFaceLeft(10)
      qt.blackFaceTop(28)
      qt.orangeFaceX(65 - 82)
      qt.orangeFaceY(85 - 90)
      qt.yellowFaceX(20 - 40)
      qt.yellowFaceY(35 - 40)
      qt.mouthX(0)
      qt.mouthY(0)

      // 瞳孔看向一侧
      const pupils = containerRef.value.querySelectorAll(
        '.eyeball-pupil, .pupil'
      )
      pupils.forEach((p) => {
        gsap.to(p, {
          x: -4,
          y: -4,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      })
    }
  }
)
</script>

<style scoped lang="scss">
.characters-area {
  position: relative;
  width: 550px;
  height: 400px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.character {
  position: absolute;
  bottom: 0;
  transform-origin: bottom center;
  will-change: transform, height;
}

.purple {
  left: 70px;
  width: 180px;
  height: 400px;
  background: #6c3ff5;
  border-radius: 10px 10px 0 0;
  z-index: 1;

  .face {
    top: 40px;
    left: 45px;
    gap: 32px;

    .eyes {
      gap: 32px;
    }
  }
}

.black {
  left: 240px;
  width: 120px;
  height: 295px;
  background: #2d2d2d;
  border-radius: 8px 8px 0 0;
  z-index: 3;

  .face {
    top: 32px;
    left: 26px;
    gap: 24px;

    .eyes {
      gap: 24px;
    }
  }
}

.orange {
  left: 0;
  width: 240px;
  height: 200px;
  background: #ff9b6b;
  border-radius: 120px 120px 0 0;
  z-index: 2;

  .face {
    top: 90px;
    left: 82px;
    gap: 32px;

    .eyes {
      gap: 32px;
    }
  }
}

.yellow {
  left: 310px;
  width: 140px;
  height: 230px;
  background: #e8d754;
  border-radius: 70px 70px 0 0;
  z-index: 4;

  .face {
    top: 40px;
    left: 40px;
    width: 60px; /* 与嘴巴宽度一致，方便居中 */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;

    .eyes {
      gap: 24px;
    }
  }

  .mouth {
    width: 60px;
    height: 3px;
    background: #2d2d2d;
    border-radius: 2px;
    margin-left: 0;
    position: relative; /* 改为相对定位，随 face 容器排列 */
  }
}

.face {
  position: absolute;
  display: flex;
  will-change: left, top;
}

.eyes {
  display: flex;
}
</style>
