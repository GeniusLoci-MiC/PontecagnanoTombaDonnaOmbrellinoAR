import * as ecs from '@8thwall/ecs'
import { Logo } from './logo'
import { OBJECT_PLACED_EVENT } from './tap-to-place'

const logoQuery = ecs.defineQuery([Logo])

ecs.registerComponent({
  name: 'tap-to-place-button',
  stateMachine: ({world, entity, defineState}) => {
    defineState('nothing-placed')
      .initial()
      .onEvent(OBJECT_PLACED_EVENT, 'placed', {target: world.events.globalId})
      .onEnter(() => entity.show())
      .onExit(() => entity.hide())

    defineState('placed')
      .onEvent(ecs.input.UI_CLICK, 'resetting')
      
    defineState('resetting')
      .wait(1000, 'nothing-placed')
      .onEnter(() => {
      })
      .onExit(() => {
      })
  }
})
