import * as ecs from '@8thwall/ecs'

const OBJECT_PLACED_EVENT = 'object-placed'

// Map to store internal placement counts without exposing them in the inspector
const placementCounts = new Map()

ecs.registerComponent({
  name: 'tap-to-place',
  schema: {
    prefab: 'eid',
    maxPlacedObjects: 'ui32'
  },
  stateMachine: ({world, eid, schemaAttribute, defineState}) => {
    defineState('initial').initial().listen(eid,  ecs.input.SCREEN_TOUCH_START, (e) => {
      if (!e.data.worldPosition) {
        return
      }
      const schema = schemaAttribute.get(eid)
      const currentCount = placementCounts.get(eid) || 0
      
      // Skip placement if max placed objects limit is reached
      if (currentCount >= schema.maxPlacedObjects) {
        return
      }
      const newEid = world.createEntity(schema.prefab)
      const newEntity = world.getEntity(newEid)
      newEntity.setLocalPosition(e.data.worldPosition)
      // newEntity.set(ecs.Quaternion, ecs.math.quat.yRadians(Math.random() * Math.PI))
      // Increment the placement counter
      placementCounts.set(eid, currentCount + 1)
      world.events.dispatch(eid, OBJECT_PLACED_EVENT)
    })
  }
})

export {
  OBJECT_PLACED_EVENT,
}

// Reset placement counters. If `eid` is provided, reset only that entry,
// otherwise reset all stored counts to zero.
export function resetPlacementCounts(eid?: number) {
  if (typeof eid === 'number') {
    placementCounts.set(eid, 0)
    return
  }
  for (const key of placementCounts.keys()) {
    placementCounts.set(key, 0)
  }
}
