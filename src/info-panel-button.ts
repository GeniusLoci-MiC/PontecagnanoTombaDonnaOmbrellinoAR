import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'info-panel-button',
  schema: {
    navigationUrl: 'string',
  },
  stateMachine: ({ world, entity, defineState, schemaAttribute }) => {
    let infoPanel: ecs.Entity | null = null
    let navButton: ecs.Entity | null = null

    const refreshChildren = () => {
      const children = entity.getChildren()
      console.log('info-panel-button children', children.length)

      infoPanel = children.find((child) => child.getChildren().length > 0) || null
      if (!infoPanel) {
        console.log('info-panel-button: InfoPanel not found')
        return
      }

      navButton = infoPanel.getChildren().find((child) => child.getChildren().length > 0) || null
      if (!navButton) {
        console.log('info-panel-button: NavButton not found')
      }
    }

    const toggleInfoPanel = () => {
      if (!infoPanel) {
        refreshChildren()
      }
      if (!infoPanel) {
        return
      }
      if (infoPanel.isHidden()) {
        infoPanel.show()
      } else {
        infoPanel.hide()
      }
    }

    const handleRootTap = () => {
      toggleInfoPanel()
    }

    const handleNavTap = () => {
      const schema = schemaAttribute.get(entity.eid)
      if (!schema.navigationUrl) {
        return
      }
      
      window.open(schema.navigationUrl, '_blank')
    }

    const attachListeners = () => {
      refreshChildren()
      world.events.addListener(entity.eid, ecs.input.UI_CLICK, handleRootTap)
      if (navButton) {
        world.events.addListener(navButton.eid, ecs.input.UI_CLICK, handleNavTap)
      }
    }

    const removeListeners = () => {
      world.events.removeListener(entity.eid, ecs.input.UI_CLICK, handleRootTap)
      if (navButton) {
        world.events.removeListener(navButton.eid, ecs.input.UI_CLICK, handleNavTap)
      }
    }

    defineState('initial')
      .initial()
      .onEnter(() => {
        // console.log("attached")
        refreshChildren()
        if (infoPanel) {
          infoPanel.hide()
        }
        attachListeners()
      })
      .onExit(() => {
        removeListeners()
      })
  },
})
