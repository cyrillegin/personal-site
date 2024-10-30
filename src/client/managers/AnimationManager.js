import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    LoopOnce,
    VectorKeyframeTrack,
  } from 'three'
import { ThreeManager } from '../ThreeManager'

class AnimationManager {
    mixers = []
 
    update(delta) {
        for (const mixer of this.mixers) {
            mixer.update(delta)
        }
    }
}

const inst = new AnimationManager()
export { inst as AnimationManager }

export const createTrack = (key, start, end, duration) =>
    new VectorKeyframeTrack(`.${key}`, [0, duration], [start[key], end[key]])

export const playAnimationActions = (animation) => {
    if (Array.isArray(animation)) {
      animation.forEach(anim => anim.play())
    } else {
      animation.play()
    }
  }

export const playAnimation = (tracks, target, duration, onAnimationEnd) => {
    const clip = new AnimationClip('animation', duration, tracks)
    const mixer = new AnimationMixer(target)
    onAnimationEnd && mixer.addEventListener( 'finished', onAnimationEnd)
    const clipAction = mixer.clipAction(clip)
    clipAction.loop = LoopOnce
    clipAction.clampWhenFinished = true
    playAnimationActions(clipAction)
    inst.mixers.push(mixer)
  }