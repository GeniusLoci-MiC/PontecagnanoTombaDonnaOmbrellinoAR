import * as ecs from '@8thwall/ecs'

const TAG_TAPPED_EVENT = 'overlay-info-panel:tag-tapped'

ecs.registerComponent({
  name: 'info-3d-tag',
  schema: {
    infoText: 'string',
    url: 'string',
  },
  stateMachine: ({ world, eid, schemaAttribute, defineState }) => {
    const handleTap = () => {
      const schema = schemaAttribute.get(eid)
      /*
      if (!schema.infoText || !schema.url) {
        return
      }
        */
      world.events.dispatch(world.events.globalId, TAG_TAPPED_EVENT, {
        infoText: schema.infoText,
        url: schema.url,
      })
    }

    defineState('initial')
      .initial()
      .onEnter(() => {
        world.events.addListener(eid, ecs.input.UI_CLICK, handleTap)
      })
      .onExit(() => {
        world.events.removeListener(eid, ecs.input.UI_CLICK, handleTap)
      })
  },
})
