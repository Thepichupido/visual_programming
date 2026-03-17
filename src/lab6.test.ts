import { describe, it, expectTypeOf } from "vitest"
import type { DeepReadonly, PickedByType, EventHandlers } from "./lab6.js"
import { count, query } from "./lab6.js"

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

  type Result = DeepReadonly<Obj>

  it("creates deep readonly type", () => {
    expectTypeOf<Result>().toEqualTypeOf<{
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
    age: number
    active: boolean
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

  it("generates handler names", () => {
    expectTypeOf<Handlers>().toEqualTypeOf<{
      onClick: (event: { x: number; y: number }) => void
      onChange: (event: { value: string }) => void
    }>()
  })

})

describe("aggregate count", () => {

  it("counts items", () => {

    const users = [
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" }
    ]

    const result = query(users, count())

    expectTypeOf(result).toEqualTypeOf<number>()
  })

})