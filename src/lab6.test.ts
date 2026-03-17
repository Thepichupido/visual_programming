import { describe, it, expectTypeOf } from "vitest";
import type { DeepReadonly, PickedByType, EventHandlers } from "./lab6.js";

describe("DeepReadonly", () => {

  type Obj = {
    a: number
    b: {
      c: string
      d: {
        e: boolean
      }
    }
  }

  type ReadonlyObj = DeepReadonly<Obj>

  it("deep readonly structure", () => {
    expectTypeOf<ReadonlyObj>().toEqualTypeOf<{
      readonly a: number
      readonly b: {
        readonly c: string
        readonly d: {
          readonly e: boolean
        }
      }
    }>()
  })

})


describe("PickedByType", () => {

  type User = {
    id: number
    name: string
    active: boolean
    age: number
  }

  type Numbers = PickedByType<User, number>

  it("picks properties by type", () => {
    expectTypeOf<Numbers>().toEqualTypeOf<{
      id: number
      age: number
    }>()
  })

})


describe("EventHandlers", () => {

  type Events = {
    click: { x: number; y: number }
    change: { value: string }
  }

  type Handlers = EventHandlers<Events>

  it("creates event handlers", () => {
    expectTypeOf<Handlers>().toEqualTypeOf<{
      onClick: (event: { x: number; y: number }) => void
      onChange: (event: { value: string }) => void
    }>()
  })

})