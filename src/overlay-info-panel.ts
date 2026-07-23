import * as ecs from '@8thwall/ecs'

const TAG_TAPPED_EVENT = 'overlay-info-panel:tag-tapped'

const isDescendantOrSelf = (world: ecs.World, targetEid: ecs.Eid | undefined, rootEid: ecs.Eid) => {
  if (targetEid === undefined) {
    return false
  }

  let current = world.getEntity(targetEid)
  while (current) {
    if (current.eid === rootEid) {
      return true
    }
    current = current.getParent()
  }
  return false
}

ecs.registerComponent({
  name: 'overlay-info-panel',
  schema: {
    infoTextEntity: ecs.eid,
    navButtonEntity: ecs.eid,
    // closeOnOutsideTap: 'boolean',
  },
  stateMachine: ({ world, entity, schemaAttribute, defineState }) => {
    let infoTextEntity: ecs.Entity | null = null
    let navButtonEntity: ecs.Entity | null = null
    let currentUrl = ''

    const refreshEntities = () => {
      const schema = schemaAttribute.get(entity.eid)
      infoTextEntity = schema.infoTextEntity ? world.getEntity(schema.infoTextEntity) : null
      navButtonEntity = schema.navButtonEntity ? world.getEntity(schema.navButtonEntity) : null
    }

    const setInfoText = (text: string) => {
      if (!infoTextEntity) {
        return
      }
      infoTextEntity.set(ecs.Ui, { text })
    }

    const showPanel = () => {
      console.log("showing")
      entity.show()

      
      if(currentUrl == '')
      {
        navButtonEntity.disable();
        navButtonEntity.hide();
      }
      else
      {
        navButtonEntity.enable();
        navButtonEntity.show();
      }
      
      ecs.Ui.set(world, entity.eid, {
        ignoreRaycast: false,
      })

      ecs.Ui.set(world, infoTextEntity.eid, {
        ignoreRaycast: false,
      })

    }

    const hidePanel = () => {
      console.log("hiding")
      entity.hide()
      navButtonEntity.disable();
   
      ecs.Ui.set(world, entity.eid, {
        ignoreRaycast: true,
      })

      ecs.Ui.set(world, infoTextEntity.eid, {
        ignoreRaycast: true,
      })

    }

    const onTagTapped = (event: any) => {
      const { infoText, url } = event.data
      setInfoText(infoText)
      currentUrl = url
      showPanel()
    }

    const onNavButtonClicked = () => {
      if (!currentUrl) {
        return
      }
      window.open(currentUrl, '_blank')
    }

    const onOutsideTap = (event: any) => {
      if (entity.isHidden()) {
        return
      }

      /*
      const schema = schemaAttribute.get(entity.eid)
      if (!schema.closeOnOutsideTap) {
        return
      }
        */


      // if (!isDescendantOrSelf(world, event.target, entity.eid)) {
        hidePanel()
      // }
    }

    defineState('initial')
      .initial()
      .onEnter(() => {
        refreshEntities()
        hidePanel()
        world.events.addListener(world.events.globalId, TAG_TAPPED_EVENT, onTagTapped)
        world.events.addListener(world.events.globalId, ecs.input.UI_CLICK, onOutsideTap)
        if (navButtonEntity) {
          world.events.addListener(navButtonEntity.eid, ecs.input.UI_CLICK, onNavButtonClicked)
        }
      })
      .onExit(() => {
        world.events.removeListener(world.events.globalId, TAG_TAPPED_EVENT, onTagTapped)
        world.events.removeListener(world.events.globalId, ecs.input.UI_CLICK, onOutsideTap)
        if (navButtonEntity) {
          world.events.removeListener(navButtonEntity.eid, ecs.input.UI_CLICK, onNavButtonClicked)
        }
      })
  },
})
